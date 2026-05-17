import type { ReactNode } from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AdminPanel({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-[0_14px_34px_rgba(27,28,25,0.06)]", className)}>
      {children}
    </section>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_14px_34px_rgba(27,28,25,0.06)] sm:flex-row sm:items-end sm:justify-between sm:p-5">
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminMetricCard({
  label,
  value,
  helper,
  tone = "press"
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "press" | "steel" | "brass" | "sage";
}) {
  const tones = {
    press: "text-press bg-press/10",
    steel: "text-steel bg-steel/10",
    brass: "text-brass bg-brass/10",
    sage: "text-cyan bg-cyan/10"
  };

  return (
    <article className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_12px_28px_rgba(27,28,25,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-black uppercase tracking-[0.08em] text-graphite">{label}</p>
        <span className={cx("h-2.5 w-2.5 rounded-full", tones[tone])} aria-hidden="true" />
      </div>
      <p className="mt-3 text-2xl font-black leading-tight text-ink sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs font-semibold leading-5 text-graphite">{helper}</p>
    </article>
  );
}

export function AdminToolbar({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_10px_24px_rgba(27,28,25,0.04)]", className)}>
      {children}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)] p-6 text-center">
      <p className="text-base font-black text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-graphite">{description}</p>
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {message}
    </div>
  );
}

export function AdminButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = ""
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const base = "inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-press text-white hover:bg-press/90",
    secondary: "border border-[var(--line)] bg-[var(--surface)] text-ink hover:border-press",
    ghost: "text-graphite hover:bg-mist hover:text-ink",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
  };
  const classNameValue = cx(base, variants[variant], className);

  if (href) {
    return (
      <a className={classNameValue} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={classNameValue} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export function AdminField({
  label,
  children,
  className = ""
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cx("grid gap-2 text-sm font-bold text-ink", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export const adminInputClass =
  "min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm font-semibold text-ink outline-none transition focus:border-press";

export const adminTextareaClass =
  "min-h-28 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 text-sm font-semibold text-ink outline-none transition focus:border-press";
