"use client";

import { useMemo, useState } from "react";
import { ArrowIcon, SearchIcon } from "./Icons";
import { getRankedLocalTemplateMatches } from "@/lib/templates/catalog";

type LiveSearchProps = {
  suggestions: string[];
  initialQuery?: string;
};

const categoryLabels: Record<string, string> = {
  wedding: "Wedding cards",
  "id-card": "Student ID cards",
  "student-id": "Student ID cards",
  business: "Business cards",
  birthday: "Birthday cards",
  sticker: "Stickers",
  "laptop-skin": "Laptop skins"
};

export function LiveSearch({ suggestions, initialQuery = "" }: LiveSearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(
    () =>
      getRankedLocalTemplateMatches(query).slice(0, 6).map((template) => ({
        id: template.id,
        title: template.title,
        href: `/templates/${template.slug}`,
        meta: template.category ? categoryLabels[template.category] ?? template.category : "Template",
        detail: template.services?.title ?? "Editable print template"
      })),
    [query]
  );

  const trimmedQuery = query.trim();
  const showDropdown = trimmedQuery.length > 0;

  return (
    <div>
      <form className="relative max-w-2xl" action="/search" aria-label="Search templates">
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

        {showDropdown ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-soft">
            {results.length ? (
              <div className="max-h-96 overflow-y-auto py-2" role="listbox" aria-label="Matching templates">
                {results.map((result, index) => (
                  <a
                    aria-selected={index === 0}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-mist"
                    href={result.href}
                    key={result.id}
                    role="option"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{result.title}</span>
                      <span className="mt-1 block truncate text-xs uppercase tracking-[0.14em] text-graphite">
                        {index === 0 ? "Best match" : result.meta}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="hidden max-w-40 truncate text-xs text-graphite sm:block">{result.detail}</span>
                      <span className="rounded-full border border-black/10 p-2 text-graphite">
                        <ArrowIcon />
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="px-4 py-4 text-sm text-graphite">No matching templates.</div>
            )}
          </div>
        ) : null}
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
    </div>
  );
}
