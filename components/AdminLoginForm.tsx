"use client";

import { useState } from "react";

export function AdminLoginForm({ nextPath }: { nextPath?: string }) {
  const [email, setEmail] = useState("printshopnepal@gmail.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json().catch(() => ({}));

    setIsLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Could not sign in.");
      return;
    }

    if (payload.token) {
      window.localStorage.setItem("printnepal-admin-token", payload.token);
    }

    window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Signed in." }));
    window.location.assign(nextPath ?? "/admin/dashboard");
  }

  return (
    <form className="print-panel w-full p-6 sm:p-8" onSubmit={handleSubmit}>
      <p className="eyebrow">Admin</p>
      <h1 className="mt-4 text-4xl font-black text-ink">Sign in.</h1>
      <p className="mt-3 text-sm leading-6 text-graphite">Use the PrintNepal admin credentials.</p>
      <label className="mt-8 grid gap-2 text-sm font-medium text-ink">
        Email
        <input className="atelier-input min-h-12 px-4 outline-none" onChange={(event) => setEmail(event.target.value)} placeholder="printshopnepal@gmail.com" required type="email" value={email} />
      </label>
      <label className="mt-5 grid gap-2 text-sm font-medium text-ink">
        Password
        <input className="atelier-input min-h-12 px-4 outline-none" onChange={(event) => setPassword(event.target.value)} placeholder="Password" required type="password" value={password} />
      </label>
      {error ? <p className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <button className="link-block mt-6 w-full justify-center disabled:opacity-60" disabled={isLoading} type="submit">
        {isLoading ? "Signing in..." : "Continue"}
      </button>
    </form>
  );
}
