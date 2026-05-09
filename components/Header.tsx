export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <a href="/" className="text-sm font-semibold tracking-[0.28em] text-ink" aria-label="PrintNepal home">
          PRINTNEPAL
        </a>
        <nav className="hidden items-center gap-8 text-sm text-graphite md:flex" aria-label="Primary navigation">
          <a className="transition hover:text-ink" href="/services">Services</a>
          <a className="transition hover:text-ink" href="/search">Search</a>
          <a className="transition hover:text-ink" href="/track-order">Track Order</a>
        </nav>
        <a
          href="/order"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink bg-ink px-5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black"
        >
          Send Design
        </a>
      </div>
    </header>
  );
}
