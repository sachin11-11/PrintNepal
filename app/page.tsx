import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SearchIcon } from "@/components/Icons";
import { TemplateLayerPreview } from "@/components/TemplateLayerPreview";
import type { TemplateEditorValue } from "@/components/TemplateEditor";
import { LOCAL_TEMPLATE_CATALOG } from "@/lib/templates/catalog";

export default function Home() {
  const categoryOrder = ["wedding", "student-id", "business", "birthday", "laptop-skin", "sticker"] as const;
  const categoryLabels: Record<(typeof categoryOrder)[number], string> = {
    wedding: "Wedding cards",
    "student-id": "Student ID cards",
    business: "Business cards",
    birthday: "Birthday cards",
    "laptop-skin": "Laptop skins",
    sticker: "Stickers"
  };

  const groupedTemplates = categoryOrder
    .map((category) => ({
      category,
      templates: LOCAL_TEMPLATE_CATALOG.filter((template) => template.category === category)
    }))
    .filter((group) => group.templates.length > 0);

  return (
    <main className="min-h-screen overflow-hidden bg-paper">
      <Header />

      <section className="border-b border-black/10 bg-gradient-to-b from-slate-950 via-slate-900 to-paper text-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">PrintNepal templates</p>
          <h1 className="font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">Search print templates.</h1>

          <form className="mt-10 max-w-2xl" action="/search">
            <label className="sr-only" htmlFor="template-search">
              Search templates
            </label>
            <div className="flex min-h-16 items-center gap-3 rounded-full border border-white/15 bg-white/95 px-5 shadow-soft">
              <span className="text-graphite">
                <SearchIcon />
              </span>
              <input
                id="template-search"
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-neutral-400"
                name="q"
                placeholder="Search wedding card, student id card, business card"
                type="search"
              />
              <button className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-white" type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">Explore templates</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">Browse templates by category.</h2>
            <p className="mt-3 text-sm leading-6 text-graphite">
              Wedding card 1, 2, and 3 stay grouped together. Open any category to see just those templates.
            </p>
          </div>

          <div className="space-y-12">
            {groupedTemplates.map((group) => (
              <section key={group.category} className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">{group.category}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-ink">{categoryLabels[group.category]}</h3>
                  </div>
                  <a className="text-sm font-medium text-ink underline decoration-black/20 underline-offset-4" href={`/search?q=${encodeURIComponent(categoryLabels[group.category])}`}>
                    View all
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.templates.map((template) => (
                    <a
                      key={template.id}
                      className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                      href={`/templates/${template.slug}`}
                    >
                      <div className="aspect-[4/3] bg-mist">
                        <TemplateLayerPreview isPreviewMode template={template.template_json as TemplateEditorValue} />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">{template.category}</p>
                        <h4 className="mt-2 text-lg font-semibold text-ink">{template.title}</h4>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-10">
          <div className="rounded-[1.5rem] border border-black/10 bg-mist p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">Search first</p>
            <p className="mt-3 text-sm leading-6 text-ink">Use the search bar to jump directly to a wedding card, ID card, or business card template.</p>
          </div>
          <div className="rounded-[1.5rem] border border-black/10 bg-mist p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">Explore by group</p>
            <p className="mt-3 text-sm leading-6 text-ink">Wedding 1, 2, and 3 stay grouped together so the category page only shows that family.</p>
          </div>
          <div className="rounded-[1.5rem] border border-black/10 bg-mist p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">Contacts</p>
            <p className="mt-3 text-sm leading-6 text-ink">Mail, phone, and location details live in the footer for quick customer contact.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
