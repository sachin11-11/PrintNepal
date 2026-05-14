"use client";

import { useMemo, useState } from "react";
import { categoryImages, type PrintProduct } from "@/lib/print-order-catalog";

type FilterValue = "all" | "popular" | "fast" | "low-moq";
type SortValue = "featured" | "name" | "price" | "turnaround" | "moq";

function orderHref(productId: string) {
  return `/order?product=${encodeURIComponent(productId)}`;
}

export function PrintArticleCatalogue({ articles }: { articles: PrintProduct[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sort, setSort] = useState<SortValue>("featured");

  const visibleArticles = useMemo(() => {
    const filtered = articles.filter((item) => {
      if (filter === "popular") return Boolean(item.popular);
      if (filter === "fast") return item.turnaroundHours <= 24;
      if (filter === "low-moq") return item.minQuantity <= 25;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price") return a.basePrice - b.basePrice;
      if (sort === "turnaround") return a.turnaroundHours - b.turnaroundHours;
      if (sort === "moq") return a.minQuantity - b.minQuantity;
      return articles.indexOf(a) - articles.indexOf(b);
    });
  }, [articles, filter, sort]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-graphite">
        <span className="font-semibold">{visibleArticles.length} articles</span>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em]">Filter</span>
          <select
            className="bg-transparent text-sm font-semibold text-ink underline decoration-ink/20 underline-offset-4 outline-none"
            onChange={(event) => setFilter(event.target.value as FilterValue)}
            value={filter}
          >
            <option value="all">All articles</option>
            <option value="popular">Popular</option>
            <option value="fast">24h or faster</option>
            <option value="low-moq">Low MOQ</option>
          </select>
        </label>

          <span className="h-4 w-px bg-ink/15" aria-hidden="true" />

          <label className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em]">Sort</span>
          <select
            className="bg-transparent text-sm font-semibold text-ink underline decoration-ink/20 underline-offset-4 outline-none"
            onChange={(event) => setSort(event.target.value as SortValue)}
            value={sort}
          >
            <option value="featured">Featured order</option>
            <option value="name">Name A-Z</option>
            <option value="price">Lowest starting price</option>
            <option value="turnaround">Fastest turnaround</option>
            <option value="moq">Lowest MOQ</option>
          </select>
        </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleArticles.map((item) => (
          <article key={item.id} className="atelier-card group overflow-hidden transition hover:-translate-y-1">
            <div
              className="aspect-[16/9] bg-mist bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
              style={{ backgroundImage: `url(${categoryImages[item.category]})` }}
            />
            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-press">{item.category}</p>
                <span className="atelier-chip px-3 py-1 text-xs font-semibold">MOQ {item.minQuantity}</span>
              </div>
              <h3 className="mt-3 text-2xl font-black text-ink">{item.name}</h3>
              <p className="mt-3 text-sm leading-6 text-graphite">
                Starts at {item.basePrice.toLocaleString("en-IN")} NPR per {item.unit}. Typical turnaround: {item.turnaroundHours} hours.
              </p>
              <a className="link-block mt-5" href={orderHref(item.id)}>
                Order this article
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
