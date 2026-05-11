import Link from "next/link";
import { notFound } from "next/navigation";
import { TemplateLayerPreview } from "@/components/TemplateLayerPreview";
import type { TemplateEditorValue } from "@/components/TemplateEditor";
import { LOCAL_TEMPLATE_CATALOG } from "@/lib/templates/catalog";
import { getTemplateCategory, TEMPLATE_CATEGORY_LABELS } from "@/lib/templates/template-categories";

export default function AdminCategoryDetailPage({ params }: { params: { category: string } }) {
  const category = getTemplateCategory(params.category);
  if (!category) {
    notFound();
  }

  const templates = LOCAL_TEMPLATE_CATALOG.filter((template) => template.category === category);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="border-l-4 border-press bg-white/80 p-5">
          <p className="eyebrow">{category}</p>
          <h1 className="mt-4 text-5xl font-black text-ink">{TEMPLATE_CATEGORY_LABELS[category]}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-graphite">
            This page shows the specific templates in the category. Pick one to edit or customize.
          </p>
        </div>
        <Link className="border border-black/10 bg-white px-4 py-2 text-sm font-bold text-ink" href="/admin/categories">
          Back to categories
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <article key={template.id} className="overflow-hidden border border-ink/10 bg-white shadow-sm">
            <div className="aspect-[4/3] border-b border-ink/10 bg-mist">
              <TemplateLayerPreview isPreviewMode template={template.template_json as TemplateEditorValue} />
            </div>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-press">{template.id}</p>
              <h2 className="mt-2 text-lg font-black text-ink">{template.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link className="border border-black/10 px-4 py-2 text-sm font-bold text-ink" href={`/templates/${template.id}`}>
                  View
                </Link>
                <Link className="border border-black/10 px-4 py-2 text-sm font-bold text-ink" href={`/customize/${template.id}`}>
                  Customize
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
