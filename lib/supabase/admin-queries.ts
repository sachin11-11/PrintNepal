import "server-only";

import { createAdminSupabaseClient } from "./admin";
import type { OrderRow, OrderStatus } from "./types";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<OrderRow> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  return data;
}
