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
    <aside className="border-b border-black/10 bg-white p-5 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-6">
      <a href="/" className="text-sm font-semibold tracking-[0.28em] text-ink">PRINTNEPAL</a>
      <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Admin navigation">
        {adminLinks.map(([label, href]) => (
          <a key={href} className="rounded-full border border-black/10 px-4 py-2 text-sm text-graphite transition hover:bg-ink hover:text-white lg:rounded-xl" href={href}>
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
