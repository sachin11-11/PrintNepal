import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TemplateGrid } from "@/components/TemplateGrid";
import { LOCAL_TEMPLATE_CATALOG } from "@/lib/templates/catalog";

export const dynamic = "force-dynamic";

export default function TemplatesPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="border-l-4 border-cyan bg-white/80 p-5">
          <p className="eyebrow">Design templates</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-6xl">
            Editable production templates.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-graphite">
            Pick a ready layout, customize the artwork, then continue into the same print ordering workflow.
          </p>
        </div>
        <div className="mt-10">
          <TemplateGrid templates={LOCAL_TEMPLATE_CATALOG} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
