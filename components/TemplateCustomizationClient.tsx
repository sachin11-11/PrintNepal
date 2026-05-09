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
    customer_name: "PrintNepal Customer",
    email: "customer@printnepal.com",
    phone: "+977-9800000000",
    quantity: "1",
    material: "Standard cardstock",
    paper_size: template.category ?? "Custom",
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
          template_title: template.title,
          template_category: template.category,
          template_service_title: template.services?.title ?? null,
          ...customer,
          customer_lat: location?.lat ?? null,
          customer_lng: location?.lng ?? null,
          final_design_png: await editorRef.current?.exportPng(),
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
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <TemplateEditor
        ref={editorRef}
        category={template.category}
        fields={fields}
        template={template.template_json as TemplateEditorValue}
        values={values}
      />
      <form className="sticky top-4 z-20 grid gap-4 rounded-[2rem] border border-black/10 bg-white p-5 shadow-soft" onSubmit={submitOrder}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-graphite">{template.category}</p>
          <h1 className="mt-3 font-serif text-4xl text-ink">{template.title}</h1>
        </div>
        <input type="hidden" name="customer_name" value={customer.customer_name} readOnly />
        <input type="hidden" name="email" value={customer.email} readOnly />
        <input type="hidden" name="phone" value={customer.phone} readOnly />
        <input type="hidden" name="quantity" value={customer.quantity} readOnly />
        <input type="hidden" name="material" value={customer.material} readOnly />
        <input type="hidden" name="paper_size" value={customer.paper_size} readOnly />
        <input type="hidden" name="notes" value={customer.notes} readOnly />
        <input type="hidden" name="design_method" value="uploaded" readOnly />

        <div className="grid gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite">Photo / logo uploads</p>
          {fields.filter(isImageField).map((field) => (
            <label key={field} className="grid gap-2 text-sm font-medium text-ink">
              {labelForField(field)}
              <input
                className="rounded-full border border-dashed border-black/20 bg-mist px-4 py-3 text-sm text-graphite"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const objectUrl = URL.createObjectURL(file);
                  editorRef.current?.replaceImage(field, objectUrl);
                }}
                type="file"
              />
            </label>
          ))}
        </div>
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
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
