import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export async function getAdminToken() {
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function adminFetch(path: string, init?: RequestInit) {
  const token = await getAdminToken();

  if (!token) {
    throw new Error("Please sign in as an admin.");
  }

  const isFormData = init?.body instanceof FormData;
  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers
    }
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? "Admin request failed.");
  }

  return payload;
}
