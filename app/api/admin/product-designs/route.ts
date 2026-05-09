import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { productDesignSchema } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);

  if ("error" in auth) {
    return auth.error;
  }

  const { data, error } = await auth.adminClient
    .from("product_designs")
    .select("*, services(title, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ designs: data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);

  if ("error" in auth) {
    return auth.error;
  }

  const parsed = productDesignSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid design data." }, { status: 400 });
  }

  const { data, error } = await auth.adminClient
    .from("product_designs")
    .insert(parsed.data)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ design: data }, { status: 201 });
}
