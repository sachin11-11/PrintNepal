import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TemplateGrid } from "@/components/TemplateGrid";
import { getProductTemplates } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function TemplatesPage({
  searchParams
}: {
  searchParams?: { q?: string };
}) {
  const templates = await getProductTemplates({ query: searchParams?.q });

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Templates</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-ink sm:text-6xl">
          Choose a template, then customize it.
        </h1>
        <form className="mt-8 max-w-2xl" action="/templates">
          <input className="min-h-13 w-full rounded-full border border-black/10 bg-white px-5 text-base outline-none focus:border-black/30" defaultValue={searchParams?.q ?? ""} name="q" placeholder="Search student ID card, wedding card, sticker" />
        </form>
        <div className="mt-12">
          <TemplateGrid templates={templates} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
