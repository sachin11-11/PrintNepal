import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TemplateLayerPreview } from "@/components/TemplateLayerPreview";
import { getProductTemplateByIdentifier } from "@/lib/supabase/queries";
import type { TemplateEditorValue } from "@/components/TemplateEditor";

export const dynamic = "force-dynamic";

export default async function TemplateDetailPage({ params }: { params: { id: string } }) {
  const template = await getProductTemplateByIdentifier(params.id);

  if (!template) {
    notFound();
  }

  return (
    <main>
      <Header />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">{template.category ?? "Template"}</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-ink sm:text-6xl">{template.title}</h1>
          <p className="mt-6 text-lg leading-8 text-graphite">
            Customize this {template.services?.title ?? "print"} template with your text, images, colors, and delivery details.
          </p>
          <a className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-white" href={`/customize/${template.id}`}>
            Customize template
          </a>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft">
          <TemplateLayerPreview template={template.template_json as TemplateEditorValue} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
