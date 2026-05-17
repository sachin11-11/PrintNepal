import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin-session";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAdmin(request: NextRequest) {
  try {
    const token =
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
      request.nextUrl.searchParams.get("token") ??
      request.cookies.get("printnepal-admin-token")?.value;

    if (!token) {
      return {
        error: NextResponse.json({ error: "Missing authorization token." }, { status: 401 })
      };
    }

    const localAdmin = verifyAdminSessionToken(token);
    if (localAdmin) {
      return {
        adminClient: createAdminSupabaseClient(),
        user: {
          id: "printnepal-local-admin",
          email: localAdmin.email
        }
      };
    }

    const authClient = createServerSupabaseClient(token);
    const { data: userData, error: userError } = await authClient.auth.getUser(token);

    if (userError || !userData.user) {
      return {
        error: NextResponse.json({ error: "Invalid session." }, { status: 401 })
      };
    }

    const adminClient = createAdminSupabaseClient();
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      return {
        error: NextResponse.json({ error: "Admin access required." }, { status: 403 })
      };
    }

    return { adminClient, user: userData.user };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin authentication failed.";
    const isMissingAdminConfig = message.includes("Missing NEXT_PUBLIC_SUPABASE_URL") || message.includes("SUPABASE_SERVICE_ROLE_KEY");

    return {
      error: NextResponse.json(
        { error: isMissingAdminConfig ? "Admin database is not configured." : message },
        { status: 500 }
      )
    };
  }
}
