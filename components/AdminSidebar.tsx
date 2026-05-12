const adminLinks = [
  ["Sign in", "/admin/login"],
  ["Overview", "/admin"],
  ["Dashboard", "/admin/dashboard"],
  ["Orders", "/admin/orders"],
  ["Categories", "/admin/categories"],
  ["Designs", "/admin/designs"],
  ["Add services", "/admin/services"],
  ["Materials", "/admin/materials"]
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-ink bg-[var(--solid)] p-5 text-[var(--solid-text)] lg:min-h-screen lg:border-b-0 lg:border-r lg:p-6">
      <a href="/" className="grid border-l-4 border-press pl-3 text-sm font-black tracking-[0.22em] text-white">PRINTNEPAL</a>
      <p className="mt-2 pl-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Admin console</p>
      <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Admin navigation">
        {adminLinks.map(([label, href]) => (
          <a key={href} className="border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white hover:bg-white hover:text-ink" href={href}>
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
