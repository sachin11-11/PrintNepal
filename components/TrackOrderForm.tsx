"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { trackOrderAction, type ActionState } from "@/lib/actions/orders";
import { OrderTimeline } from "./OrderTimeline";
import { StatusBadge } from "./StatusBadge";

const initialState: ActionState = { ok: false };

function TrackButton() {
  const { pending } = useFormStatus();

  return (
    <button className="mt-5 min-h-12 rounded-full bg-ink px-6 text-sm font-medium text-white disabled:opacity-60" disabled={pending} type="submit">
      {pending ? "Checking..." : "Track Order"}
    </button>
  );
}

export function TrackOrderForm() {
  const [state, action] = useFormState(trackOrderAction, initialState);

  useEffect(() => {
    if (state.message) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: state.message }));
    }
  }, [state.message]);

  return (
    <form action={action} className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-soft sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Email
          <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" name="email" placeholder="you@example.com" required type="email" />
          {state.errors?.email ? <span className="text-xs text-red-600">{state.errors.email}</span> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Order ID
          <input className="min-h-12 rounded-full border border-black/10 px-4 outline-none focus:border-black/30" name="orderId" placeholder="UUID order ID" required />
          {state.errors?.orderId ? <span className="text-xs text-red-600">{state.errors.orderId}</span> : null}
        </label>
      </div>
      <TrackButton />
      {state.order ? (
        <div className="mt-8 grid gap-6 rounded-3xl border border-black/10 bg-mist p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium text-ink">{state.order.customer_name}</p>
              <p className="mt-1 break-all font-mono text-xs text-graphite">{state.order.id}</p>
            </div>
            <StatusBadge status={state.order.status} />
          </div>
          <OrderTimeline status={state.order.status} />
        </div>
      ) : null}
    </form>
  );
}
