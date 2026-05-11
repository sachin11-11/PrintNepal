export function Header() {
  const navItems = [
    { href: "/#catalogue", label: "Catalogue" },
    { href: "/order", label: "Start Order" },
    { href: "/templates", label: "Design Templates" },
    { href: "/track-order", label: "Track Order" },
    { href: "/admin/login", label: "Admin" }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink/15 bg-paper/95 backdrop-blur-xl">
      <div className="border-b border-ink/10 bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] sm:px-8 lg:px-10">
          <span>Production desk: Kathmandu</span>
          <a className="hidden text-white/80 transition hover:text-white sm:inline" href="tel:+9779748808237">+977 9748808237</a>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-3 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="grid border-l-4 border-press pl-3 text-ink" aria-label="PrintNepal home">
            <span className="text-base font-black tracking-[0.2em]">PRINTNEPAL</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-graphite">Print order system</span>
          </a>
          <nav className="hidden items-center border border-ink/10 bg-white text-sm font-semibold text-graphite lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                className="border-r border-ink/10 px-4 py-3 transition last:border-r-0 hover:bg-mist hover:text-ink"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a href="/cart" className="inline-flex min-h-11 items-center gap-3 border border-ink bg-white px-4 text-sm font-bold text-ink transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-soft" aria-label="Open cart">
            <span aria-hidden="true" className="relative flex h-5 w-5 items-center justify-center">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 6h16l-2 8H7L5 3H3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 19.5h.01M18 19.5h.01" />
              </svg>
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[10px] leading-none text-white">
                0
              </span>
            </span>
            <span>Cart</span>
          </a>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto border-t border-ink/10 pt-3 text-sm font-semibold lg:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a className="shrink-0 border border-ink/10 bg-white px-3 py-2 text-graphite" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
