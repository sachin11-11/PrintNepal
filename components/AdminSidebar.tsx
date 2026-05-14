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
    <aside className="bg-[var(--solid)] p-5 text-[var(--solid-text)] shadow-[18px_0_60px_rgba(27,28,25,0.14)] lg:min-h-screen lg:p-6">
      <a href="/" className="grid rounded-lg bg-white/8 px-4 py-3 text-sm font-black tracking-[0.12em] text-white">PRINTNEPAL</a>
      <p className="mt-3 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">Admin console</p>
      <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Admin navigation">
        {adminLinks.map(([label, href]) => (
          <a key={href} className="rounded-lg px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/12 hover:text-white" href={href}>
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
