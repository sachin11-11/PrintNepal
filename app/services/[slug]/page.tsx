import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { productDesigns, services } from "@/lib/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((item) => item.slug === params.slug);
  const designs = productDesigns.filter((design) => design.serviceSlug === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">{service.category}</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-ink sm:text-6xl">{service.title}</h1>
            <p className="mt-6 text-lg leading-8 text-graphite">{service.description}</p>
            <div className="mt-8 grid gap-3 text-sm text-graphite sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-5"><span className="block text-ink">Material</span>{service.material}</div>
              <div className="rounded-2xl border border-black/10 bg-white p-5"><span className="block text-ink">Starting price</span>{service.price}</div>
            </div>
            <a className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-white" href="/order">
              Start Order
            </a>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-soft">
            <div className="aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-mist">
              <Image
                alt={`${service.title} print sample`}
                className="h-full w-full object-cover"
                height={700}
                src={service.image_url}
                width={900}
              />
            </div>
          </div>
        </div>
        {designs.length > 0 ? (
          <div className="mt-16">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Choose a design</p>
                <h2 className="mt-3 font-serif text-3xl text-ink">Existing {service.title} designs.</h2>
              </div>
              <a className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-ink" href={`/order?service=${service.slug}`}>
                Upload your own design
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design) => (
                <article key={design.title} className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm">
                  <div className="relative aspect-[4/3] bg-mist">
                    <Image
                      alt={`${design.title} design option`}
                      className="h-full w-full object-cover"
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      src={design.image_url}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-ink">{design.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-graphite">{design.finish}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
                      <span className="text-sm text-graphite">{design.price}</span>
                      <a className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white" href={`/order?service=${service.slug}&design=${encodeURIComponent(design.title)}`}>
                        Choose
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-3xl text-ink">Related services</h2>
          <ProductGrid products={services.filter((item) => item.slug !== service.slug).slice(0, 3)} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
