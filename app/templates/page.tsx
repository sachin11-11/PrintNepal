import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TemplateGrid } from "@/components/TemplateGrid";
import { LOCAL_TEMPLATE_CATALOG } from "@/lib/templates/catalog";

export const dynamic = "force-dynamic";

export default function TemplatesPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Templates</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-ink sm:text-6xl">
          Editable wedding and ID card templates.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
          Search and customize templates by category. The catalog now includes the wedding invitation card and the student ID card.
        </p>
        <div className="mt-10">
          <TemplateGrid templates={LOCAL_TEMPLATE_CATALOG} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
