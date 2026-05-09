import { createBrowserSupabaseClient } from "./client";
import { createServerSupabaseClient } from "./server";
import type { MaterialRow, OrderInsert, OrderRow, ProductDesignRow, ProductTemplateRow, ServiceRow } from "./types";

type SupabaseMode = "browser" | "server";

function getSupabase(mode: SupabaseMode = "server", accessToken?: string) {
  if (mode === "browser") {
    return createBrowserSupabaseClient();
  }

  return createServerSupabaseClient(accessToken);
}

export async function getServices(options?: {
  mode?: SupabaseMode;
  accessToken?: string;
}): Promise<ServiceRow[]> {
  const supabase = getSupabase(options?.mode, options?.accessToken);
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", "wedding-catalogs-cards")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch services: ${error.message}`);
  }

  return data;
}

export async function searchServices(
  query: string,
  options?: {
    mode?: SupabaseMode;
    accessToken?: string;
  }
): Promise<ServiceRow[]> {
  const supabase = getSupabase(options?.mode, options?.accessToken);
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return getServices(options);
  }

  const escapedQuery = normalizedQuery.replace(/[%_]/g, "\\$&");
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", "wedding-catalogs-cards")
    .or(
      [
        `title.ilike.%${escapedQuery}%`,
        `slug.ilike.%${escapedQuery}%`,
        `category.ilike.%${escapedQuery}%`,
        `description.ilike.%${escapedQuery}%`
      ].join(",")
    )
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to search services: ${error.message}`);
  }

  return data;
}

export async function searchMaterials(
  query: string,
  options?: {
    mode?: SupabaseMode;
    accessToken?: string;
  }
): Promise<MaterialRow[]> {
  const supabase = getSupabase(options?.mode, options?.accessToken);
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }

    return data;
  }

  const escapedQuery = normalizedQuery.replace(/[%_]/g, "\\$&");
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .or(
      [
        `name.ilike.%${escapedQuery}%`,
        `type.ilike.%${escapedQuery}%`,
        `size.ilike.%${escapedQuery}%`,
        `finish.ilike.%${escapedQuery}%`,
        `description.ilike.%${escapedQuery}%`
      ].join(",")
    )
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to search materials: ${error.message}`);
  }

  return data;
}

export async function getMaterials(options?: {
  mode?: SupabaseMode;
  accessToken?: string;
}): Promise<MaterialRow[]> {
  return searchMaterials("", options);
}

export async function getProductDesigns(options?: {
  mode?: SupabaseMode;
  accessToken?: string;
}): Promise<ProductDesignRow[]> {
  const supabase = getSupabase(options?.mode, options?.accessToken);
  const { data, error } = await supabase
    .from("product_designs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch product designs: ${error.message}`);
  }

  return data;
}

export type ProductTemplateWithService = ProductTemplateRow & {
  services?: { title: string; slug: string; category: string | null } | null;
};

export async function getProductTemplates(options?: {
  query?: string;
  mode?: SupabaseMode;
  accessToken?: string;
}): Promise<ProductTemplateWithService[]> {
  const supabase = getSupabase(options?.mode, options?.accessToken);
  const normalizedQuery = options?.query?.trim();
  let query = supabase
    .from("product_templates")
    .select("*, services(title, slug, category)")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (normalizedQuery) {
    const escapedQuery = normalizedQuery.replace(/[%_]/g, "\\$&");
    query = query.or(
      [
        `title.ilike.%${escapedQuery}%`,
        `slug.ilike.%${escapedQuery}%`,
        `category.ilike.%${escapedQuery}%`
      ].join(",")
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch product templates: ${error.message}`);
  }

  return data;
}

export async function getProductTemplateById(id: string): Promise<ProductTemplateWithService | null> {
  const supabase = getSupabase("server");
  const { data, error } = await supabase
    .from("product_templates")
    .select("*, services(title, slug, category)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch product template: ${error.message}`);
  }

  return data;
}

export async function getProductTemplateByIdentifier(identifier: string): Promise<ProductTemplateWithService | null> {
  const byId = await getProductTemplateById(identifier);
  if (byId) return byId;

  const supabase = getSupabase("server");
  const { data, error } = await supabase
    .from("product_templates")
    .select("*, services(title, slug, category)")
    .eq("slug", identifier)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch product template: ${error.message}`);
  }

  return data;
}

export async function createOrder(
  data: OrderInsert,
  options?: {
    mode?: SupabaseMode;
    accessToken?: string;
  }
): Promise<OrderRow> {
  const supabase = getSupabase(options?.mode, options?.accessToken);
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      ...data,
      status: data.status ?? "received"
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return order;
}

export async function getOrderByEmailAndId(
  email: string,
  orderId: string,
  options?: {
    mode?: SupabaseMode;
    accessToken?: string;
  }
): Promise<OrderRow | null> {
  const supabase = getSupabase(options?.mode, options?.accessToken);
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .ilike("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data;
}
