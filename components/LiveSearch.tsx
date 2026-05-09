"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { MaterialRow, ProductTemplateRow, ServiceRow } from "@/lib/supabase/types";
import { ArrowIcon, SearchIcon } from "./Icons";
import { TemplateLayerPreview } from "./TemplateLayerPreview";
import type { TemplateEditorValue } from "./TemplateEditor";

type LiveSearchProps = {
  suggestions: string[];
  initialQuery?: string;
};

type SearchResult =
  | {
      id: string;
      type: "Template";
      title: string;
      description: string;
      href: string;
      meta: string;
      imageUrl: string | null;
      templateJson?: unknown;
    }
  | {
      id: string;
      type: "Service";
      title: string;
      description: string;
      href: string;
      meta: string;
      imageUrl: string | null;
    }
  | {
      id: string;
      type: "Material";
      title: string;
      description: string;
      href: string;
      meta: string;
      imageUrl: string | null;
    };

function escapeSearchTerm(value: string) {
  return value.trim().replace(/[%_]/g, "\\$&");
}

function mapTemplate(template: ProductTemplateRow): SearchResult {
  return {
    id: template.id,
    type: "Template",
    title: template.title,
    description: "Editable print template. Choose it and customize your details.",
    href: `/templates/${template.id}`,
    meta: template.category ?? "Template",
    imageUrl: template.thumbnail_url,
    templateJson: template.template_json
  };
}

function mapService(service: ServiceRow): SearchResult {
  return {
    id: service.id,
    type: "Service",
    title: service.title,
    description: service.description ?? "Premium PrintNepal service.",
    href: `/services/${service.slug}`,
    meta: service.category ?? "Print service",
    imageUrl: service.image_url
  };
}

function mapMaterial(material: MaterialRow): SearchResult {
  const details = [material.type, material.size, material.finish].filter(Boolean).join(" · ");

  return {
    id: material.id,
    type: "Material",
    title: material.name,
    description: material.description ?? "Premium material available for custom print orders.",
    href: `/order?material=${encodeURIComponent(material.name)}`,
    meta: details || "Material",
    imageUrl: null
  };
}

function materialSwatch(title: string) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("silver")) {
    return "bg-[radial-gradient(circle_at_30%_25%,#ffffff,#d8d8d8_35%,#a9adb3_70%)]";
  }

  if (lowerTitle.includes("vinyl")) {
    return "bg-[linear-gradient(135deg,#f8fafc,#cfd5dc,#ffffff)]";
  }

  if (lowerTitle.includes("linen")) {
    return "bg-[repeating-linear-gradient(45deg,#f7f3ea,#f7f3ea_4px,#e6ded0_5px,#e6ded0_8px)]";
  }

  return "bg-[linear-gradient(135deg,#f8f7f3,#ffffff,#d8d4ca)]";
}

export function LiveSearch({ suggestions, initialQuery = "" }: LiveSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [materials, setMaterials] = useState<MaterialRow[]>([]);
  const [templates, setTemplates] = useState<ProductTemplateRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo<SearchResult[]>(
    () => [...templates.map(mapTemplate), ...services.map(mapService), ...materials.map(mapMaterial)].slice(0, 10),
    [services, materials, templates]
  );

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setServices([]);
      setMaterials([]);
      setTemplates([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createBrowserSupabaseClient();
        const searchTerm = escapeSearchTerm(normalizedQuery);

        const [serviceResponse, materialResponse, templateResponse] = await Promise.all([
          supabase
            .from("services")
            .select("*")
            .or(
              [
                `title.ilike.%${searchTerm}%`,
                `slug.ilike.%${searchTerm}%`,
                `category.ilike.%${searchTerm}%`,
                `description.ilike.%${searchTerm}%`
              ].join(",")
            )
            .order("is_featured", { ascending: false })
            .limit(5),
          supabase
            .from("materials")
            .select("*")
            .or(
              [
                `name.ilike.%${searchTerm}%`,
                `type.ilike.%${searchTerm}%`,
                `size.ilike.%${searchTerm}%`,
                `finish.ilike.%${searchTerm}%`,
                `description.ilike.%${searchTerm}%`
              ].join(",")
            )
            .order("name", { ascending: true })
            .limit(5),
          supabase
            .from("product_templates")
            .select("*")
            .or(
              [
                `title.ilike.%${searchTerm}%`,
                `slug.ilike.%${searchTerm}%`,
                `category.ilike.%${searchTerm}%`
              ].join(",")
            )
            .order("is_featured", { ascending: false })
            .limit(5)
        ]);

        if (serviceResponse.error) {
          throw serviceResponse.error;
        }

        if (materialResponse.error) {
          throw materialResponse.error;
        }
        if (templateResponse.error) {
          throw templateResponse.error;
        }

        setServices(serviceResponse.data ?? []);
        setMaterials(materialResponse.data ?? []);
        setTemplates(templateResponse.data ?? []);
      } catch {
        setServices([]);
        setMaterials([]);
        setTemplates([]);
        setError("Search is temporarily unavailable.");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      <form className="max-w-2xl" action="/search" aria-label="Search material library">
        <div className="flex min-h-16 items-center gap-3 rounded-full border border-black/10 bg-white px-5 shadow-sm">
          <span className="text-graphite">
            <SearchIcon />
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-neutral-400"
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search wedding card, sticker, silver sparkle"
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

      {query.trim().length >= 2 ? (
        <div className="mt-4 max-w-2xl overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-soft">
          <div className="border-b border-black/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-graphite">
            {isLoading ? "Searching" : "Results"}
          </div>
          {error ? (
            <p className="px-5 py-5 text-sm text-graphite">{error}</p>
          ) : results.length > 0 ? (
            <div className="divide-y divide-black/10">
              {results.map((result) => (
                <a key={`${result.type}-${result.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-mist" href={result.href}>
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-mist">
                      {result.type === "Template" && result.templateJson ? (
                        <TemplateLayerPreview template={result.templateJson as TemplateEditorValue} />
                      ) : result.imageUrl ? (
                        <Image
                          alt={`${result.title} preview`}
                          className="h-full w-full object-cover"
                          height={80}
                          src={result.imageUrl}
                          width={80}
                        />
                      ) : (
                        <span className={`block h-full w-full ${materialSwatch(result.title)}`} />
                      )}
                    </span>
                    <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">{result.title}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-graphite">{result.type} · {result.meta}</span>
                    <span className="mt-2 block text-sm leading-6 text-graphite">{result.description}</span>
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full border border-black/10 p-2 text-graphite">
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          ) : !isLoading ? (
            <div className="px-5 py-5">
              <p className="text-sm font-medium text-ink">No results found.</p>
              <p className="mt-2 text-sm leading-6 text-graphite">You can still send us your design.</p>
              <a className="mt-4 inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-white" href="/order">
                Send Design
              </a>
            </div>
          ) : (
            <p className="px-5 py-5 text-sm text-graphite">Looking through services and materials...</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
