import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TemplateGrid } from "@/components/TemplateGrid";
import { searchLocalTemplates } from "@/lib/templates/catalog";

export default function SearchPage({
  searchParams
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q ?? "";
  const results = searchLocalTemplates(query);

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Search</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-ink sm:text-6xl">Search wedding and ID cards.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
          Type wedding card or student ID card to filter the template catalog.
        </p>
        <div className="mt-8">
          <TemplateGrid templates={results} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
