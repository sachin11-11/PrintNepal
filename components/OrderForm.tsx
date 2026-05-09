"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createOrderAction, type ActionState } from "@/lib/actions/orders";
import type { MaterialRow, ProductDesignRow, ServiceRow } from "@/types/database";

const initialState: ActionState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="min-h-13 rounded-full bg-ink px-6 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Creating order..." : "Submit Order Request"}
    </button>
  );
}

export function OrderForm({
  services,
  materials,
  designs
}: {
  services: ServiceRow[];
  materials: MaterialRow[];
  designs: ProductDesignRow[];
}) {
  const [state, action] = useFormState(createOrderAction, initialState);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const serviceDesigns = useMemo(
    () => designs.filter((design) => design.service_id === selectedServiceId),
    [designs, selectedServiceId]
  );

  useEffect(() => {
    if (state.message) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: state.message }));
    }
  }, [state.message]);

  return (
    <form action={action} className="grid gap-5 rounded-[2rem] border border-black/10 bg-white p-5 shadow-soft sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Customer name
          <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" name="customer_name" placeholder="Your name" required />
          {state.errors?.customer_name ? <span className="text-xs text-red-600">{state.errors.customer_name}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Email
          <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" name="email" placeholder="you@example.com" required type="email" />
          {state.errors?.email ? <span className="text-xs text-red-600">{state.errors.email}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Phone
          <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" name="phone" placeholder="+977" required />
          {state.errors?.phone ? <span className="text-xs text-red-600">{state.errors.phone}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Quantity
          <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" defaultValue="1" min="1" name="quantity" required type="number" />
          {state.errors?.quantity ? <span className="text-xs text-red-600">{state.errors.quantity}</span> : null}
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-ink">
        Service
        <select className="min-h-12 rounded-full border border-black/10 bg-white px-4 outline-none focus:border-black/30" defaultValue="" name="service_id" onChange={(event) => setSelectedServiceId(event.target.value)} required>
          <option value="" disabled>Select a print service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.title}</option>
          ))}
        </select>
        {state.errors?.service_id ? <span className="text-xs text-red-600">{state.errors.service_id}</span> : null}
      </label>
      {serviceDesigns.length > 0 ? (
        <fieldset className="grid gap-4 rounded-3xl border border-black/10 p-4">
          <legend className="px-2 text-sm font-medium text-ink">Choose an existing design</legend>
          <label className="flex items-center gap-3 text-sm text-graphite">
            <input className="h-4 w-4 accent-ink" defaultChecked name="selected_design_id" type="radio" value="" />
            I will upload my own design
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceDesigns.map((design) => (
              <label key={design.id} className="cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-mist text-sm text-ink transition has-[:checked]:border-black has-[:checked]:bg-white">
                {design.image_url ? (
                  <span className="relative block aspect-[4/3]">
                    <Image alt={`${design.title} option`} className="h-full w-full object-cover" fill sizes="(min-width: 640px) 50vw, 100vw" src={design.image_url} />
                  </span>
                ) : null}
                <span className="flex gap-3 p-3">
                  <input className="mt-1 h-4 w-4 accent-ink" name="selected_design_id" type="radio" value={design.id} />
                  <span>
                    <span className="block font-medium">{design.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-graphite">{design.description}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Paper size
          <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" name="paper_size" placeholder="A4, A3, business card, custom" required />
          {state.errors?.paper_size ? <span className="text-xs text-red-600">{state.errors.paper_size}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Paper type/material
          <select className="min-h-12 rounded-full border border-black/10 bg-white px-4 outline-none focus:border-black/30" defaultValue="" name="paper_type" required>
            <option value="" disabled>Select material</option>
            {materials.map((material) => (
              <option key={material.id} value={material.name}>{material.name}</option>
            ))}
          </select>
          {state.errors?.paper_type ? <span className="text-xs text-red-600">{state.errors.paper_type}</span> : null}
        </label>
      </div>
      <fieldset className="grid gap-3 rounded-3xl border border-black/10 p-4">
        <legend className="px-2 text-sm font-medium text-ink">Design method</legend>
        {[
          ["uploaded", "Upload design"],
          ["email_design", "Send design by email"],
          ["need_design", "Need design help"]
        ].map(([value, label]) => (
          <label key={value} className="flex items-center gap-3 text-sm text-graphite">
            <input className="h-4 w-4 accent-ink" defaultChecked={value === "uploaded"} name="design_method" type="radio" value={value} />
            {label}
          </label>
        ))}
        {state.errors?.design_method ? <span className="text-xs text-red-600">{state.errors.design_method}</span> : null}
      </fieldset>
      <label className="grid gap-2 text-sm font-medium text-ink">
        File upload
        <input className="rounded-full border border-dashed border-black/20 bg-mist px-4 py-3 text-sm text-graphite" name="design_file" type="file" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-ink">
        Notes
        <textarea className="min-h-36 rounded-3xl border border-black/10 p-4 outline-none focus:border-black/30" name="notes" placeholder="Deadline, delivery location, finishing details, design notes" />
        {state.errors?.notes ? <span className="text-xs text-red-600">{state.errors.notes}</span> : null}
      </label>
      <SubmitButton />
    </form>
  );
}
