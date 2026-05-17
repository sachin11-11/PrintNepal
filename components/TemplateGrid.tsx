"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { ProductTemplateWithService } from "@/lib/supabase/queries";
import { TemplateLayerPreview } from "./TemplateLayerPreview";
import type { TemplateEditorValue } from "./TemplateEditor";

function getTemplateEditHref(template: ProductTemplateWithService) {
  return `/customize/${template.slug || template.id}`;
}

export function TemplateGrid({ templates }: { templates: ProductTemplateWithService[] }) {
  const [activeTemplateId, setActiveTemplateId] = useState(() => templates[0]?.id ?? "");

  useEffect(() => {
    if (templates.length === 0) {
      setActiveTemplateId("");
      return;
    }

    if (!templates.some((template) => template.id === activeTemplateId)) {
      setActiveTemplateId(templates[0].id);
    }
  }, [activeTemplateId, templates]);

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId) ?? templates[0],
    [activeTemplateId, templates]
  );

  if (templates.length === 0) {
    return (
      <div className="rounded-lg bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-press">No templates</p>
        <h2 className="mt-3 text-2xl font-black text-ink">No matching editable templates found.</h2>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)]">
      <div className="grid content-start gap-4 md:grid-cols-2">
        {templates.map((template) => (
            <article
              key={template.id}
              className="group overflow-hidden rounded-lg bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              onMouseEnter={() => setActiveTemplateId(template.id)}
            >
              <button
                type="button"
                className="block aspect-[4/3] w-full overflow-hidden bg-mist text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                aria-label={`Preview ${template.title}`}
                onClick={() => setActiveTemplateId(template.id)}
                onFocus={() => setActiveTemplateId(template.id)}
              >
                <div className="h-full w-full transition duration-500 group-hover:scale-[1.015]">
                  <TemplateLayerPreview isPreviewMode template={template.template_json as TemplateEditorValue} />
                </div>
              </button>

              <div className="p-4">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-press">
                  {template.category ?? template.services?.title ?? "Template"}
                </p>
                <h2 className="mt-2 text-lg font-black leading-snug text-ink">{template.title}</h2>
                <p className="mt-2 min-h-10 text-sm leading-5 text-graphite">
                  {template.services?.title ?? "Custom fields and uploads are completed in the editor."}
                </p>
                <Link
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-sm font-black text-white shadow-sm transition hover:bg-press focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                  href={getTemplateEditHref(template)}
                >
                  Edit
                </Link>
              </div>
            </article>
        ))}
      </div>

      {activeTemplate ? (
        <aside className="order-first self-start overflow-hidden rounded-lg bg-white shadow-md lg:sticky lg:top-28 lg:order-none">
          <div className="aspect-[4/3] bg-mist">
            <TemplateLayerPreview isPreviewMode template={activeTemplate.template_json as TemplateEditorValue} />
          </div>
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-press">Preview</p>
            <h2 className="mt-3 text-2xl font-black leading-tight text-ink">{activeTemplate.title}</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">
              Edit the template first to fill document-specific fields, upload logos, and adjust the artwork before ordering.
            </p>
            <Link
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-cyan px-5 text-sm font-black text-ink shadow-sm transition hover:bg-[#6bd8db] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              href={getTemplateEditHref(activeTemplate)}
            >
              Edit
            </Link>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
