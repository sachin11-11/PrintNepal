import { cx } from "./AdminUI";

export const adminLinks = [
  ["Dashboard", "/admin/dashboard", "DB"],
  ["Orders", "/admin/orders", "OR"],
  ["Design Work", "/admin/design-work", "DW"],
  ["Files", "/admin/files", "FL"],
  ["Services", "/admin/services", "SV"],
  ["Designs", "/admin/designs", "DS"],
  ["Materials", "/admin/materials", "MT"],
  ["Templates", "/admin/categories", "TP"]
];

export function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden bg-[var(--solid)] text-[var(--solid-text)] shadow-[18px_0_60px_rgba(27,28,25,0.14)] lg:sticky lg:top-0 lg:block lg:h-screen">
      <div className="flex h-full flex-col p-5">
        <a href="/" className="rounded-lg border border-white/10 bg-white/8 px-4 py-3">
          <span className="block text-sm font-black tracking-[0.14em] text-white">PRINTNEPAL</span>
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/55">Admin console</span>
        </a>
        <nav className="mt-7 grid gap-1" aria-label="Admin navigation">
          {adminLinks.map(([label, href, icon]) => {
            const isActive = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

            return (
              <a
                key={href}
                className={cx(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition",
                  isActive ? "bg-white text-[var(--solid)]" : "text-white/68 hover:bg-white/10 hover:text-white"
                )}
                href={href}
              >
                <span className={cx("grid h-7 w-7 place-items-center rounded-md text-[11px] font-black", isActive ? "bg-press text-white" : "bg-white/10 text-white/70")}>
                  {icon}
                </span>
                {label}
              </a>
            );
          })}
        </nav>
        <div className="mt-auto rounded-lg border border-white/10 bg-white/8 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-white/55">Production mode</p>
          <p className="mt-2 text-sm font-bold leading-5 text-white">Manage orders, catalog, design assets, and fulfillment from one workspace.</p>
          <a className="mt-4 inline-flex text-sm font-black text-white underline decoration-white/30 underline-offset-4" href="/">
            View storefront
          </a>
        </div>
      </div>
    </aside>
  );
}
