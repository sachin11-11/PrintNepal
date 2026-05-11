import type { ProductTemplateWithService } from "@/lib/supabase/queries";
import { TemplateLayerPreview } from "./TemplateLayerPreview";
import type { TemplateEditorValue } from "./TemplateEditor";

export function TemplateGrid({ templates }: { templates: ProductTemplateWithService[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <a key={template.id} className="group overflow-hidden border border-ink/10 bg-white shadow-sm transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lift" href={`/templates/${template.id}`}>
          <div className="aspect-[4/3] border-b border-ink/10 bg-mist transition duration-500 group-hover:scale-[1.01]">
            <TemplateLayerPreview isPreviewMode template={template.template_json as TemplateEditorValue} />
          </div>
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-press">{template.category ?? template.services?.title ?? "Template"}</p>
            <h2 className="mt-3 text-xl font-black text-ink">{template.title}</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">{template.services?.title ?? "Custom print template"}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
