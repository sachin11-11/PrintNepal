"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar, adminLinks } from "./AdminSidebar";
import { cx } from "./AdminUI";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-mist">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[16.5rem_1fr]">
      <AdminSidebar pathname={pathname} />
      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-paper/92 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <a className="rounded-lg bg-[var(--solid)] px-3 py-2 text-sm font-black tracking-[0.12em] text-white" href="/">
              PRINTNEPAL
            </a>
            <a className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-ink" href="/admin/dashboard">
              Admin
            </a>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Admin navigation">
            {adminLinks.map(([label, href, icon]) => {
              const isActive = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

              return (
                <a
                  className={cx(
                    "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-bold",
                    isActive ? "border-press bg-press text-white" : "border-[var(--line)] bg-[var(--surface)] text-graphite"
                  )}
                  href={href}
                  key={href}
                >
                  <span className="text-[10px] font-black">{icon}</span>
                  {label}
                </a>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
