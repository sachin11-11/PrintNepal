import Image from "next/image";
import { CollectionGrid } from "@/components/CollectionGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSearch } from "@/components/HeroSearch";
import { ArrowIcon } from "@/components/Icons";
import { ProductGrid } from "@/components/ProductGrid";
import { gallery, services, suggestions } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden border-b border-black/10 bg-paper">
        <Image
          alt="Real print shop workspace with premium printed cards and paper samples"
          className="absolute inset-0 h-full w-full object-cover"
          fill
          priority
          sizes="100vw"
          src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=2400&q=85"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/55" />
        <div className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center justify-center px-5 py-16 text-center sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Premium print shop in Nepal
            </p>
            <h1 className="font-serif text-6xl leading-[0.92] text-white sm:text-7xl lg:text-8xl xl:text-9xl">
              Print your vision.
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">
              From wedding catalogs to custom laptop wrappers. Search our premium material library.
            </p>
            <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-white/30 bg-white/90 p-3 shadow-soft backdrop-blur-xl">
              <HeroSearch suggestions={suggestions} />
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.18em] text-white/76">
              <span>Wedding cards</span>
              <span>Custom stickers</span>
              <span>Laptop wrappers</span>
              <span>Fine art prints</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Collections</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
                Print categories for every brief.
              </h2>
            </div>
            <a className="inline-flex items-center gap-2 text-sm font-medium text-ink" href="/services">
              Browse services <ArrowIcon />
            </a>
          </div>
          <CollectionGrid />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Shop small business favorites</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Everyday print, finished beautifully.
          </h2>
        </div>
        <ProductGrid products={services.slice(3, 9)} />
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
            Made by you, #MadeWithPrintNepal
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Real projects from creators, couples, and local brands.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <article key={item.title} className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
                <Image
                  alt={`${item.title} real print project`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  src={item.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white">{item.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="rounded-[2rem] border border-black/10 bg-mist px-6 py-10 shadow-soft sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Join our list</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
                Fresh materials, seasonal papers, and print ideas.
              </h2>
            </div>
            <form className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row lg:mt-0" action="#">
              <input className="min-h-13 min-w-0 flex-1 rounded-full border border-black/10 bg-white px-5 text-base text-ink outline-none placeholder:text-neutral-400 focus:border-black/30" placeholder="Email address" type="email" />
              <button className="min-h-13 rounded-full bg-ink px-6 text-sm font-medium text-white transition hover:bg-black" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
