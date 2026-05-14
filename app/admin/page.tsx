import Link from "next/link";

const adminTiles = [
  { href: "/admin/login", title: "Login", description: "Sign in to access admin tools." },
  { href: "/admin/dashboard", title: "Dashboard", description: "Orders, status, and operations at a glance." },
  { href: "/admin/orders", title: "Orders", description: "Review templates, uploads, delivery, and payment state." },
  { href: "/admin/categories", title: "Categories", description: "Browse template categories and open specific templates." },
  { href: "/admin/designs", title: "Designs", description: "Manage product design options by category." },
  { href: "/admin/services", title: "Add services", description: "Create service categories and catalog entries." },
  { href: "/admin/materials", title: "Materials", description: "Control paper and material options." }
];

const adminSteps = [
  "1. Sign in",
  "2. Open dashboard",
  "3. Review orders",
  "4. Manage categories",
  "5. Open the specific template inside a category"
];

export default function AdminHomePage() {
  return (
    <section className="space-y-8">
      <div className="atelier-hero p-5 sm:p-7">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-4 text-5xl font-black text-ink">PrintNepal control center.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-graphite">
          Use this area to manage orders, categories, and the templates inside each category.
        </p>
      </div>

      <div className="print-panel p-5">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-press">Workflow</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {adminSteps.map((step) => (
            <span key={step} className="atelier-chip px-4 py-2 text-sm font-semibold text-ink">
              {step}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminTiles.map((tile) => (
          <Link key={tile.href} className="atelier-card p-5 transition hover:-translate-y-1" href={tile.href}>
            <h2 className="text-lg font-black text-ink">{tile.title}</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">{tile.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
