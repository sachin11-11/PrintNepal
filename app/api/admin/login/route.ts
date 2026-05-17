import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, adminCredentialsAreValid, createAdminSessionToken } from "@/lib/admin-session";

const SESSION_SECONDS = 60 * 60 * 8;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!adminCredentialsAreValid(email, password)) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const token = createAdminSessionToken(ADMIN_EMAIL);
  const response = NextResponse.json({ token });

  response.cookies.set("printnepal-admin-session", "1", {
    httpOnly: false,
    maxAge: SESSION_SECONDS,
    path: "/",
    sameSite: "lax"
  });
  response.cookies.set("printnepal-admin-token", token, {
    httpOnly: true,
    maxAge: SESSION_SECONDS,
    path: "/",
    sameSite: "lax"
  });

  return response;
}
