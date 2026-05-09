import { z } from "zod";

export const designMethods = ["uploaded", "email_design", "need_design"] as const;
export const orderStatuses = ["received", "designing", "printing", "ready", "delivered", "cancelled"] as const;
export const paymentStatuses = ["pending", "confirmed", "paid", "failed", "refunded"] as const;

export const orderSchema = z.object({
  customer_name: z.string().trim().min(2, "Customer name is required."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(6, "Phone number is required."),
  service_id: z.string().uuid("Select a service."),
  selected_design_id: z.string().uuid().optional().or(z.literal("")),
  paper_size: z.string().trim().min(1, "Paper size is required."),
  paper_type: z.string().trim().min(1, "Paper type or material is required."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  design_method: z.enum(designMethods),
  notes: z.string().trim().max(2000).optional()
});

export const trackOrderSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  orderId: z.string().trim().uuid("Enter a valid order ID.")
});

export const orderStatusSchema = z.enum(orderStatuses);
export const paymentStatusSchema = z.enum(paymentStatuses);
