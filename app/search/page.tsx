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
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="border-l-4 border-cyan bg-white/80 p-5">
          <p className="eyebrow">Search</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight text-ink sm:text-6xl">Search design templates.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-graphite">
            Filter available editable templates and continue into customization.
          </p>
        </div>
        <div className="mt-8">
          <TemplateGrid templates={results} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
