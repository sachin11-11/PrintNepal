"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowIcon, SearchIcon } from "./Icons";
import { TemplateLayerPreview } from "./TemplateLayerPreview";
import { searchLocalTemplates } from "@/lib/templates/catalog";
import type { TemplateEditorValue } from "./TemplateEditor";

type LiveSearchProps = {
  suggestions: string[];
  initialQuery?: string;
};

export function LiveSearch({ suggestions, initialQuery = "" }: LiveSearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(
    () =>
      searchLocalTemplates(query).map((template) => ({
        id: template.id,
        title: template.title,
        description: template.category === "id-card" ? "Editable student identity card template." : "Editable wedding invitation template.",
        href: `/templates/${template.slug}`,
        meta: template.category ?? "Template",
        imageUrl: template.thumbnail_url,
        templateJson: template.template_json
      })),
    [query]
  );

  const showResult = query.trim().length >= 2;

  return (
    <div>
      <form className="max-w-2xl" action="/search" aria-label="Search templates">
        <div className="flex min-h-16 items-center gap-3 rounded-full border border-black/10 bg-white px-5 shadow-sm">
          <span className="text-graphite">
            <SearchIcon />
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-neutral-400"
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search wedding card or student ID card"
            type="search"
            value={query}
          />
          <button className="hidden rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-black sm:inline-flex" type="submit">
            Search
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-3" aria-label="Search suggestions">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-graphite transition hover:border-black/20 hover:text-ink"
            onClick={() => setQuery(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {showResult ? (
        <div className="mt-4 grid max-w-4xl gap-4 sm:grid-cols-2">
          {results.length ? results.map((result) => (
            <a className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-md" href={result.href} key={result.id}>
              <div className="aspect-[4/3] bg-mist">
                {result.templateJson ? (
                  <TemplateLayerPreview isPreviewMode template={result.templateJson as TemplateEditorValue} />
                ) : result.imageUrl ? (
                  <Image alt={`${result.title} preview`} className="h-full w-full object-cover" height={80} src={result.imageUrl} width={80} />
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{result.title}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-graphite">{result.meta}</span>
                  <span className="mt-2 block text-sm leading-6 text-graphite">{result.description}</span>
                </span>
                <span className="shrink-0 rounded-full border border-black/10 p-2 text-graphite">
                  <ArrowIcon />
                </span>
              </div>
            </a>
          )) : (
            <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-sm text-graphite">
              No matching templates.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
