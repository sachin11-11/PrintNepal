export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-graphite sm:px-8 md:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <p className="font-semibold tracking-[0.28em] text-ink">PRINTNEPAL</p>
          <p className="mt-3 max-w-md leading-6">
            Premium printing for wedding invitations, student ID cards, and other custom print templates across Nepal.
          </p>
          <div className="mt-4 grid gap-1 text-sm">
            <a className="hover:text-ink" href="mailto:hello@printnepal.com">hello@printnepal.com</a>
            <a className="hover:text-ink" href="tel:+9779748808237">+977 9748808237</a>
            <p>Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="grid gap-4 md:justify-end">
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
          <a className="hover:text-ink" href="/templates">Wedding Card</a>
          <a className="hover:text-ink" href="/templates/student-id-card-01">ID Card</a>
          <a className="hover:text-ink" href="/customize/wedding-card-01">Customize</a>
          <a className="hover:text-ink" href="/track-order">Track</a>
          <a className="hover:text-ink" href="/admin/login">Admin</a>
          </div>
          <div className="rounded-[1.25rem] border border-black/10 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">Contact</p>
            <p className="mt-2 text-sm leading-6 text-ink">Mail us for template setup, order help, or printing questions.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
