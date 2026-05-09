import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { orderStatusSchema, paymentStatusSchema } from "@/lib/validations/order";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);

  if ("error" in auth) {
    return auth.error;
  }

  const status = request.nextUrl.searchParams.get("status");
  const paymentStatus = request.nextUrl.searchParams.get("payment_status");
  const serviceId = request.nextUrl.searchParams.get("service_id");
  let query = auth.adminClient
    .from("orders")
    .select("*, services(title), product_templates(title, thumbnail_url), product_designs(title, image_url)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    const parsedStatus = orderStatusSchema.safeParse(status);

    if (!parsedStatus.success) {
      return NextResponse.json({ error: "Invalid status filter." }, { status: 400 });
    }

    query = query.eq("status", parsedStatus.data);
  }
  if (paymentStatus && paymentStatus !== "all") {
    const parsedPaymentStatus = paymentStatusSchema.safeParse(paymentStatus);

    if (!parsedPaymentStatus.success) {
      return NextResponse.json({ error: "Invalid payment status filter." }, { status: 400 });
    }

    query = query.eq("payment_status", parsedPaymentStatus.data);
  }
  if (serviceId && serviceId !== "all") {
    query = query.eq("service_id", serviceId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
