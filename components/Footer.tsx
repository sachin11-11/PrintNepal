export function Footer() {
  return (
    <footer className="border-t border-ink bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-white/70 sm:px-8 md:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <p className="font-black tracking-[0.28em] text-white">PRINTNEPAL</p>
          <p className="mt-3 max-w-md leading-6">
            Printing press ordering for stationery, marketing materials, packaging, signage, cards, stickers, and bulk production across Nepal.
          </p>
          <div className="mt-4 grid gap-1 text-sm">
            <a className="hover:text-white" href="mailto:hello@printnepal.com">hello@printnepal.com</a>
            <a className="hover:text-white" href="tel:+9779748808237">+977 9748808237</a>
            <p>Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="grid gap-4 md:justify-end">
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
          <a className="hover:text-white" href="/#catalogue">Catalogue</a>
          <a className="hover:text-white" href="/order">Start Order</a>
          <a className="hover:text-white" href="/templates">Templates</a>
          <a className="hover:text-white" href="/track-order">Track</a>
          <a className="hover:text-white" href="/admin/login">Admin</a>
          </div>
          <div className="border border-white/20 bg-white/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Order help</p>
            <p className="mt-2 text-sm leading-6 text-white/70">Mail us for production questions, file checks, delivery coordination, or admin setup.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
