import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { services } from "@/lib/data";

export default function ServicesPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Services</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-ink sm:text-6xl">
          Premium print services for Nepal’s brands, makers, and milestones.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
          Browse production-ready offerings with material options, finishing paths, and clear order entry points.
        </p>
        <div className="mt-12">
          <ProductGrid products={services} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
