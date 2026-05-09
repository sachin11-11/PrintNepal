import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { estimateCompletionMinutes, estimateDeliveryMinutes, haversineDistanceKm } from "@/lib/location/distance";
import { getLocalTemplateByIdentifier } from "@/lib/templates/catalog";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function dataUrlToBuffer(dataUrl: string) {
  const [, base64 = ""] = dataUrl.split(",");
  return Buffer.from(base64, "base64");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createAdminSupabaseClient();

  const templateIdentifier = typeof body.template_id === "string" ? body.template_id.trim() : "";
  const localTemplate = templateIdentifier ? getLocalTemplateByIdentifier(templateIdentifier) : null;

  let template = null;
  let templateError: { message: string; code?: string } | null = null;

  if (templateIdentifier && isUuid(templateIdentifier)) {
    const result = await supabase
      .from("product_templates")
      .select("*, services(title)")
      .eq("id", templateIdentifier)
      .single();
    template = result.data;
    templateError = result.error;
  } else if (templateIdentifier) {
    const result = await supabase
      .from("product_templates")
      .select("*, services(title)")
      .eq("slug", templateIdentifier)
      .single();
    template = result.data;
    templateError = result.error;
  }

  if (templateError && templateError.code !== "PGRST116") {
    return NextResponse.json({ error: templateError.message }, { status: 500 });
  }

  if (!template && !localTemplate) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  const templateTitle = template?.title ?? localTemplate?.title ?? body.template_title ?? "Print template";
  const templateCategory = template?.category ?? localTemplate?.category ?? body.template_category ?? null;
  const templateServiceTitle = template?.services?.title ?? body.template_service_title ?? null;
  const templateForCompletion = templateServiceTitle ?? templateTitle;

  let finalDesignUrl: string | null = null;

  if (typeof body.final_design_png === "string" && body.final_design_png.startsWith("data:image/png")) {
    const path = `${crypto.randomUUID()}.png`;
    const { error: uploadError } = await supabase.storage
      .from("final-designs")
      .upload(path, dataUrlToBuffer(body.final_design_png), {
        contentType: "image/png",
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from("final-designs").getPublicUrl(path);
    finalDesignUrl = data.publicUrl;
  }

  const shopLat = Number(process.env.NEXT_PUBLIC_SHOP_LAT);
  const shopLng = Number(process.env.NEXT_PUBLIC_SHOP_LNG);
  const customerLat = body.customer_lat ? Number(body.customer_lat) : null;
  const customerLng = body.customer_lng ? Number(body.customer_lng) : null;
  const distanceKm =
    Number.isFinite(shopLat) && Number.isFinite(shopLng) && customerLat !== null && customerLng !== null
      ? Number(haversineDistanceKm({ lat: shopLat, lng: shopLng }, { lat: customerLat, lng: customerLng }).toFixed(2))
      : null;
  const deliveryMinutes = distanceKm === null ? null : estimateDeliveryMinutes(distanceKm);
  const completionEstimate = estimateCompletionMinutes(templateForCompletion);

  const { data: orderResult, error } = await supabase
    .from("orders")
    .insert({
      customer_name: body.customer_name,
      email: body.email,
      phone: body.phone,
      service_id: template?.service_id ?? null,
      selected_template_id: template?.id ?? null,
      final_design_url: finalDesignUrl,
      final_design_json: body.final_design_json ?? null,
      customer_lat: customerLat,
      customer_lng: customerLng,
      delivery_distance_km: distanceKm,
      estimated_delivery_minutes: deliveryMinutes,
      estimated_completion_minutes: completionEstimate,
      paper_size: body.paper_size || templateCategory || "Custom",
      paper_type: body.material || "Standard",
      quantity: Number(body.quantity || 1),
      design_method: "uploaded",
      notes: body.notes,
      status: "received",
      payment_status: "pending"
    })
    .select("*, services(title), product_templates(title)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const order = orderResult as any;
  const origin = request.nextUrl.origin;
  const trackingUrl = `${origin}/track-order`;
  const whatsappLink = buildWhatsAppLink(process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER, {
    orderId: order.id,
    customerName: order.customer_name,
    productName: order.services?.title ?? templateServiceTitle ?? "Print product",
    templateName: order.product_templates?.title ?? templateTitle,
    quantity: order.quantity,
    material: order.paper_type,
    trackingUrl,
    finalDesignUrl
  });

  if (whatsappLink) {
    await supabase.from("orders").update({ whatsapp_link: whatsappLink }).eq("id", order.id);
  }

  return NextResponse.json({ orderId: order.id, whatsappLink }, { status: 201 });
}
