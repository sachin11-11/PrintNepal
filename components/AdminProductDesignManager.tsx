"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-client";
import type { ProductDesignRow, ServiceRow } from "@/types/database";

type DesignWithService = ProductDesignRow & {
  services?: { title: string; slug: string } | null;
};

const emptyForm = {
  service_id: "",
  title: "",
  category: "",
  description: "",
  image_url: "",
  price: "",
  is_active: true
};

export function AdminProductDesignManager() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [designs, setDesigns] = useState<DesignWithService[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function loadData() {
    const [servicesPayload, designsPayload] = await Promise.all([
      adminFetch("/api/admin/services"),
      adminFetch("/api/admin/product-designs")
    ]);
    setServices(servicesPayload.services ?? []);
    setDesigns(designsPayload.designs ?? []);
  }

  useEffect(() => {
    loadData().catch((error) => {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: error instanceof Error ? error.message : "Could not load designs." }));
    });
  }, []);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const payload = await adminFetch("/api/admin/product-images", {
      method: "POST",
      body: formData
    });
    setForm((current) => ({ ...current, image_url: payload.image_url ?? "" }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await adminFetch(editingId ? `/api/admin/product-designs/${editingId}` : "/api/admin/product-designs", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify(form)
      });
      setEditingId(null);
      setForm(emptyForm);
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: editingId ? "Design updated." : "Design added." }));
      await loadData();
    } catch (error) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: error instanceof Error ? error.message : "Could not save design." }));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteDesign(id: string) {
    await adminFetch(`/api/admin/product-designs/${id}`, { method: "DELETE" });
    await loadData();
  }

  return (
    <section>
      <div className="border-l-4 border-press bg-white/80 p-5">
        <p className="eyebrow">Design catalog</p>
        <h1 className="mt-4 text-5xl font-black text-ink">Product design options.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-graphite">
          Add multiple choices under wedding cards, ID cards, or any product. Customers can select these before uploading their own design.
        </p>
      </div>

      <form className="print-panel mt-8 grid gap-4 p-5 lg:grid-cols-3" onSubmit={handleSubmit}>
        <select className="min-h-11 border border-ink/15 bg-white px-4" onChange={(event) => setForm((current) => ({ ...current, service_id: event.target.value }))} required value={form.service_id}>
          <option value="" disabled>Select product category</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.title}</option>
          ))}
        </select>
        <input className="min-h-11 border border-ink/15 px-4" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Design name" required value={form.title} />
        <input className="min-h-11 border border-ink/15 px-4" onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder="Style/category" value={form.category} />
        <input className="min-h-11 border border-ink/15 px-4" min="0" onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="Price" required type="number" value={form.price} />
        <input className="min-h-11 border border-ink/15 px-4 lg:col-span-2" onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))} placeholder="Image URL" value={form.image_url} />
        <label className="flex min-h-11 cursor-pointer items-center justify-center border border-ink/15 px-4 text-sm font-bold text-ink">
          Upload design image
          <input accept="image/*" className="sr-only" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadImage(file);
          }} type="file" />
        </label>
        <label className="flex min-h-11 items-center gap-3 border border-ink/15 px-4 text-sm text-graphite">
          <input checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} type="checkbox" /> Active
        </label>
        {form.image_url ? (
          <div className="relative aspect-[16/9] overflow-hidden border border-ink/10 bg-mist lg:col-span-3">
            <Image alt="Design preview" className="h-full w-full object-cover" fill sizes="(min-width: 1024px) 60vw, 100vw" src={form.image_url} />
          </div>
        ) : null}
        <textarea className="min-h-28 border border-ink/15 p-4 lg:col-span-3" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Design details, materials, color choices" value={form.description} />
        <button className="min-h-11 bg-[var(--solid)] px-5 text-sm font-bold text-[var(--solid-text)] disabled:bg-neutral-400 lg:col-span-3" disabled={isSaving} type="submit">
          {editingId ? "Update design" : "Add design"}
        </button>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {designs.map((design) => (
          <article key={design.id} className="overflow-hidden border border-ink/10 bg-white shadow-sm">
            {design.image_url ? (
              <div className="relative aspect-[4/3] border-b border-ink/10 bg-mist">
                <Image alt={`${design.title} design`} className="h-full w-full object-cover" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" src={design.image_url} />
              </div>
            ) : null}
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-press">{design.services?.title ?? "Product"}</p>
              <h2 className="mt-2 text-lg font-black text-ink">{design.title}</h2>
              <p className="mt-2 text-sm leading-6 text-graphite">{design.description}</p>
              <div className="mt-5 flex gap-2">
                <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-ink" onClick={() => {
                  setEditingId(design.id);
                  setForm({
                    service_id: design.service_id ?? "",
                    title: design.title,
                    category: design.category ?? "",
                    description: design.description ?? "",
                    image_url: design.image_url ?? "",
                    price: String(design.price),
                    is_active: design.is_active
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }} type="button">Edit</button>
                <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-ink" onClick={() => deleteDesign(design.id)} type="button">Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
