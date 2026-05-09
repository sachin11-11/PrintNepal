import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { materialSchema } from "@/lib/validations/admin";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(request);

  if ("error" in auth) {
    return auth.error;
  }

  const parsed = materialSchema.partial().safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid material data." }, { status: 400 });
  }

  const { data, error } = await auth.adminClient
    .from("materials")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ material: data });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(request);

  if ("error" in auth) {
    return auth.error;
  }

  const { error } = await auth.adminClient.from("materials").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
