"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  AdminButton,
  AdminEmptyState,
  AdminError,
  AdminField,
  AdminPageHeader,
  AdminPanel,
  AdminToolbar,
  adminInputClass,
  adminTextareaClass,
  cx
} from "@/components/AdminUI";
import { adminFetch } from "@/lib/admin-client";
import type { MaterialRow, ServiceRow } from "@/types/database";

type CatalogType = "services" | "materials";

type ServiceFormState = {
  title: string;
  slug: string;
  category: string;
  base_price: string;
  image_url: string;
  description: string;
  specifications: string;
  is_featured: boolean;
};

type MaterialFormState = {
  name: string;
  type: string;
  size: string;
  finish: string;
  price_modifier: string;
  description: string;
};

const emptyServiceForm: ServiceFormState = {
  title: "",
  slug: "",
  category: "",
  base_price: "",
  image_url: "",
  description: "",
  specifications: "",
  is_featured: false
};

const emptyMaterialForm: MaterialFormState = {
  name: "",
  type: "",
  size: "",
  finish: "",
  price_modifier: "",
  description: ""
};

const servicePresets = [
  {
    label: "ID cards",
    title: "Student ID Cards",
    category: "Cards",
    base_price: "120",
    description: "PVC and laminated identity cards with editable photo, logo, and student fields.",
    specifications: "Size: ID Card\nMaterial: PVC or laminated card\nDesign: Editable template required\nDelivery: Pickup or local delivery"
  },
  {
    label: "Business cards",
    title: "Business Cards",
    category: "Business Stationery",
    base_price: "8",
    description: "Professional visiting cards for business owners, teams, and offices.",
    specifications: "Size: 3.5 x 2 inch\nPaper: 300-350gsm\nFinish: Matte, gloss, or round corners\nDesign: Upload, template, or design help"
  },
  {
    label: "Flyers",
    title: "Flyers and Posters",
    category: "Marketing",
    base_price: "35",
    description: "Marketing flyers, handouts, posters, and announcement prints.",
    specifications: "Sizes: A5, A4, A3\nPaper: 130-250gsm\nFinish: Standard or gloss\nDesign: Upload or request design help"
  }
];

