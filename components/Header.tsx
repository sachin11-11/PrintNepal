import { ThemeSwitcher } from "./ThemeSwitcher";

export function Header() {
  const navItems = [
    { href: "/#catalogue", label: "Catalogue" },
    { href: "/order", label: "Start Order" },
    { href: "/templates", label: "Design Templates" },
    { href: "/track-order", label: "Track Order" },
    { href: "/contact", label: "Contact" },
    { href: "/admin/login", label: "Admin" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/88 shadow-[0_12px_42px_rgba(27,28,25,0.08)] backdrop-blur-2xl">
      <div className="bg-[var(--solid)] text-[var(--solid-text)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] sm:px-8 lg:px-10">
          <span>Production desk / Kathmandu</span>
          <a className="hidden opacity-80 transition hover:opacity-100 sm:inline" href="tel:+9779748808237">+977 9748808237</a>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-3 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="grid rounded-md bg-[var(--surface)] px-3 py-2 text-ink shadow-soft" aria-label="PrintNepal home">
            <span className="text-base font-black tracking-[0.12em]">PRINTNEPAL</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">Print order system</span>
          </a>
          <nav className="hidden items-center rounded-lg bg-[var(--surface)] p-1 text-sm font-semibold text-graphite shadow-soft lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                className="rounded-md px-4 py-3 transition hover:bg-mist hover:text-ink"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <a href="/cart" className="inline-flex min-h-11 items-center gap-3 rounded-lg bg-[var(--surface)] px-4 text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift" aria-label="Open cart">
              <span aria-hidden="true" className="relative flex h-5 w-5 items-center justify-center">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 6h16l-2 8H7L5 3H3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 19.5h.01M18 19.5h.01" />
                </svg>
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-press px-1 text-[10px] leading-none text-white">
                  0
                </span>
              </span>
              <span className="hidden sm:inline">Cart</span>
            </a>
          </div>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pt-3 text-sm font-semibold lg:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a className="shrink-0 rounded-full bg-[var(--surface)] px-3 py-2 text-graphite shadow-soft" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
