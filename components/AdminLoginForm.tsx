"use client";

import { useState } from "react";

export function AdminLoginForm({ nextPath }: { nextPath?: string }) {
  const [email, setEmail] = useState("printshopnepal@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        <span className="atelier-input flex min-h-12 items-center bg-[var(--surface)]">
          <input
            className="min-w-0 flex-1 bg-transparent px-4 outline-none"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="grid h-12 w-12 shrink-0 place-items-center border-l border-[var(--line)] text-graphite transition hover:bg-mist hover:text-ink"
            onClick={() => setShowPassword((value) => !value)}
            title={showPassword ? "Hide password" : "Show password"}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
              {showPassword ? (
                <>
                  <path d="m3 3 18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.5 5.4A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7a12.7 12.7 0 0 1-2.6 3.8" />
                  <path d="M6.2 6.8A12.4 12.4 0 0 0 2.5 12c1 2.5 4.5 7 9.5 7a10.7 10.7 0 0 0 4.2-.9" />
                </>
              ) : (
                <>
                  <path d="M2.5 12c1-2.5 4.5-7 9.5-7s8.5 4.5 9.5 7c-1 2.5-4.5 7-9.5 7s-8.5-4.5-9.5-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </span>
      </label>
      {error ? <p className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <button className="link-block mt-6 w-full justify-center disabled:opacity-60" disabled={isLoading} type="submit">
        {isLoading ? "Signing in..." : "Continue"}
      </button>
    </form>
  );
}
