import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_SESSION_HOURS = 8;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "printshopnepal@gmail.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "printshopadmin@123";

function adminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "printnepal-local-admin-session-secret";
}

function base64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", adminSessionSecret()).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionToken(email = ADMIN_EMAIL) {
  const payload = base64Url(JSON.stringify({
    email,
    exp: Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000
  }));
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; exp?: number };
    if (decoded.email !== ADMIN_EMAIL || typeof decoded.exp !== "number" || decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function adminCredentialsAreValid(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
}
