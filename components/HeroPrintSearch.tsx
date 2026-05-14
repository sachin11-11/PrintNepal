"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowIcon, SearchIcon } from "./Icons";
import { printCatalog } from "@/lib/print-order-catalog";

function orderHref(productId: string) {
  return `/order?product=${encodeURIComponent(productId)}`;
}

export function HeroPrintSearch() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const showMatches = normalizedQuery.length > 0;

  const matches = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return printCatalog
      .filter((item) => [item.name, item.category, item.id].join(" ").toLowerCase().includes(normalizedQuery))
      .slice(0, 6);
  }, [normalizedQuery]);

  const primaryMatch = matches[0];

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (primaryMatch) {
      window.location.href = orderHref(primaryMatch.id);
      return;
    }

    window.location.href = `/order`;
  }

  return (
    <div className="hero-search-shell">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-press">Start your order</p>
      <h2 className="hero-search-title mt-3 text-3xl font-black leading-tight sm:text-5xl">What do you want to print?</h2>

      <form className="relative mt-6" onSubmit={submitSearch} aria-label="Search print products">
        <div className="hero-search-field flex min-h-16 items-center gap-3 border-2 px-4 transition focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 sm:px-5">
          <span className="text-[var(--solid)]">
            <SearchIcon />
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[var(--solid)] outline-none placeholder:text-graphite"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search business card, sticker, ID card, brochure"
            type="search"
            value={query}
          />
          <button className="hidden min-h-11 items-center gap-2 bg-[var(--solid)] px-5 text-sm font-black text-[var(--solid-text)] transition hover:opacity-90 sm:inline-flex" type="submit">
            Search
            <ArrowIcon />
          </button>
        </div>

        {showMatches ? (
        <div className="hero-search-results absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden border shadow-lift">
          {matches.length ? (
            <div role="listbox" aria-label="Matching print products">
              {matches.map((item, index) => (
                <a
                  aria-selected={index === 0}
                  className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-left transition last:border-b-0 hover:bg-white/10"
                  href={orderHref(item.id)}
                  key={item.id}
                  role="option"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-white">{item.name}</span>
                    <span className="mt-1 block truncate text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                      {item.category} - min {item.minQuantity} {item.unit}
                    </span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-white">
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="px-4 py-4 text-sm font-semibold text-white/70">No matching print item. Press Search to start a custom order.</div>
          )}
        </div>
        ) : null}
      </form>
    </div>
  );
}
