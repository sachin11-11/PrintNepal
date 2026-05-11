import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OrderForm } from "@/components/OrderForm";
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

      <section className="print-band">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="grid gap-3 border-l-4 border-press bg-white/70 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="eyebrow">Production starts here</p>
              <h1 className="mt-2 max-w-4xl text-3xl font-black leading-tight text-ink sm:text-5xl">
                Choose a print item, configure specs, upload artwork, and place the order.
              </h1>
            </div>
            <div className="grid grid-cols-3 border border-ink/10 bg-white text-center text-xs font-bold uppercase tracking-[0.14em] text-graphite">
              <span className="border-r border-ink/10 px-3 py-3">50+ items</span>
              <span className="border-r border-ink/10 px-3 py-3">MOQ aware</span>
              <span className="px-3 py-3">Wallet ready</span>
            </div>
          </div>
          <OrderForm />
        </div>
      </section>

      <section className="bg-white" id="catalogue">
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
              <article key={group.category} className="group overflow-hidden border border-ink/10 bg-white transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lift">
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
