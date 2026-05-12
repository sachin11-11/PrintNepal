import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroPrintSearch } from "@/components/HeroPrintSearch";
import { categoryImages, printCatalog } from "@/lib/print-order-catalog";

export default function Home() {
  const catalogGroups = Array.from(new Set(printCatalog.map((item) => item.category))).map((category) => {
    const products = printCatalog.filter((item) => item.category === category);
    return {
      category,
      products,
      featuredProduct: products.find((item) => item.popular) ?? products[0]
    };
  });

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
            <p className="text-xs font-black uppercase tracking-[0.22em] text-press">Kathmandu print studio</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl">
              PrintNepal
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-white/80">
              Premium cards, stickers, documents, packaging, signage, and event prints with instant product selection.
            </p>
            <div className="mt-7 grid max-w-xl grid-cols-3 border border-white/22 bg-black/20 text-center backdrop-blur-md">
              <span className="border-r border-white/18 px-3 py-4 text-xs font-black uppercase tracking-[0.14em] text-white">50+ items</span>
              <span className="border-r border-white/18 px-3 py-4 text-xs font-black uppercase tracking-[0.14em] text-white">Fast quote</span>
              <span className="px-3 py-4 text-xs font-black uppercase tracking-[0.14em] text-white">Wallet ready</span>
            </div>
          </div>

          <HeroPrintSearch />
        </div>
      </section>

      <section className="bg-paper" id="catalogue">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="mb-10 grid gap-5 border-b border-ink/10 pb-6 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
            <p className="eyebrow">Print catalogue</p>
            <h2 className="mt-3 text-4xl font-black text-ink">Browse by production category.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-graphite">
              Select a catalogue to open the order flow with a relevant print product already selected.
            </p>
            </div>
            <p className="border border-ink/10 bg-mist p-4 text-sm leading-6 text-graphite">
              Built for a large catalogue: categories stay scannable, each click starts the same order flow with product context.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogGroups.map((group) => (
              <article key={group.category} className="group overflow-hidden border border-ink/10 bg-[var(--surface)] transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lift">
                <div
                  className="aspect-[16/9] border-b border-ink/10 bg-mist bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url(${categoryImages[group.category]})` }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-press">{group.products.length} items</p>
                    <span className="border border-ink/10 bg-mist px-2 py-1 text-xs font-semibold text-graphite">MOQ set</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-black text-ink">{group.category}</h3>
                  <p className="mt-3 text-sm leading-6 text-graphite">
                    {group.products.slice(0, 4).map((item) => item.name).join(", ")}
                    {group.products.length > 4 ? ", and more" : ""}
                  </p>
                  <a
                    className="link-block mt-5"
                    href={`/order?product=${group.featuredProduct.id}`}
                  >
                    Select
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
