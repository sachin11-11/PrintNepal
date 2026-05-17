import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton, AdminPageHeader, AdminPanel } from "@/components/AdminUI";
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
    <section className="grid gap-5">
      <AdminPageHeader
        action={<AdminButton href="/admin/categories" variant="secondary">Back to categories</AdminButton>}
        description="Inspect the specific templates in this category and jump into the customer preview or editor."
        eyebrow={category}
        title={TEMPLATE_CATEGORY_LABELS[category]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <AdminPanel key={template.id} className="overflow-hidden">
            <div className="aspect-[4/3] border-b border-ink/10 bg-mist">
              <TemplateLayerPreview isPreviewMode template={template.template_json as TemplateEditorValue} />
            </div>
            <div className="p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">{template.id}</p>
              <h2 className="mt-2 text-lg font-black text-ink">{template.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-black text-ink transition hover:border-press" href={`/templates/${template.id}`}>
                  View
                </Link>
                <Link className="inline-flex min-h-10 items-center rounded-lg bg-press px-4 text-sm font-black text-white transition hover:bg-press/90" href={`/customize/${template.id}`}>
                  Customize
                </Link>
              </div>
            </div>
          </AdminPanel>
        ))}
      </div>
    </section>
  );
}