const materialPresets = [
  { label: "Art paper", name: "170gsm Art Paper", type: "Paper", size: "A4/A3", finish: "Standard", price_modifier: "10" },
  { label: "Cardstock", name: "350gsm Matte Card", type: "Card", size: "Business/Custom", finish: "Matte", price_modifier: "32" },
  { label: "Vinyl", name: "Gloss Sticker Vinyl", type: "Sticker", size: "Custom", finish: "Gloss", price_modifier: "24" }
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function serviceToForm(item: ServiceRow): ServiceFormState {
  return {
    title: item.title,
    slug: item.slug,
    category: item.category ?? "",
    base_price: String(item.base_price),
    image_url: item.image_url ?? "",
    description: item.description ?? "",
    specifications: item.specifications ?? "",
    is_featured: item.is_featured
  };
}

function materialToForm(item: MaterialRow): MaterialFormState {
  return {
    name: item.name,
    type: item.type ?? "",
    size: item.size ?? "",
    finish: item.finish ?? "",
    price_modifier: String(item.price_modifier),
    description: item.description ?? ""
  };
}

export function AdminCatalogManager({ type }: { type: CatalogType }) {
  const [items, setItems] = useState<Array<ServiceRow | MaterialRow>>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormState>(emptyServiceForm);
  const [materialForm, setMaterialForm] = useState<MaterialFormState>(emptyMaterialForm);
  const [error, setError] = useState("");

  async function loadItems() {
    setIsLoading(true);
    setError("");

    try {
      const payload = await adminFetch(`/api/admin/${type}`);
      setItems(payload[type] ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load catalog.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setEditingId(null);
    setServiceForm(emptyServiceForm);
    setMaterialForm(emptyMaterialForm);
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;

    return items.filter((item) => {
      const text = "title" in item
        ? [item.title, item.slug, item.category, item.description, item.specifications].join(" ")
        : [item.name, item.type, item.size, item.finish, item.description].join(" ");
      return text.toLowerCase().includes(normalized);
    });
  }, [items, query]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload =
      type === "services"
        ? {
            title: serviceForm.title,
            slug: serviceForm.slug,
            category: serviceForm.category,
            description: serviceForm.description,
            specifications: serviceForm.specifications,
            image_url: serviceForm.image_url,
            base_price: serviceForm.base_price,
            is_featured: serviceForm.is_featured
          }
        : materialForm;

    try {
      setIsSaving(true);
      await adminFetch(editingId ? `/api/admin/${type}/${editingId}` : `/api/admin/${type}`, {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify(payload)
      });
      setEditingId(null);
      setServiceForm(emptyServiceForm);
      setMaterialForm(emptyMaterialForm);
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: `${type === "services" ? "Service" : "Material"} ${editingId ? "updated" : "added"}.` }));
      await loadItems();
    } catch (submitError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: submitError instanceof Error ? submitError.message : "Could not save item." }));
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadProductImage(file: File) {
    const imageData = new FormData();
    imageData.append("image", file);

    try {
      const payload = await adminFetch("/api/admin/product-images", {
        method: "POST",
        body: imageData
      });
      setServiceForm((current) => ({ ...current, image_url: payload.image_url ?? "" }));
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Image uploaded." }));
    } catch (uploadError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: uploadError instanceof Error ? uploadError.message : "Could not upload image." }));
    }
  }

  async function deleteItem(id: string) {
    try {
      await adminFetch(`/api/admin/${type}/${id}`, { method: "DELETE" });
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Deleted." }));
      await loadItems();
    } catch (deleteError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: deleteError instanceof Error ? deleteError.message : "Could not delete item." }));
    }
  }

  function editItem(item: ServiceRow | MaterialRow) {
    setEditingId(item.id);
    if ("title" in item) {
      setServiceForm(serviceToForm(item));
    } else {
      setMaterialForm(materialToForm(item));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearEdit() {
    setEditingId(null);
    setServiceForm(emptyServiceForm);
    setMaterialForm(emptyMaterialForm);
  }

  function applyServicePreset(preset: (typeof servicePresets)[number]) {
    setEditingId(null);
    setServiceForm({
      title: preset.title,
      slug: slugify(preset.title),
      category: preset.category,
      base_price: preset.base_price,
      image_url: "",
      description: preset.description,
      specifications: preset.specifications,
      is_featured: true
    });
  }

  function applyMaterialPreset(preset: (typeof materialPresets)[number]) {
    setEditingId(null);
    setMaterialForm({
      name: preset.name,
      type: preset.type,
      size: preset.size,
      finish: preset.finish,
      price_modifier: preset.price_modifier,
      description: ""
    });
  }

  const isServices = type === "services";
  const pageTitle = isServices ? "Service catalog" : "Material library";
  const description = isServices
    ? "Manage the customer-facing print products, base prices, specs, featured state, and images."
    : "Manage paper, stock, finish, size, and pricing modifiers used by the print shop.";

  return (
    <section className="grid gap-5">
      <AdminPageHeader description={description} eyebrow={isServices ? "Services" : "Materials"} title={pageTitle} />

      <AdminError message={error} />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <AdminPanel className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">{editingId ? "Editing item" : "Create item"}</p>
              <h2 className="mt-2 text-xl font-black text-ink">{editingId ? "Update catalog record" : isServices ? "Add service" : "Add material"}</h2>
            </div>
            {editingId ? <AdminButton onClick={clearEdit} variant="secondary">Cancel edit</AdminButton> : null}
          </div>

          <form className="mt-5 grid gap-4 lg:grid-cols-3" onSubmit={handleSubmit}>
            {isServices ? (
              <>
                <AdminField label="Product title">
                  <input className={adminInputClass} onChange={(event) => setServiceForm((current) => ({ ...current, title: event.target.value, slug: current.slug || slugify(event.target.value) }))} required value={serviceForm.title} />
                </AdminField>
                <AdminField label="Slug">
                  <input className={adminInputClass} onChange={(event) => setServiceForm((current) => ({ ...current, slug: event.target.value }))} required value={serviceForm.slug} />
                </AdminField>
                <AdminField label="Category">
                  <input className={adminInputClass} onChange={(event) => setServiceForm((current) => ({ ...current, category: event.target.value }))} value={serviceForm.category} />
                </AdminField>
                <AdminField label="Base price">
                  <input className={adminInputClass} min="0" onChange={(event) => setServiceForm((current) => ({ ...current, base_price: event.target.value }))} required type="number" value={serviceForm.base_price} />
                </AdminField>
                <AdminField className="lg:col-span-2" label="Image URL">
                  <input className={adminInputClass} onChange={(event) => setServiceForm((current) => ({ ...current, image_url: event.target.value }))} value={serviceForm.image_url} />
                </AdminField>
                <label className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-[var(--line)] bg-mist px-4 text-sm font-black text-ink transition hover:border-press">
                  Upload image
                  <input accept="image/*" className="sr-only" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadProductImage(file);
                  }} type="file" />
                </label>
                <label className="flex min-h-11 items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-bold text-ink">
                  <input checked={serviceForm.is_featured} onChange={(event) => setServiceForm((current) => ({ ...current, is_featured: event.target.checked }))} type="checkbox" />
                  Featured on storefront
                </label>
                {serviceForm.image_url ? (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[var(--line)] bg-mist lg:col-span-3">
                    <Image alt="Product preview" className="h-full w-full object-cover" fill sizes="(min-width: 1024px) 60vw, 100vw" src={serviceForm.image_url} />
                  </div>
                ) : null}
                <AdminField className="lg:col-span-3" label="Description">
                  <textarea className={adminTextareaClass} onChange={(event) => setServiceForm((current) => ({ ...current, description: event.target.value }))} value={serviceForm.description} />
                </AdminField>
                <AdminField className="lg:col-span-3" label="Specifications">
                  <textarea className={cx(adminTextareaClass, "min-h-32")} onChange={(event) => setServiceForm((current) => ({ ...current, specifications: event.target.value }))} value={serviceForm.specifications} />
                </AdminField>
              </>
            ) : (
              <>
                <AdminField label="Name">
                  <input className={adminInputClass} onChange={(event) => setMaterialForm((current) => ({ ...current, name: event.target.value }))} required value={materialForm.name} />
                </AdminField>
                <AdminField label="Type">
                  <input className={adminInputClass} onChange={(event) => setMaterialForm((current) => ({ ...current, type: event.target.value }))} value={materialForm.type} />
                </AdminField>
                <AdminField label="Size">
                  <input className={adminInputClass} onChange={(event) => setMaterialForm((current) => ({ ...current, size: event.target.value }))} value={materialForm.size} />
                </AdminField>
                <AdminField label="Finish">
                  <input className={adminInputClass} onChange={(event) => setMaterialForm((current) => ({ ...current, finish: event.target.value }))} value={materialForm.finish} />
                </AdminField>
                <AdminField label="Price modifier">
                  <input className={adminInputClass} min="0" onChange={(event) => setMaterialForm((current) => ({ ...current, price_modifier: event.target.value }))} required type="number" value={materialForm.price_modifier} />
                </AdminField>
                <AdminField className="lg:col-span-3" label="Description">
                  <textarea className={adminTextareaClass} onChange={(event) => setMaterialForm((current) => ({ ...current, description: event.target.value }))} value={materialForm.description} />
                </AdminField>
              </>
            )}
            <div className="flex flex-col gap-2 sm:flex-row lg:col-span-3">
              <AdminButton className="flex-1" disabled={isSaving} type="submit">
                {editingId ? "Update" : "Create"} {isServices ? "service" : "material"}
              </AdminButton>
              <AdminButton onClick={clearEdit} variant="secondary">Clear</AdminButton>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel className="p-4 sm:p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">Fast presets</p>
          <h2 className="mt-2 text-xl font-black text-ink">Blueprints</h2>
          <div className="mt-4 grid gap-3">
            {(isServices ? servicePresets : materialPresets).map((preset) => (
              <button
                className="rounded-lg border border-[var(--line)] bg-mist p-3 text-left transition hover:border-press hover:bg-white"
                key={preset.label}
                onClick={() => isServices ? applyServicePreset(preset as (typeof servicePresets)[number]) : applyMaterialPreset(preset as (typeof materialPresets)[number])}
                type="button"
              >
                <span className="text-sm font-black text-ink">{preset.label}</span>
                <span className="mt-1 block text-xs font-semibold leading-5 text-graphite">
                  {"category" in preset ? preset.category : preset.type} · NPR {"base_price" in preset ? preset.base_price : preset.price_modifier}
                </span>
              </button>
            ))}
          </div>
        </AdminPanel>
      </div>

      <AdminToolbar>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input className={cx(adminInputClass, "sm:max-w-md")} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${type}`} type="search" value={query} />
          <p className="text-sm font-black text-graphite">{isLoading ? "Loading..." : `${visibleItems.length} ${isServices ? "services" : "materials"}`}</p>
        </div>
      </AdminToolbar>

      {!error && !isLoading && visibleItems.length === 0 ? (
        <AdminEmptyState title={`No ${type} found`} description="Create a new record or adjust the search filter." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item) => (
          <AdminPanel className="overflow-hidden" key={item.id}>
            {"image_url" in item && item.image_url ? (
              <div className="relative aspect-[16/9] border-b border-[var(--line)] bg-mist">
                <Image alt={`${item.title} product`} className="h-full w-full object-cover" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" src={item.image_url} />
              </div>
            ) : null}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">{"title" in item ? item.category ?? "Service" : item.type ?? "Material"}</p>
                  <h2 className="mt-2 text-lg font-black text-ink">{"title" in item ? item.title : item.name}</h2>
                </div>
                {"is_featured" in item && item.is_featured ? <span className="rounded-md bg-press/10 px-2 py-1 text-xs font-black text-press">Featured</span> : null}
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-graphite">{item.description || "No description yet."}</p>
              {"specifications" in item && item.specifications ? <p className="mt-3 line-clamp-3 whitespace-pre-line text-xs font-semibold leading-5 text-graphite">{item.specifications}</p> : null}
              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-mist p-3 text-sm font-black text-ink">
                <span>{"base_price" in item ? "Base price" : "Modifier"}</span>
                <span>NPR {Number("base_price" in item ? item.base_price : item.price_modifier).toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <AdminButton onClick={() => editItem(item)} variant="secondary">Edit</AdminButton>
                <AdminButton onClick={() => deleteItem(item.id)} variant="danger">Delete</AdminButton>
              </div>
            </div>
          </AdminPanel>
        ))}
      </div>
    </section>
  );
}
