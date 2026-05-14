import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroPrintSearch } from "@/components/HeroPrintSearch";
import { PrintArticleCatalogue } from "@/components/PrintArticleCatalogue";
import { printCatalog } from "@/lib/print-order-catalog";

export default function Home() {
  const articleOrder = [
    "id-card",
    "brochure",
    "letter-head",
    "poster",
    "flyer",
    "certificate",
    "wedding-card",
    "booklet",
    "business-card",
    "vinyl-sticker",
    "sticker-sheet",
    "banner",
    "envelope",
    "invoice-pad",
    "receipt-pad",
    "folder",
    "company-profile",
    "catalog",
    "manual",
    "postcard",
    "menu-card",
    "standee",
    "foam-board",
    "packaging-sleeve"
  ];

  const catalogueArticles = [
    ...articleOrder
      .map((id) => printCatalog.find((item) => item.id === id))
      .filter((item): item is (typeof printCatalog)[number] => Boolean(item)),
    ...printCatalog.filter((item) => !articleOrder.includes(item.id))
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-paper">
      <Header />

      <section className="hero-print-stage relative isolate overflow-hidden bg-[var(--solid)] text-white">
        <div className="hero-print-backdrop absolute inset-0 -z-20" />
        <div className="hero-print-scrim absolute inset-0 -z-10" />
        <div className="hero-press-strip hero-press-strip-one" aria-hidden="true" />
        <div className="hero-press-strip hero-press-strip-two" aria-hidden="true" />
        <div className="hero-press-strip hero-press-strip-three" aria-hidden="true" />

        <div className="mx-auto grid min-h-[calc(100svh-9.5rem)] max-w-7xl content-center gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(20rem,0.88fr)_minmax(32rem,1.12fr)] lg:items-center lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-press">Kathmandu print studio</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl">
              PrintNepal
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-white/80">
              Premium cards, stickers, documents, packaging, signage, and event prints with instant product selection.
            </p>
            <div className="mt-7 grid max-w-xl grid-cols-3 overflow-hidden rounded-lg bg-white/12 text-center shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-md">
              <span className="px-3 py-4 text-xs font-black uppercase tracking-[0.08em] text-white">50+ items</span>
              <span className="px-3 py-4 text-xs font-black uppercase tracking-[0.08em] text-white">Fast quote</span>
              <span className="px-3 py-4 text-xs font-black uppercase tracking-[0.08em] text-white">Wallet ready</span>
            </div>
          </div>

          <HeroPrintSearch />
        </div>
      </section>

      <section className="bg-paper" id="catalogue">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="mb-10">
            <div>
            <p className="eyebrow">Print catalogue</p>
            <h2 className="mt-3 text-4xl font-black text-ink">Choose the exact print article.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-graphite">
              Pick the item you need printed: ID cards, brochures, letterheads, posters, pamphlets, certificates, wedding cards, booklets, and more.
            </p>
            </div>
          </div>

          <PrintArticleCatalogue articles={catalogueArticles} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
