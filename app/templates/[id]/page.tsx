import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TemplateLayerPreview } from "@/components/TemplateLayerPreview";
import type { TemplateEditorValue } from "@/components/TemplateEditor";
import { getLocalTemplateByIdentifier } from "@/lib/templates/catalog";

export const dynamic = "force-dynamic";

export default async function TemplateDetailPage({ params }: { params: { id: string } }) {
  const template = getLocalTemplateByIdentifier(params.id);
  if (!template) {
    notFound();
  }

  return (
    <main>
      <Header />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="border-l-4 border-cyan bg-white/80 p-5">
          <p className="eyebrow">{template.category}</p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-ink sm:text-6xl">{template.title}</h1>
          <p className="mt-6 text-base leading-7 text-graphite">
            Customize this production template with your details, then continue with print ordering.
          </p>
          <div className="mt-8 flex gap-3">
            <a className="link-block" href={`/customize/${template.slug}`}>
              Customize template
            </a>
            <a className="inline-flex min-h-12 items-center border border-black/10 px-6 text-sm font-bold text-ink" href="/templates">
              Back to template
            </a>
          </div>
        </div>
        <div className="print-panel overflow-hidden">
          <TemplateLayerPreview isPreviewMode template={template.template_json as TemplateEditorValue} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
