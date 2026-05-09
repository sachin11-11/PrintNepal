export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-graphite sm:px-8 md:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <p className="font-semibold tracking-[0.28em] text-ink">PRINTNEPAL</p>
          <p className="mt-3 max-w-md leading-6">
            Premium printing for weddings, businesses, artists, architects, and makers across Nepal.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
          <a className="hover:text-ink" href="/services">Services</a>
          <a className="hover:text-ink" href="/order">Order</a>
          <a className="hover:text-ink" href="/track-order">Track</a>
          <a className="hover:text-ink" href="/admin/login">Admin</a>
        </div>
      </div>
    </footer>
  );
}
