import Link from "next/link";
import { getTemplateCategoryGroups } from "@/lib/templates/template-categories";

export default function AdminCategoriesPage() {
  const groups = getTemplateCategoryGroups();

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Categories</p>
        <h1 className="mt-4 font-serif text-5xl text-ink">Template categories.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-graphite">
          Start here after sign in. Open a category to see the specific templates inside it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Link
            key={group.category}
            className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            href={`/admin/categories/${group.category}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">{group.category}</p>
            <h2 className="mt-2 text-lg font-semibold text-ink">{group.label}</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">{group.templates.length} templates</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
