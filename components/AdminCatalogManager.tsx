"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

export function AdminCatalogManager({ type }: { type: CatalogType }) {
  const [items, setItems] = useState<Array<ServiceRow | MaterialRow>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormState>(emptyServiceForm);
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
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData.entries());
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
        : {
            name: raw.name,
            type: raw.type,
            size: raw.size,
            finish: raw.finish,
            price_modifier: raw.price_modifier,
            description: raw.description
          };

    try {
      setIsSaving(true);
      await adminFetch(editingServiceId ? `/api/admin/${type}/${editingServiceId}` : `/api/admin/${type}`, {
        method: editingServiceId ? "PATCH" : "POST",
        body: JSON.stringify(payload)
      });
      event.currentTarget.reset();
      setEditingServiceId(null);
      setServiceForm(emptyServiceForm);
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: `${type === "services" ? "Service" : "Material"} ${editingServiceId ? "updated" : "added"}.` }));
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

  async function editItem(item: ServiceRow | MaterialRow) {
    if ("title" in item) {
      setEditingServiceId(item.id);
      setServiceForm(serviceToForm(item));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const currentName = item.name;
    const nextName = window.prompt("Update name", currentName);

    if (!nextName || nextName === currentName) {
      return;
    }

    const payload = "title" in item ? { title: nextName } : { name: nextName };

    try {
      await adminFetch(`/api/admin/${type}/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Updated." }));
      await loadItems();
    } catch (editError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: editError instanceof Error ? editError.message : "Could not update item." }));
    }
  }

  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">{type}</p>
        <h1 className="mt-4 font-serif text-5xl text-ink">{type === "services" ? "Add services." : "Material library."}</h1>
      </div>
      <form className="mt-8 grid gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm lg:grid-cols-3" onSubmit={handleSubmit}>
        {type === "services" ? (
          <>
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="title" onChange={(event) => setServiceForm((current) => ({ ...current, title: event.target.value }))} placeholder="Product title" required value={serviceForm.title} />
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="slug" onChange={(event) => setServiceForm((current) => ({ ...current, slug: event.target.value }))} placeholder="slug-name" required value={serviceForm.slug} />
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="category" onChange={(event) => setServiceForm((current) => ({ ...current, category: event.target.value }))} placeholder="Category" value={serviceForm.category} />
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="base_price" onChange={(event) => setServiceForm((current) => ({ ...current, base_price: event.target.value }))} placeholder="Base price" type="number" min="0" required value={serviceForm.base_price} />
            <input className="min-h-11 rounded-full border border-black/10 px-4 lg:col-span-2" name="image_url" onChange={(event) => setServiceForm((current) => ({ ...current, image_url: event.target.value }))} placeholder="Image URL or upload below" value={serviceForm.image_url} />
            <label className="flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-black/10 px-4 text-sm font-medium text-ink transition hover:border-black/25">
              Upload image
              <input
                accept="image/*"
                className="sr-only"
                name="image_file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    uploadProductImage(file);
                  }
                }}
                type="file"
              />
            </label>
            <label className="flex min-h-11 items-center gap-3 rounded-full border border-black/10 px-4 text-sm text-graphite">
              <input checked={serviceForm.is_featured} name="is_featured" onChange={(event) => setServiceForm((current) => ({ ...current, is_featured: event.target.checked }))} type="checkbox" /> Featured
            </label>
            {serviceForm.image_url ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-black/10 bg-mist lg:col-span-3">
                <Image alt="Product preview" className="h-full w-full object-cover" fill sizes="(min-width: 1024px) 60vw, 100vw" src={serviceForm.image_url} />
              </div>
            ) : null}
            <textarea className="min-h-24 rounded-3xl border border-black/10 p-4 lg:col-span-3" name="description" onChange={(event) => setServiceForm((current) => ({ ...current, description: event.target.value }))} placeholder="Product description" value={serviceForm.description} />
            <textarea className="min-h-28 rounded-3xl border border-black/10 p-4 lg:col-span-3" name="specifications" onChange={(event) => setServiceForm((current) => ({ ...current, specifications: event.target.value }))} placeholder="Specifications, one per line. Example: Paper: 300gsm cardstock" value={serviceForm.specifications} />
          </>
        ) : (
          <>
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="name" placeholder="Name" required />
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="type" placeholder="Type" />
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="size" placeholder="Size" />
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="finish" placeholder="Finish" />
            <input className="min-h-11 rounded-full border border-black/10 px-4" name="price_modifier" placeholder="Price modifier" type="number" min="0" required />
            <textarea className="min-h-24 rounded-3xl border border-black/10 p-4 lg:col-span-3" name="description" placeholder="Description" />
          </>
        )}
        <div className="flex flex-col gap-3 lg:col-span-3 sm:flex-row">
          <button className="min-h-11 flex-1 rounded-full bg-ink px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-400" disabled={isSaving} type="submit">
            {editingServiceId ? `Update ${type === "services" ? "service" : "material"}` : `Add ${type === "services" ? "services" : "material"}`}
          </button>
          {editingServiceId ? (
            <button
              className="min-h-11 rounded-full border border-black/10 px-5 text-sm font-medium text-ink"
              onClick={() => {
                setEditingServiceId(null);
                setServiceForm(emptyServiceForm);
              }}
              type="button"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
      {error ? <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {!error && !isLoading && items.length === 0 ? <p className="mt-8 rounded-2xl border border-black/10 bg-white p-5 text-sm text-graphite">No items yet.</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm">
            {"image_url" in item && item.image_url ? (
              <div className="relative aspect-[4/3] bg-mist">
                <Image alt={`${item.title} product`} className="h-full w-full object-cover" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" src={item.image_url} />
              </div>
            ) : null}
            <div className="p-5">
            <h2 className="text-lg font-semibold text-ink">{"title" in item ? item.title : item.name}</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">{"category" in item ? item.category : item.type}</p>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-graphite">{item.description}</p>
            {"specifications" in item && item.specifications ? (
              <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-graphite">{item.specifications}</p>
            ) : null}
            <div className="mt-5 flex gap-2">
              <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-ink" onClick={() => editItem(item)} type="button">
                Edit
              </button>
              <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-ink" onClick={() => deleteItem(item.id)} type="button">
                Delete
              </button>
            </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
