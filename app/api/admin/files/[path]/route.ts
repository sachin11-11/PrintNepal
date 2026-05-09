import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string } }
) {
  const auth = await requireAdmin(request);

  if ("error" in auth) {
    return auth.error;
  }

  const { data, error } = await auth.adminClient.storage
    .from("design-files")
    .createSignedUrl(params.path, 60);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
