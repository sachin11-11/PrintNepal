import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { orderStatusSchema, paymentStatusSchema } from "@/lib/validations/order";
import type { Database } from "@/lib/supabase/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const update: Database["public"]["Tables"]["orders"]["Update"] = {};

  if (body.status) {
    const parsed = orderStatusSchema.safeParse(body.status);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }
    update.status = parsed.data;
  }

  if (body.payment_status) {
    const parsed = paymentStatusSchema.safeParse(body.payment_status);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
    }
    update.payment_status = parsed.data;
  }

  const { data, error } = await auth.adminClient
    .from("orders")
    .update(update)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}
