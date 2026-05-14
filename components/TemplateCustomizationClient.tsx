"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorIcon, TemplateEditor, type TemplateEditorHandle, type TemplateEditorValue } from "./TemplateEditor";
import type { ProductTemplateWithService } from "@/lib/supabase/queries";

type FieldConfig = string;

export function TemplateCustomizationClient({ template }: { template: ProductTemplateWithService }) {
  const router = useRouter();
  const editorRef = useRef<TemplateEditorHandle | null>(null);
  const fields = useMemo(() => (Array.isArray(template.editable_fields) ? template.editable_fields as FieldConfig[] : []), [template.editable_fields]);
  const customer = {
    customer_name: "PrintNepal Customer",
    email: "customer@printnepal.com",
    phone: "+977-9800000000",
    quantity: "1",
    material: "Standard cardstock",
    paper_size: template.category ?? "Custom",
    notes: ""
  };
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <TemplateEditor
      ref={editorRef}
      category={template.category}
      fields={fields}
      headerActions={
        <form className="flex items-center gap-2" onSubmit={submitOrder}>
          <button
            aria-label={location ? "Location attached" : "Attach location"}
            className="grid h-9 w-9 place-items-center border border-black/10 bg-white text-ink transition hover:border-black/25 hover:bg-mist"
            onClick={useMyLocation}
            title={location ? "Location attached to this order" : "Attach current location to this order"}
            type="button"
          >
            <EditorIcon className="h-6 w-6" name="location" />
          </button>
          <button
            aria-label={isSubmitting ? "Sending order" : "Send order"}
            className="grid h-9 w-9 place-items-center bg-[var(--solid)] text-[var(--solid-text)] transition disabled:bg-neutral-400"
            disabled={isSubmitting}
            title={isSubmitting ? "Sending order" : "Send order"}
            type="submit"
          >
            <EditorIcon className="h-6 w-6" name="send" />
          </button>
        </form>
      }
      template={template.template_json as TemplateEditorValue}
    />
  );
}
