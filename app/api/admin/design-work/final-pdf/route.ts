import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { finalPdfPath } from "@/lib/file-paths";

const FINAL_DESIGNS_BUCKET = "final-designs";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);

  if ("error" in auth) {
    return auth.error;
  }

  const formData = await request.formData();
  const orderId = formData.get("order_id");
  const file = formData.get("file");

  if (typeof orderId !== "string" || !orderId) {
    return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "PDF file is required." }, { status: 400 });
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Final print file must be a PDF." }, { status: 400 });
  }

  const { data: existingOrder, error: orderError } = await auth.adminClient
    .from("orders")
    .select("customer_name")
    .eq("id", orderId)
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const path = finalPdfPath(orderId, existingOrder.customer_name, file.name.replace(/\.pdf$/i, ""));
  const { error: uploadError } = await auth.adminClient.storage
    .from(FINAL_DESIGNS_BUCKET)
    .upload(path, file, {
      contentType: "application/pdf",
      upsert: false
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = auth.adminClient.storage.from(FINAL_DESIGNS_BUCKET).getPublicUrl(path);
  const { data: order, error: updateError } = await auth.adminClient
    .from("orders")
    .update({ final_design_url: data.publicUrl })
    .eq("id", orderId)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ order, final_design_url: data.publicUrl });
}
