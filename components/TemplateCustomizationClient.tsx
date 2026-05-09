"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TemplateEditorHandle, TemplateEditorValue } from "./TemplateEditor";
import type { ProductTemplateWithService } from "@/lib/supabase/queries";
import { estimateCompletionMinutes, estimateDeliveryMinutes, haversineDistanceKm } from "@/lib/location/distance";

import { TemplateEditor } from "./TemplateEditor";

type FieldConfig = string;

function labelForField(field: string) {
  return field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function isImageField(field: string) {
  return ["photo", "logo"].includes(field);
}

export function TemplateCustomizationClient({ template }: { template: ProductTemplateWithService }) {
  const router = useRouter();
  const editorRef = useRef<TemplateEditorHandle | null>(null);
  const fields = useMemo(() => (Array.isArray(template.editable_fields) ? template.editable_fields as FieldConfig[] : []), [template.editable_fields]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [customer, setCustomer] = useState({
    customer_name: "",
    email: "",
    phone: "",
    quantity: "1",
    material: "Standard cardstock",
    notes: ""
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shopLat = Number(process.env.NEXT_PUBLIC_SHOP_LAT);
  const shopLng = Number(process.env.NEXT_PUBLIC_SHOP_LNG);
  const distanceKm = location && Number.isFinite(shopLat) && Number.isFinite(shopLng)
    ? haversineDistanceKm({ lat: shopLat, lng: shopLng }, location)
    : null;
  const deliveryMinutes = distanceKm === null ? null : estimateDeliveryMinutes(distanceKm);
  const completionMinutes = estimateCompletionMinutes(template.services?.title ?? template.title);

  function updateValue(field: string, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    editorRef.current?.updateField(field, value);
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/template-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: template.id,
          ...customer,
          customer_lat: location?.lat ?? null,
          customer_lng: location?.lng ?? null,
          final_design_png: editorRef.current?.exportPng(),
          final_design_json: editorRef.current?.exportJson()
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create order.");
      }

      router.push(`/order/confirmation?orderId=${payload.orderId}`);
    } catch (error) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: error instanceof Error ? error.message : "Could not create order." }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_26rem]">
      <TemplateEditor
        ref={editorRef}
        category={template.category}
        fields={fields}
        template={template.template_json as TemplateEditorValue}
        values={values}
      />
      <form className="relative z-20 grid gap-5 rounded-[2rem] border border-black/10 bg-white p-5 shadow-soft" onSubmit={submitOrder}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">{template.category}</p>
          <h1 className="mt-3 font-serif text-4xl text-ink">{template.title}</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="min-h-12 rounded-full border border-black/10 px-4" onChange={(event) => setCustomer((current) => ({ ...current, customer_name: event.target.value }))} placeholder="Customer name" required value={customer.customer_name} />
          <input className="min-h-12 rounded-full border border-black/10 px-4" onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))} placeholder="Email" required type="email" value={customer.email} />
          <input className="min-h-12 rounded-full border border-black/10 px-4" onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" required value={customer.phone} />
          <input className="min-h-12 rounded-full border border-black/10 px-4" min="1" onChange={(event) => setCustomer((current) => ({ ...current, quantity: event.target.value }))} placeholder="Quantity" required type="number" value={customer.quantity} />
        </div>
        <input className="min-h-12 rounded-full border border-black/10 px-4" onChange={(event) => setCustomer((current) => ({ ...current, material: event.target.value }))} placeholder="Material" value={customer.material} />
        <div className="grid gap-4">
          {fields.map((field) => (
            <label key={field} className="grid gap-2 text-sm font-medium text-ink">
              {labelForField(field)}
              {isImageField(field) ? (
                <input className="rounded-full border border-dashed border-black/20 bg-mist px-4 py-3 text-sm text-graphite" accept="image/*" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const objectUrl = URL.createObjectURL(file);
                  editorRef.current?.replaceImage(field, objectUrl);
                }} type="file" />
              ) : (
                <input className="min-h-12 rounded-full border border-black/10 px-4" onChange={(event) => updateValue(field, event.target.value)} placeholder={labelForField(field)} type={field === "color" ? "color" : "text"} value={values[field] ?? ""} />
              )}
            </label>
          ))}
        </div>
        <textarea className="min-h-28 rounded-3xl border border-black/10 p-4" onChange={(event) => setCustomer((current) => ({ ...current, notes: event.target.value }))} placeholder="Notes" value={customer.notes} />
        <div className="rounded-3xl border border-black/10 bg-mist p-4 text-sm text-graphite">
          <p className="font-medium text-ink">Delivery estimate</p>
          <p className="mt-2">Shop: {process.env.NEXT_PUBLIC_SHOP_ADDRESS ?? "Configure NEXT_PUBLIC_SHOP_ADDRESS"}</p>
          {distanceKm === null ? (
            <button className="mt-3 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink" onClick={useMyLocation} type="button">Use my location</button>
          ) : (
            <p className="mt-2">Distance: {distanceKm.toFixed(2)} km · Delivery: {deliveryMinutes} min</p>
          )}
          <p className="mt-2">Estimated print completion: {completionMinutes} min</p>
        </div>
        <button className="relative z-20 min-h-12 rounded-full bg-ink px-6 text-sm font-medium text-white disabled:bg-neutral-400" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting..." : "Submit customized order"}
        </button>
      </form>
    </div>
  );
}
