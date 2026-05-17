import Link from "next/link";
import { AdminPageHeader, AdminPanel } from "@/components/AdminUI";
import { getTemplateCategoryGroups } from "@/lib/templates/template-categories";

export default function AdminCategoriesPage() {
  const groups = getTemplateCategoryGroups();

  return (
    <section className="grid gap-5">
      <AdminPageHeader
        description="Open a category to inspect the editable template previews customers can choose from."
        eyebrow="Templates"
        title="Template categories"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Link
            key={group.category}
            className="block"
            href={`/admin/categories/${group.category}`}
          >
            <AdminPanel className="h-full p-5 transition hover:border-press hover:bg-mist/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">{group.category}</p>
                  <h2 className="mt-2 text-lg font-black text-ink">{group.label}</h2>
                </div>
                <span className="rounded-md bg-mist px-2 py-1 text-xs font-black text-graphite">{group.templates.length}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-graphite">
                Review previews, storefront links, and customization entry points for this template group.
              </p>
            </AdminPanel>
          </Link>
        ))}
      </div>
    </section>
  );
}
