import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export async function getAdminToken() {
  if (typeof window !== "undefined") {
    const localToken = window.localStorage.getItem("printnepal-admin-token");
    if (localToken) return localToken;
  }

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

  const responseText = await response.text();
  const payload = responseText
    ? (() => {
        try {
          return JSON.parse(responseText);
        } catch {
          return {};
        }
      })()
    : {};

  if (!response.ok) {
    throw new Error(payload.error ?? responseText ?? `Admin request failed with status ${response.status}.`);
  }

  return payload;
}
