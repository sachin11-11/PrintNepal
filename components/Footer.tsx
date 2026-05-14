export function Footer() {
  return (
    <footer className="bg-[var(--solid)] text-[var(--solid-text)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm sm:px-8 md:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <p className="font-black tracking-[0.14em] opacity-100">PRINTNEPAL</p>
          <p className="mt-3 max-w-md leading-6 opacity-75">
            Printing press ordering for stationery, marketing materials, packaging, signage, cards, stickers, and bulk production across Nepal.
          </p>
          <div className="mt-4 grid gap-1 text-sm opacity-75">
            <a className="hover:opacity-100" href="mailto:hello@printnepal.com">hello@printnepal.com</a>
            <a className="hover:opacity-100" href="tel:+9779748808237">+977 9748808237</a>
            <p>Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="grid gap-4 md:justify-end">
          <div className="flex flex-wrap gap-x-6 gap-y-3 opacity-75 md:justify-end">
          <a className="hover:opacity-100" href="/#catalogue">Catalogue</a>
          <a className="hover:opacity-100" href="/order">Start Order</a>
          <a className="hover:opacity-100" href="/templates">Templates</a>
          <a className="hover:opacity-100" href="/track-order">Track</a>
          <a className="hover:opacity-100" href="/contact">Contact</a>
          <a className="hover:opacity-100" href="/admin/login">Admin</a>
          </div>
          <div className="footer-help-box rounded-lg px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] opacity-100">Order help</p>
            <p className="mt-2 text-sm leading-6 opacity-75">Mail us for production questions, file checks, delivery coordination, or admin setup.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
