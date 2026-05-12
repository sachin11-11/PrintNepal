import type { OrderStatus } from "@/types/database";

const steps: OrderStatus[] = ["received", "designing", "printing", "ready", "delivered"];
const labels: Record<OrderStatus, string> = {
  received: "Received",
  designing: "Designing",
  printing: "Printing",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        This order has been cancelled.
      </div>
    );
  }

  const activeIndex = steps.indexOf(status);

  return (
    <ol className="grid gap-3 sm:grid-cols-5" aria-label="Order status timeline">
      {steps.map((step, index) => {
        const isDone = index <= activeIndex;

        return (
          <li key={step} className="flex items-center gap-3 sm:block">
            <span className={`flex h-9 w-9 items-center justify-center border text-xs font-bold ${isDone ? "border-[var(--solid)] bg-[var(--solid)] text-[var(--solid-text)]" : "border-black/10 bg-white text-graphite"}`}>
              {index + 1}
            </span>
            <span className={`text-sm font-medium sm:mt-3 sm:block ${isDone ? "text-ink" : "text-graphite"}`}>
              {labels[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
