const styles: Record<string, string> = {
  Ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Proofing: "border-amber-200 bg-amber-50 text-amber-700",
  "In Production": "border-blue-200 bg-blue-50 text-blue-700",
  printing: "border-blue-200 bg-blue-50 text-blue-700",
  received: "border-neutral-200 bg-neutral-50 text-neutral-700",
  designing: "border-amber-200 bg-amber-50 text-amber-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  Draft: "border-neutral-200 bg-neutral-50 text-neutral-700"
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());

  return (
    <span className={`inline-flex border px-3 py-1 text-xs font-bold ${styles[status] ?? styles.Draft}`}>
      {label}
    </span>
  );
}
