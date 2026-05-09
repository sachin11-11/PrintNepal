"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setIsLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Signed in." }));
    router.push("/admin/dashboard");
  }

  return (
    <form className="w-full rounded-[2rem] border border-black/10 bg-white p-6 shadow-soft sm:p-8" onSubmit={handleSubmit}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Admin</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Sign in.</h1>
      <label className="mt-8 grid gap-2 text-sm font-medium text-ink">
        Email
        <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" onChange={(event) => setEmail(event.target.value)} placeholder="admin@printnepal.com" required type="email" value={email} />
      </label>
      <label className="mt-5 grid gap-2 text-sm font-medium text-ink">
        Password
        <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" onChange={(event) => setPassword(event.target.value)} placeholder="Password" required type="password" value={password} />
      </label>
      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-white disabled:opacity-60" disabled={isLoading} type="submit">
        {isLoading ? "Signing in..." : "Continue"}
      </button>
    </form>
  );
}
