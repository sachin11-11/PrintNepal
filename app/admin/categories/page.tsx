import Link from "next/link";
import { getTemplateCategoryGroups } from "@/lib/templates/template-categories";

export default function AdminCategoriesPage() {
  const groups = getTemplateCategoryGroups();

  return (
    <section className="space-y-8">
      <div className="border-l-4 border-press bg-white/80 p-5">
        <p className="eyebrow">Categories</p>
        <h1 className="mt-4 text-5xl font-black text-ink">Template categories.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-graphite">
          Start here after sign in. Open a category to see the specific templates inside it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Link
            key={group.category}
            className="border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lift"
            href={`/admin/categories/${group.category}`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-press">{group.category}</p>
            <h2 className="mt-2 text-lg font-black text-ink">{group.label}</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">{group.templates.length} templates</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
