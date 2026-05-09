import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSearch } from "@/components/HeroSearch";
import { suggestions } from "@/lib/data";

export default function SearchPage({
  searchParams
}: {
  searchParams?: { q?: string };
}) {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Search</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-ink sm:text-6xl">Find materials and services.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
          Search PrintNepal services and premium materials from the live Supabase catalog.
        </p>
        <HeroSearch initialQuery={searchParams?.q ?? ""} suggestions={suggestions} />
      </section>
      <Footer />
    </main>
  );
}
