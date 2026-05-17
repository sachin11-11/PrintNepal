"use server";

import { redirect } from "next/navigation";
import { customerUploadPath } from "@/lib/file-paths";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { OrderRow } from "@/lib/supabase/types";
import { orderSchema, trackOrderSchema } from "@/lib/validations/order";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const DESIGN_BUCKET = "design-files";

export type ActionState = {
  ok: boolean;
  message?: string;
  order?: OrderRow | null;
  errors?: Record<string, string>;
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function zodErrors(error: unknown) {
  if (!error || typeof error !== "object" || !("flatten" in error)) {
    return undefined;
  }

  const flattened = (error as { flatten: () => { fieldErrors: Record<string, string[]> } }).flatten();
  return Object.fromEntries(
    Object.entries(flattened.fieldErrors)
      .filter(([, messages]) => messages[0])
      .map(([key, messages]) => [key, messages[0]])
  );
}

async function ensureDesignBucket() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.storage.getBucket(DESIGN_BUCKET);

  if (!data) {
    await supabase.storage.createBucket(DESIGN_BUCKET, {
      public: false,
      fileSizeLimit: 25 * 1024 * 1024
    });
  }
}

export async function createOrderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = orderSchema.safeParse({
    customer_name: formValue(formData, "customer_name"),
    email: formValue(formData, "email"),
    phone: formValue(formData, "phone"),
    service_id: formValue(formData, "service_id"),
    selected_design_id: formValue(formData, "selected_design_id"),
    paper_size: formValue(formData, "paper_size"),
    paper_type: formValue(formData, "paper_type"),
    quantity: formValue(formData, "quantity"),
    design_method: formValue(formData, "design_method"),
    notes: formValue(formData, "notes")
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: zodErrors(parsed.error)
    };
  }

  const supabase = createAdminSupabaseClient();
  let designFileUrl: string | null = null;
  const file = formData.get("design_file");
  const createdOrderId = crypto.randomUUID();

  try {
    if (file instanceof File && file.size > 0) {
      await ensureDesignBucket();
      const path = customerUploadPath(createdOrderId, parsed.data.customer_name, file.name);
      const { error: uploadError } = await supabase.storage
        .from(DESIGN_BUCKET)
        .upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      designFileUrl = path;
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        id: createdOrderId,
        ...parsed.data,
        selected_design_id: parsed.data.selected_design_id || null,
        design_file_url: designFileUrl,
        status: "received"
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    const { data: service } = data.service_id
      ? await supabase.from("services").select("title").eq("id", data.service_id).maybeSingle()
      : { data: null };
    const whatsappLink = buildWhatsAppLink(process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER, {
      orderId: data.id,
      customerName: data.customer_name,
      productName: service?.title ?? "Print product",
      quantity: data.quantity,
      material: data.paper_type,
      trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/track-order`.replace(/^\/track/, "/track"),
      finalDesignUrl: null
    });

    if (whatsappLink) {
      await supabase.from("orders").update({ whatsapp_link: whatsappLink }).eq("id", data.id);
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not create order."
    };
  }

  redirect(`/order/confirmation?orderId=${createdOrderId}`);
}

export async function trackOrderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = trackOrderSchema.safeParse({
    email: formValue(formData, "email"),
    orderId: formValue(formData, "orderId")
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Enter the email and order ID used for the order.",
      errors: zodErrors(parsed.error)
    };
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", parsed.data.orderId)
    .ilike("email", parsed.data.email)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  if (!data) {
    return {
      ok: false,
      message: "No order found for that email and order ID.",
      order: null
    };
  }

  return { ok: true, order: data };
}

export async function getOrderForConfirmation(orderId: string) {
  const parsed = trackOrderSchema.shape.orderId.safeParse(orderId);

  if (!parsed.success) {
    return null;
  }

  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("id", parsed.data)
    .maybeSingle();

  return data;
}
