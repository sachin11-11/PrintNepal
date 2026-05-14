"use client";

import { useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { ArrowIcon, SearchIcon } from "./Icons";
import {
  deliveryAreas,
  finishingOptions,
  paperOptions,
  categoryImages,
  printCatalog,
  sizeOptions,
  walletOptions,
  type CatalogOption,
  type PrintProduct
} from "@/lib/print-order-catalog";
import { LOCAL_TEMPLATE_CATALOG } from "@/lib/templates/catalog";

type DesignMode = "upload" | "template" | "help";
type FulfillmentMode = "pickup" | "delivery";
type QuantityValue = number | "";

type Receipt = {
  id: string;
  paidWith: string;
  whatsappLink: string;
  createdAt: string;
};

const steps = ["Product", "Specs", "Design", "Fulfillment", "Payment"] as const;

const categoryVisuals: Record<string, { label: string; tone: string }> = {
  All: { label: "ALL", tone: "bg-[var(--solid)] text-[var(--solid-text)]" },
  "Business Stationery": { label: "DOC", tone: "bg-slate-100 text-slate-900" },
  Documents: { label: "TXT", tone: "bg-zinc-100 text-zinc-900" },
  Marketing: { label: "ADS", tone: "bg-amber-100 text-amber-950" },
  Signage: { label: "SGN", tone: "bg-cyan-100 text-cyan-950" },
  Stickers: { label: "STK", tone: "bg-emerald-100 text-emerald-950" },
  Events: { label: "EVT", tone: "bg-rose-100 text-rose-950" },
  Hospitality: { label: "HSP", tone: "bg-orange-100 text-orange-950" },
  Cards: { label: "CRD", tone: "bg-indigo-100 text-indigo-950" },
  "Large Format": { label: "BIG", tone: "bg-stone-200 text-stone-950" },
  Photo: { label: "IMG", tone: "bg-sky-100 text-sky-950" },
  Merchandise: { label: "MRH", tone: "bg-lime-100 text-lime-950" },
  Seasonal: { label: "SEA", tone: "bg-teal-100 text-teal-950" },
  Packaging: { label: "BOX", tone: "bg-neutral-200 text-neutral-950" }
};

type VisualIcon =
  | "all"
  | "card"
  | "document"
  | "paper"
  | "stack"
  | "image"
  | "sticker"
  | "scissors"
  | "fold"
  | "binding"
  | "upload"
  | "template"
  | "design"
  | "shop"
  | "truck"
  | "gps"
  | "wallet"
  | "cash"
  | "size";

type Visual = {
  label?: string;
  tone?: string;
  image?: string;
  icon?: VisualIcon;
};

const sizeVisuals: Record<string, Visual> = {
  a6: { label: "A6", icon: "size", tone: "bg-white text-ink" },
  a5: { label: "A5", icon: "size", tone: "bg-white text-ink" },
  a4: { label: "A4", icon: "document", tone: "bg-white text-ink" },
  a3: { label: "A3", icon: "document", tone: "bg-white text-ink" },
  a2: { label: "A2", icon: "document", tone: "bg-white text-ink" },
  "business-card": { label: "BC", icon: "card", tone: "bg-white text-ink" },
  "id-card": { label: "ID", icon: "card", tone: "bg-blue-100 text-blue-950" },
  letterhead: { label: "LH", icon: "paper", tone: "bg-white text-ink" },
  "dl-envelope": { label: "DL", icon: "document", tone: "bg-amber-100 text-amber-950" },
  custom: { label: "CM", icon: "size", tone: "bg-zinc-100 text-zinc-950" }
};

const paperVisuals: Record<string, Visual> = {
  "80gsm": { label: "80", icon: "paper", tone: "bg-white text-ink" },
  "100gsm": { label: "100", icon: "paper", tone: "bg-neutral-100 text-ink" },
  "130gsm": { label: "130", icon: "stack", tone: "bg-stone-100 text-ink" },
  "170gsm": { label: "170", icon: "stack", tone: "bg-zinc-200 text-ink" },
  "250gsm": { label: "250", icon: "card", tone: "bg-slate-200 text-ink" },
  "300gsm": { label: "300", icon: "card", tone: "bg-slate-300 text-ink" },
  "350gsm": { label: "350", icon: "card", tone: "bg-slate-400 text-white" },
  pvc: { label: "PVC", icon: "card", tone: "bg-blue-100 text-blue-950" },
  "sticker-matte": { label: "MAT", icon: "sticker", tone: "bg-emerald-100 text-emerald-950" },
  "sticker-gloss": { label: "GLS", icon: "sticker", tone: "bg-cyan-100 text-cyan-950" },
  kraft: { label: "KFT", icon: "paper", tone: "bg-amber-200 text-amber-950" },
  linen: { label: "LIN", icon: "paper", tone: "bg-orange-100 text-orange-950" },
  pearl: { label: "PRL", icon: "paper", tone: "bg-violet-100 text-violet-950" }
};

const finishingVisuals: Record<string, Visual> = {
  none: { label: "NO", icon: "paper", tone: "bg-white text-ink" },
  "matte-lamination": { label: "MAT", icon: "stack", tone: "bg-neutral-200 text-ink" },
  "gloss-lamination": { label: "GLS", icon: "stack", tone: "bg-cyan-100 text-cyan-950" },
  "round-corners": { label: "CUT", icon: "scissors", tone: "bg-amber-100 text-amber-950" },
  folding: { label: "FLD", icon: "fold", tone: "bg-slate-100 text-slate-950" },
  binding: { label: "BND", icon: "binding", tone: "bg-indigo-100 text-indigo-950" },
  "die-cut": { label: "DIE", icon: "scissors", tone: "bg-rose-100 text-rose-950" }
};

const designVisuals: Record<DesignMode, Visual> = {
  upload: { label: "UP", icon: "upload", tone: "bg-slate-100 text-slate-950" },
  template: { label: "TMP", icon: "template", tone: "bg-indigo-100 text-indigo-950" },
  help: { label: "DSN", icon: "design", tone: "bg-amber-100 text-amber-950" }
};

const fulfillmentVisuals: Record<FulfillmentMode, Visual> = {
  pickup: { label: "PU", icon: "shop", tone: "bg-emerald-100 text-emerald-950" },
  delivery: { label: "DLV", icon: "truck", tone: "bg-sky-100 text-sky-950" }
};

const deliveryVisuals: Record<string, Visual> = {
  nearby: { label: "1", icon: "gps", tone: "bg-emerald-100 text-emerald-950" },
  "inside-ring-road": { label: "2", icon: "truck", tone: "bg-lime-100 text-lime-950" },
  "outside-ring-road": { label: "3", icon: "truck", tone: "bg-amber-100 text-amber-950" },
  "lalitpur-bhaktapur": { label: "LB", icon: "truck", tone: "bg-orange-100 text-orange-950" },
  courier: { label: "CO", icon: "truck", tone: "bg-slate-100 text-slate-950" }
};

const walletVisuals: Record<string, Visual> = {
  esewa: { label: "eS", icon: "wallet", tone: "bg-green-100 text-green-950" },
  khalti: { label: "KH", icon: "wallet", tone: "bg-violet-100 text-violet-950" },
  imepay: { label: "IME", icon: "wallet", tone: "bg-red-100 text-red-950" },
  connectips: { label: "IPS", icon: "wallet", tone: "bg-blue-100 text-blue-950" },
  cod: { label: "PAY", icon: "cash", tone: "bg-neutral-200 text-neutral-950" }
};

const templateCategoriesByProduct: Record<string, string[]> = {
  "business-card": ["business"],
  "gift-card": ["business"],
  coupon: ["postcard", "flyer", "business"],
  "thank-you-card": ["business"],
  "id-card": ["id-card", "student-id"],
  "membership-card": ["id-card", "student-id"],
  "event-pass": ["id-card", "student-id"],
  "wedding-card": ["wedding"],
  "invitation-card": ["wedding"],
  "birthday-card": ["birthday"],
  "greeting-card": ["birthday"],
  "vinyl-sticker": ["sticker"],
  "label-sticker": ["sticker"],
  "die-cut-sticker": ["sticker"],
  "sticker-sheet": ["sticker"],
  "wall-sticker": ["sticker"],
  "vehicle-sticker": ["sticker"],
  "box-label": ["sticker"],
  "letter-head": ["letterhead"],
  brochure: ["brochure"],
  flyer: ["flyer"],
  poster: ["poster"],
  certificate: ["certificate"],
  booklet: ["booklet"],
  catalog: ["booklet", "brochure"],
  manual: ["booklet"],
  "company-profile": ["booklet", "brochure"],
  "menu-card": ["menu"],
  "table-tent": ["menu"],
  postcard: ["postcard"],
  "door-hanger": ["flyer", "postcard"],
  ticket: ["postcard", "flyer"]
};

function currency(value: number) {
  return `NPR ${Math.round(value).toLocaleString("en-IN")}`;
}

function optionPrice(option: CatalogOption) {
  return option.add ? `+ ${currency(option.add)} each` : "Included";
}

function findOption(options: CatalogOption[], id: string) {
  return options.find((option) => option.id === id) ?? options[0];
}

function allowedOptions(options: CatalogOption[], ids: string[]) {
  return options.filter((option) => ids.includes(option.id));
}

function clampQuantity(value: number, product: PrintProduct) {
  return Math.max(product.minQuantity, Number.isFinite(value) ? value : product.minQuantity);
}

function isValidQuantity(value: number, product: PrintProduct) {
  return Number.isFinite(value) && value >= product.minQuantity;
}

function walletName(id: string) {
  return walletOptions.find((wallet) => wallet.id === id)?.label ?? "Wallet";
}

function templateCategoriesForProduct(product: PrintProduct) {
  const explicit = templateCategoriesByProduct[product.id];
  if (explicit) return explicit;

  const name = product.name.toLowerCase();
  if (name.includes("sticker") || name.includes("label")) return ["sticker"];
  if (name.includes("wedding") || name.includes("invitation")) return ["wedding"];
  if (name.includes("birthday")) return ["birthday"];
  if (name.includes("id card")) return ["id-card", "student-id"];
  if (name.includes("business card")) return ["business"];
  if (name.includes("brochure")) return ["brochure"];
  if (name.includes("flyer") || name.includes("pamphlet")) return ["flyer"];
  if (name.includes("poster")) return ["poster"];
  if (name.includes("certificate")) return ["certificate"];
  if (name.includes("letterhead")) return ["letterhead"];
  if (name.includes("booklet") || name.includes("catalog") || name.includes("manual") || name.includes("profile")) return ["booklet"];
  if (name.includes("menu")) return ["menu"];
  if (name.includes("postcard")) return ["postcard"];
  return [];
}

function Icon({ name }: { name: VisualIcon }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8
  };

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      {name === "card" ? <rect {...common} x="4" y="6" width="16" height="12" /> : null}
      {name === "document" ? <path {...common} d="M7 3h7l3 3v15H7zM14 3v4h4M9 12h6M9 16h6" /> : null}
      {name === "paper" ? <path {...common} d="M6 4h12v16H6zM8 8h8M8 12h8M8 16h5" /> : null}
      {name === "stack" ? <path {...common} d="M5 7h14M5 12h14M5 17h14" /> : null}
      {name === "image" ? <path {...common} d="M4 5h16v14H4zM8 14l3-3 3 3 2-2 3 3M8.5 9h.01" /> : null}
      {name === "sticker" ? <path {...common} d="M6 4h9l3 3v13H6zM15 4v4h4M9 13h6M9 16h4" /> : null}
      {name === "scissors" ? <path {...common} d="M4 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM4 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM8 7l12 10M8 17 20 7" /> : null}
      {name === "fold" ? <path {...common} d="M6 4h12v16H6zM12 4v16M12 12l4-4M12 12l4 4" /> : null}
      {name === "binding" ? <path {...common} d="M7 4h11v16H7zM7 7H4M7 12H4M7 17H4" /> : null}
      {name === "upload" ? <path {...common} d="M12 16V4M8 8l4-4 4 4M5 20h14" /> : null}
      {name === "template" ? <path {...common} d="M4 5h16v14H4zM4 10h16M10 10v9" /> : null}
      {name === "design" ? <path {...common} d="M5 19l4-1 9-9a2.1 2.1 0 0 0-3-3l-9 9zM14 7l3 3" /> : null}
      {name === "shop" ? <path {...common} d="M4 9l2-5h12l2 5M5 9v11h14V9M8 20v-6h4v6M16 20v-4h1" /> : null}
      {name === "truck" ? <path {...common} d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /> : null}
      {name === "gps" ? <path {...common} d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11ZM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /> : null}
      {name === "wallet" ? <path {...common} d="M4 7h15v12H4zM4 7l3-3h10v3M15 13h4" /> : null}
      {name === "cash" ? <path {...common} d="M4 7h16v10H4zM8 12h.01M16 12h.01M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /> : null}
      {name === "size" ? <path {...common} d="M5 19h14M5 19V5M5 5h14M8 16l8-8M11 16h-3v-3M13 8h3v3" /> : null}
      {name === "all" ? <path {...common} d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /> : null}
    </svg>
  );
}

function VisualCue({
  label,
  tone,
  active,
  size = "md",
  image,
  icon
}: Visual & {
  active?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        "flex shrink-0 items-center justify-center overflow-hidden border border-ink/10 font-bold uppercase tracking-[0.08em]",
        size === "sm" ? "h-8 w-8 text-[9px]" : size === "lg" ? "h-14 w-16 text-[11px]" : "h-10 w-10 text-[11px]",
        active ? "bg-[var(--surface)] text-ink" : `${tone ?? "bg-mist text-ink"}`
      ].join(" ")}
    >
      {image ? (
        <span
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : icon ? <Icon name={icon} /> : label}
    </span>
  );
}

function categoryVisual(category: string) {
  const base = categoryVisuals[category] ?? { label: category.slice(0, 3).toUpperCase(), tone: "bg-mist text-ink" };
  return { ...base, image: categoryImages[category], icon: category === "All" ? "all" as const : "document" as const };
}

function productVisual(product: PrintProduct) {
  const visual = categoryVisual(product.category);
  return { ...visual, label: product.name.split(/\s+/).map((word) => word[0]).join("").slice(0, 3).toUpperCase() || visual.label };
}

function OptionButton({
  active,
  label,
  meta,
  visual,
  onClick
}: {
  active: boolean;
  label: string;
  meta?: string;
  visual: Visual;
  onClick: () => void;
}) {
  return (
    <button
      aria-checked={active}
      role="radio"
      className={[
        "group min-h-16 border px-4 py-3 text-left transition",
        active ? "border-[var(--action)] bg-[var(--action-soft)] text-ink" : "border-ink/15 bg-[var(--surface)] text-ink hover:border-[var(--action)] hover:bg-mist"
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={[
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
            active ? "border-[var(--action)] bg-[var(--surface)]" : "border-graphite bg-[var(--surface)]"
          ].join(" ")}
        >
          {active ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--action)]" /> : null}
        </span>
        <VisualCue active={active} icon={visual.icon} image={visual.image} label={visual.label} size="sm" tone={visual.tone} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{label}</span>
          {meta ? <span className={["mt-1 block text-xs", active ? "opacity-75" : "text-graphite"].join(" ")}>{meta}</span> : null}
        </span>
        <span className={["ml-auto shrink-0 text-xs font-bold", active ? "text-[var(--action)]" : "text-graphite"].join(" ")}>
          {active ? "Selected" : "Select"}
        </span>
      </span>
    </button>
  );
}

export function OrderForm({ initialProductId }: { initialProductId?: string }) {
  const initialSelectedProduct = initialProductId
    ? printCatalog.find((item) => item.id === initialProductId)
    : undefined;
  const initialProduct = initialSelectedProduct ?? printCatalog[0];
  const [hasSelectedProduct, setHasSelectedProduct] = useState(Boolean(initialSelectedProduct));
  const [step, setStep] = useState(initialSelectedProduct ? 1 : 0);
  const [query, setQuery] = useState("");
  const [productId, setProductId] = useState(initialProduct.id);
  const product = printCatalog.find((item) => item.id === productId) ?? printCatalog[0];
  const availableSizes = allowedOptions(sizeOptions, product.sizes);
  const availablePapers = allowedOptions(paperOptions, product.paperTypes);
  const [sizeId, setSizeId] = useState("");
  const [paperId, setPaperId] = useState("");
  const [finishingId, setFinishingId] = useState("");
  const [quantity, setQuantity] = useState<QuantityValue>("");
  const [designMode, setDesignMode] = useState<DesignMode | "">("");
  const [fileName, setFileName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [fulfillment, setFulfillment] = useState<FulfillmentMode | "">("");
  const [areaId, setAreaId] = useState("");
  const [location, setLocation] = useState("");
  const [geoLabel, setGeoLabel] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [walletId, setWalletId] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const selectedSize = availableSizes.find((item) => item.id === sizeId);
  const selectedPaper = availablePapers.find((item) => item.id === paperId);
  const selectedFinishing = finishingOptions.find((item) => item.id === finishingId);
  const articleTemplates = useMemo(() => {
    const categories = templateCategoriesForProduct(product);
    return LOCAL_TEMPLATE_CATALOG.filter((template) => template.category && categories.includes(template.category));
  }, [product]);
  const selectedTemplate = articleTemplates.find((template) => template.id === selectedTemplateId);
  const selectedArea = fulfillment === "pickup"
    ? deliveryAreas.find((area) => area.id === "pickup")
    : deliveryAreas.find((area) => area.id === areaId);
  const quantityIsValid = typeof quantity === "number" && isValidQuantity(quantity, product);
  const effectiveQuantity = quantityIsValid ? quantity : 0;
  const designCharge = designMode === "help" ? 750 : designMode === "template" ? 250 : 0;
  const unitPrice = selectedSize && selectedPaper && selectedFinishing
    ? Math.max(1, product.basePrice * (selectedSize.multiplier ?? 1) + (selectedPaper.add ?? 0) + (selectedFinishing.add ?? 0))
    : 0;
  const printSubtotal = unitPrice * effectiveQuantity;
  const deliveryFee = fulfillment === "delivery" && selectedArea ? selectedArea.add ?? 0 : 0;
  const grandTotal = printSubtotal + designCharge + deliveryFee;
  const specsComplete = Boolean(selectedSize && selectedPaper && selectedFinishing);
  const designComplete = Boolean(
    quantityIsValid &&
    designMode &&
    (designMode === "upload" ? fileName : designMode === "template" ? selectedTemplate : true)
  );
  const fulfillmentComplete = Boolean(
    customer.name.trim() &&
    customer.phone.trim() &&
    customer.email.trim() &&
    fulfillment &&
    (fulfillment === "pickup" || (areaId && location.trim()))
  );
  const paymentComplete = Boolean(walletId);
  const canContinue =
    step === 1 ? specsComplete :
    step === 2 ? designComplete :
    step === 3 ? fulfillmentComplete :
    true;
  const canPlaceOrder = specsComplete && designComplete && fulfillmentComplete && paymentComplete;
  const progressPercent = hasSelectedProduct ? Math.min(100, Math.max(0, Math.round((Math.min(step, 4) / 4) * 100))) : 0;
  const currentStepLabel = step < steps.length ? steps[step] : "Receipt";
  const showSearchResults = query.trim().length > 0;

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return printCatalog.filter((item) => {
      const matchesQuery = !normalized || [item.name, item.category, item.id].join(" ").toLowerCase().includes(normalized);
      return matchesQuery;
    });
  }, [query]);

  const visibleProducts = showSearchResults ? filteredProducts.slice(0, 12) : printCatalog;

  function selectProduct(nextProduct: PrintProduct) {
    setProductId(nextProduct.id);
    setSizeId("");
    setPaperId("");
    setQuantity("");
    setFinishingId("");
    setDesignMode("");
    setFileName("");
    setSelectedTemplateId("");
    setFulfillment("");
    setAreaId("");
    setLocation("");
    setGeoLabel("");
    setWalletId("");
    setHasSelectedProduct(true);
    setStep(1);
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
      setGeoLabel(coords);
      setLocation((current) => current || coords);
    });
  }

  function placeOrder() {
    const orderId = `PN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const message = [
      `PrintNepal order ${orderId}`,
      `Product: ${product.name}`,
      `Quantity: ${effectiveQuantity} ${product.unit}`,
      `Total: ${currency(grandTotal)}`,
      `Customer: ${customer.name || "Customer"}`,
      `Phone: ${customer.phone || "Not added"}`
    ].join("\n");
    setReceipt({
      id: orderId,
      paidWith: walletName(walletId),
      whatsappLink: `https://wa.me/9779800000000?text=${encodeURIComponent(message)}`,
      createdAt: new Date().toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" })
    });
    setStep(5);
  }

  const requiredRows = [
    ["Specs", specsComplete],
    ["Artwork", designComplete],
    ["Delivery", fulfillmentComplete],
    ["Payment", paymentComplete]
  ] as const;

  return (
    <div className="overflow-hidden border border-ink/10 bg-[var(--surface)]">
      {hasSelectedProduct ? (
      <div className="bg-mist px-5 py-4 sm:px-6">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-graphite">Step {Math.min(step + 1, steps.length)} of {steps.length}</p>
              <p className="mt-1 text-lg font-black text-ink">{currentStepLabel}</p>
            </div>
            <p className="border border-ink/10 bg-white px-3 py-1 text-xs font-bold text-graphite">{progressPercent}% complete</p>
          </div>
          <div className="order-progress-track h-1.5 overflow-hidden" aria-hidden="true">
            <div className="order-progress-fill h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {steps.map((label, index) => (
            <button
              aria-current={index === step ? "step" : undefined}
              aria-label={`${label} step`}
              className={[
                "flex min-h-9 shrink-0 items-center gap-2 border px-3 text-xs font-bold transition disabled:cursor-not-allowed",
                index === step
                  ? "order-selected"
                  : index < step
                    ? "border-[var(--action)] bg-[var(--action-soft)] text-[var(--action)]"
                    : "border-ink/10 bg-white/70 text-graphite disabled:opacity-45"
              ].join(" ")}
              disabled={index > step}
              key={label}
              onClick={() => setStep(index)}
              type="button"
            >
              <span>{index < step ? "✓" : index + 1}</span>
              <span>{label}</span>
            </button>
          ))}
          </div>
        </div>
      </div>
      ) : null}

      <div className={hasSelectedProduct ? "grid lg:grid-cols-[minmax(0,1fr)_23rem]" : "grid"}>
        <div className="min-h-[36rem] p-5 sm:p-7">
          {hasSelectedProduct && step > 0 && step < 5 ? (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-ink/10 bg-mist p-3">
              <span className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-14 w-16 shrink-0 border border-ink/10 bg-cover bg-center"
                  style={{ backgroundImage: `url(${productVisual(product).image})` }}
                />
                <span className="min-w-0">
                  <span className="block truncate text-base font-black text-ink">{product.name}</span>
                  <span className="mt-1 block text-sm text-graphite">{product.category} · minimum {product.minQuantity} {product.unit}</span>
                </span>
              </span>
              <button className="border border-ink/10 bg-white px-4 py-2 text-sm font-bold text-graphite transition hover:border-[var(--action)] hover:text-ink" onClick={() => setStep(0)} type="button">
                Change
              </button>
            </div>
          ) : null}
          {step === 0 ? (
            <div className="order-step-pane grid gap-6">
              <div className="max-w-2xl">
                <p className="eyebrow">Select product</p>
                <h2 className="mt-3 text-4xl font-black leading-tight text-ink">Start with one print item.</h2>
                <p className="mt-3 text-sm leading-6 text-graphite">
                  Search or choose the exact print article. Selecting an article moves you to specifications.
                </p>
              </div>

              <div className="atelier-input flex min-h-14 items-center gap-3 px-4 transition">
                <SearchIcon />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search letterhead, sticker, ID card, brochure"
                  value={query}
                />
                {query ? (
                  <button className="border border-ink/10 bg-mist px-3 py-1 text-xs font-bold text-graphite" onClick={() => setQuery("")} type="button">
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4">
                <div className="border border-ink/10 bg-mist p-3">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-press">
                      {showSearchResults ? "Search results" : "Print articles"}
                    </p>
                    <p className="text-xs font-semibold text-graphite">{visibleProducts.length} shown</p>
                  </div>
                  <div className="grid gap-2">
                    {visibleProducts.length ? visibleProducts.map((item) => (
                      <button
                        className="group grid gap-3 border border-ink/10 bg-white p-3 text-left transition hover:border-[var(--action)] sm:grid-cols-[1.5rem_4.5rem_minmax(0,1fr)_auto] sm:items-center"
                        key={item.id}
                        onClick={() => selectProduct(item)}
                        type="button"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-graphite bg-[var(--surface)]" aria-hidden="true" />
                        <span
                          aria-hidden="true"
                          className="block aspect-[4/3] border border-ink/10 bg-mist bg-cover bg-center"
                          style={{ backgroundImage: `url(${productVisual(item).image})` }}
                        />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-black text-ink">{item.name}</span>
                            {item.popular ? <span className="border border-emerald-800/20 bg-[var(--sage-soft)] px-2 py-0.5 text-xs font-bold text-emerald-800">Popular</span> : null}
                          </span>
                          <span className="mt-1 block text-sm text-graphite">
                            {item.category} · minimum {item.minQuantity} {item.unit}
                          </span>
                        </span>
                        <span className="flex items-center justify-between gap-3 sm:grid sm:justify-items-end">
                          <span className="text-sm font-black text-ink">{currency(item.basePrice)}</span>
                          <span className="border border-[var(--solid)] bg-[var(--solid)] px-4 py-2 text-xs font-bold text-[var(--solid-text)] transition group-hover:bg-press">
                            Choose
                          </span>
                        </span>
                      </button>
                    )) : (
                      <div className="border border-ink/10 bg-white p-6 text-sm text-graphite">No matching print products.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="order-step-pane grid gap-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-graphite">{product.category}</p>
                <h2 className="mt-3 text-3xl font-semibold text-ink">{product.name} specifications</h2>
              </div>
              <section>
                <h3 className="text-sm font-semibold text-ink">Size</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {availableSizes.map((option) => (
                    <OptionButton
                      active={sizeId === option.id}
                      key={option.id}
                      label={option.label}
                      onClick={() => setSizeId(option.id)}
                      visual={sizeVisuals[option.id] ?? { label: "SZ", icon: "size", tone: "bg-white text-ink" }}
                    />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold text-ink">Paper type</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {availablePapers.map((option) => (
                    <OptionButton
                      active={paperId === option.id}
                      key={option.id}
                      label={option.label}
                      meta={optionPrice(option)}
                      onClick={() => setPaperId(option.id)}
                      visual={paperVisuals[option.id] ?? { label: "PPR", icon: "paper", tone: "bg-mist text-ink" }}
                    />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold text-ink">Finishing</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {finishingOptions.map((option) => (
                    <OptionButton
                      active={finishingId === option.id}
                      key={option.id}
                      label={option.label}
                      meta={optionPrice(option)}
                      onClick={() => setFinishingId(option.id)}
                      visual={finishingVisuals[option.id] ?? { label: "FIN", icon: "stack", tone: "bg-mist text-ink" }}
                    />
                  ))}
                </div>
              </section>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="order-step-pane grid gap-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-graphite">Quantity and artwork</p>
                <h2 className="mt-3 text-3xl font-semibold text-ink">Add count and design file.</h2>
              </div>
              <section>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Quantity</h3>
                    <p className="mt-1 text-sm text-graphite">
                      Admin-set MOQ for {product.name}: {product.minQuantity} {product.unit}
                    </p>
                  </div>
                  <div className="flex items-center border border-ink/10 bg-white">
                    <button className="h-10 w-10 border-r border-ink/10 bg-mist text-lg" onClick={() => setQuantity((value) => clampQuantity((typeof value === "number" ? value : product.minQuantity) - 1, product))} type="button">-</button>
                    <input
                      className="h-10 w-24 bg-transparent text-center text-sm font-semibold outline-none"
                      min={product.minQuantity}
                      onChange={(event) => setQuantity(Number(event.target.value))}
                      step="1"
                      type="number"
                      value={quantity}
                    />
                    <button className="h-10 w-10 border-l border-ink/10 bg-[var(--solid)] text-lg text-[var(--solid-text)]" onClick={() => setQuantity((value) => clampQuantity((typeof value === "number" ? value : product.minQuantity) + 1, product))} type="button">+</button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[product.minQuantity, product.minQuantity * 2, product.minQuantity * 5].map((preset) => (
                    <button
                      className="flex min-h-11 items-center gap-2 border border-ink/10 bg-white px-3 text-sm text-ink transition hover:border-[var(--action)]"
                      key={preset}
                      onClick={() => setQuantity(preset)}
                      type="button"
                    >
                      <VisualCue icon="stack" label={`${preset / product.minQuantity}x`} size="sm" tone="bg-mist text-ink" />
                      <span>{preset} {product.unit}</span>
                    </button>
                  ))}
                </div>
                {!quantityIsValid ? (
                  <p className="mt-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Quantity must be at least the admin-set MOQ of {product.minQuantity} {product.unit}.
                  </p>
                ) : null}
              </section>
              <section>
                <h3 className="text-sm font-semibold text-ink">Design source</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <OptionButton active={designMode === "upload"} label="Upload my design" meta="Included" onClick={() => {
                    setDesignMode("upload");
                    setSelectedTemplateId("");
                  }} visual={designVisuals.upload} />
                  <OptionButton active={designMode === "template"} label="Use template" meta="+ NPR 250" onClick={() => setDesignMode("template")} visual={designVisuals.template} />
                  <OptionButton active={designMode === "help"} label="Need design help" meta="+ NPR 750" onClick={() => {
                    setDesignMode("help");
                    setSelectedTemplateId("");
                  }} visual={designVisuals.help} />
                </div>
                {designMode === "upload" ? (
                  <label className="mt-4 block border border-ink/10 bg-mist px-4 py-5 text-sm text-graphite">
                    <span className="flex items-center gap-3 font-medium text-ink">
                      <VisualCue icon="upload" label="FILE" tone="bg-white text-ink" />
                      <span>Upload file</span>
                    </span>
                    <input
                      accept=".pdf,.png,.jpg,.jpeg,.ai,.psd,.svg"
                      className="mt-3 block w-full text-sm"
                      onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
                      type="file"
                    />
                    {fileName ? <span className="mt-3 block text-ink">{fileName}</span> : null}
                  </label>
                ) : null}
                {designMode === "template" ? (
                  <div className="mt-4 border border-ink/10 bg-mist">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">{product.name} templates</p>
                        <p className="mt-1 text-xs font-semibold text-graphite">{articleTemplates.length} available</p>
                      </div>
                      {selectedTemplate ? (
                        <a className="border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink transition hover:border-[var(--action)]" href={`/customize/${selectedTemplate.slug}`}>
                          Edit selected
                        </a>
                      ) : null}
                    </div>

                    {articleTemplates.length ? (
                      <div className="grid max-h-80 overflow-y-auto">
                        {articleTemplates.map((template) => {
                          const active = selectedTemplateId === template.id;

                          return (
                            <div
                              className={[
                                "grid gap-3 border-b border-ink/10 px-4 py-3 last:border-b-0 sm:grid-cols-[1.25rem_4.5rem_minmax(0,1fr)_auto] sm:items-center",
                                active ? "bg-[var(--action-soft)]" : "bg-white"
                              ].join(" ")}
                              key={template.id}
                            >
                              <span
                                aria-hidden="true"
                                className={[
                                  "mt-1 flex h-5 w-5 items-center justify-center rounded-full border bg-[var(--surface)] sm:mt-0",
                                  active ? "border-[var(--action)]" : "border-graphite"
                                ].join(" ")}
                              >
                                {active ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--action)]" /> : null}
                              </span>
                              <span
                                aria-hidden="true"
                                className="block aspect-[4/3] border border-ink/10 bg-mist bg-cover bg-center"
                                style={{ backgroundImage: template.thumbnail_url ? `url(${template.thumbnail_url})` : undefined }}
                              />
                              <span className="min-w-0">
                                <span className="block text-sm font-black text-ink">{template.title}</span>
                                <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.08em] text-graphite">
                                  {template.category ?? "Template"}
                                </span>
                              </span>
                              <span className="flex flex-wrap gap-2">
                                <button
                                  className="border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink transition hover:border-[var(--action)]"
                                  onClick={() => setSelectedTemplateId(template.id)}
                                  type="button"
                                >
                                  {active ? "Selected" : "Choose"}
                                </button>
                                <a
                                  className="border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink transition hover:border-[var(--action)]"
                                  href={`/customize/${template.slug}`}
                                >
                                  Edit
                                </a>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-5 text-sm font-semibold text-graphite">
                        No templates are available for {product.name} yet.
                      </div>
                    )}
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="order-step-pane grid gap-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-graphite">Customer and fulfillment</p>
                <h2 className="mt-3 text-3xl font-semibold text-ink">Pickup or delivery?</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Name
                  <input className="atelier-input min-h-12 px-4 outline-none" onChange={(event) => setCustomer((value) => ({ ...value, name: event.target.value }))} placeholder="Customer name" value={customer.name} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Phone
                  <input className="atelier-input min-h-12 px-4 outline-none" onChange={(event) => setCustomer((value) => ({ ...value, phone: event.target.value }))} placeholder="+977" value={customer.phone} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Email
                  <input className="atelier-input min-h-12 px-4 outline-none" onChange={(event) => setCustomer((value) => ({ ...value, email: event.target.value }))} placeholder="Optional" type="email" value={customer.email} />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <OptionButton active={fulfillment === "pickup"} label="Pickup in person" meta="No delivery charge" onClick={() => setFulfillment("pickup")} visual={fulfillmentVisuals.pickup} />
                <OptionButton active={fulfillment === "delivery"} label="Delivery" meta="Location required" onClick={() => setFulfillment("delivery")} visual={fulfillmentVisuals.delivery} />
              </div>
              {fulfillment === "delivery" ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {deliveryAreas.filter((area) => area.id !== "pickup").map((area) => (
                      <OptionButton
                        active={areaId === area.id}
                        key={area.id}
                        label={area.label}
                        meta={currency(area.add ?? 0)}
                        onClick={() => setAreaId(area.id)}
                        visual={deliveryVisuals[area.id] ?? { label: "DLV", icon: "truck", tone: "bg-mist text-ink" }}
                      />
                    ))}
                  </div>
                  <label className="grid gap-2 text-sm font-medium text-ink">
                    Delivery location
                    <textarea
                      className="atelier-input min-h-28 p-4 outline-none"
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Street, landmark, city"
                      value={location}
                    />
                  </label>
                  <button className="flex min-h-11 w-fit items-center gap-3 border border-ink/10 bg-white px-4 text-sm font-medium text-ink hover:border-[var(--action)]" onClick={useMyLocation} type="button">
                    <VisualCue icon="gps" label="GPS" size="sm" tone="bg-sky-100 text-sky-950" />
                    <span>Use current location</span>
                  </button>
                  {geoLabel ? <p className="text-sm text-graphite">Location captured: {geoLabel}</p> : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="order-step-pane grid gap-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-graphite">Payment</p>
                <h2 className="mt-3 text-3xl font-semibold text-ink">Choose payment method.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {walletOptions.map((wallet) => (
                  <OptionButton
                    active={walletId === wallet.id}
                    key={wallet.id}
                    label={wallet.label}
                    meta={wallet.note}
                    onClick={() => setWalletId(wallet.id)}
                    visual={walletVisuals[wallet.id] ?? { label: "PAY", icon: "wallet", tone: "bg-mist text-ink" }}
                  />
                ))}
              </div>
              <div className="border border-ink/10 bg-mist p-4">
                <p className="text-sm font-semibold text-ink">Amount payable</p>
                <p className="mt-2 text-4xl font-semibold text-ink">{currency(grandTotal)}</p>
                <p className="mt-2 text-sm text-graphite">Demo payment creates a receipt immediately.</p>
              </div>
            </div>
          ) : null}

          {step === 5 && receipt ? (
            <div className="order-step-pane grid gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-graphite">Receipt</p>
                <h2 className="mt-3 text-3xl font-semibold text-ink">Order placed.</h2>
              </div>
              <div className="grid gap-4 border border-ink/10 bg-mist p-5">
                <div className="grid gap-1">
                  <span className="text-xs uppercase tracking-[0.08em] text-graphite">Order ID</span>
                  <span className="font-mono text-lg font-semibold text-ink">{receipt.id}</span>
                </div>
                <div className="grid gap-2 text-sm text-graphite sm:grid-cols-2">
                  <span>Paid with {receipt.paidWith}</span>
                  <span>{receipt.createdAt}</span>
                  <span>{product.name}</span>
                  <span>{currency(grandTotal)}</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
                <div className="w-fit border border-ink/10 bg-white p-3">
                  <QRCode size={128} value={receipt.whatsappLink} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink">WhatsApp contact</h3>
                  <p className="mt-2 text-sm leading-6 text-graphite">Scan the QR or open WhatsApp to continue with file checks, delivery updates, and production confirmation.</p>
                  <a className="link-block mt-4" href={receipt.whatsappLink} rel="noreferrer" target="_blank">
                    Open WhatsApp
                  </a>
                </div>
              </div>
              <button className="min-h-12 w-fit border border-ink/10 bg-white px-6 text-sm font-medium text-ink hover:border-[var(--action)]" onClick={() => {
                setReceipt(null);
                setHasSelectedProduct(false);
                setStep(0);
              }} type="button">
                Start another order
              </button>
            </div>
          ) : null}
        </div>

        {hasSelectedProduct ? (
        <aside className="border-l border-ink/10 bg-mist p-5 sm:p-6">
          <div className="sticky top-24 grid gap-0 border border-ink/10 bg-white">
            <div className="border-b border-ink/10 p-5">
              <p className="eyebrow">Live quote</p>
              <h2 className="mt-3 text-4xl font-black text-press">{currency(grandTotal)}</h2>
              <p className="mt-2 text-sm text-graphite">{grandTotal > 0 ? `${currency(unitPrice)} per ${product.unit}` : "Complete required details to calculate."}</p>
            </div>

            <div className="border-b border-ink/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-graphite">Product</p>
              <p className="mt-3 text-base font-black text-ink">{product.name}</p>
              <p className="mt-1 text-sm text-graphite">{product.category}</p>
              <button className="mt-4 border border-ink/10 bg-mist px-4 py-2 text-sm font-bold text-graphite transition hover:border-[var(--action)] hover:text-ink" onClick={() => setStep(0)} type="button">
                Change product
              </button>
            </div>

            <div className="border-b border-ink/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-graphite">Required fields</p>
              <div className="mt-3 grid gap-2">
                {requiredRows.map(([label, done]) => (
                  <div className="flex items-center justify-between gap-3 border border-ink/10 bg-mist px-3 py-2 text-sm" key={label}>
                    <span className="font-medium text-ink">{label}</span>
                    <span className={["border px-2 py-1 text-xs font-bold", done ? "border-emerald-800/20 bg-[var(--sage-soft)] text-emerald-800" : "border-ink/10 bg-white text-graphite"].join(" ")}>
                      {done ? "Done" : "Needed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b border-ink/10 p-4 text-sm">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-graphite">Receipt</p>
              <div className="mt-3 grid gap-2">
                <div className="flex justify-between gap-3">
                  <span className="text-graphite">Print</span>
                  <span className="font-medium text-ink">{currency(printSubtotal)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-graphite">Design</span>
                  <span className="font-medium text-ink">{currency(designCharge)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-graphite">Delivery</span>
                  <span className="font-medium text-ink">{currency(deliveryFee)}</span>
                </div>
              </div>
            </div>
            {step < 5 ? (
              <div className="flex gap-3 p-4">
                <button
                  className="min-h-12 flex-1 border border-ink/10 bg-white px-5 text-sm font-medium text-ink disabled:opacity-40"
                  disabled={step === 0}
                  onClick={() => setStep((value) => Math.max(0, value - 1))}
                  type="button"
                >
                  Back
                </button>
                {step < 4 ? (
                  <button
                    className="link-block flex-1 justify-center disabled:opacity-40"
                    disabled={!canContinue}
                    onClick={() => setStep((value) => Math.min(4, value + 1))}
                    type="button"
                  >
                    Continue <ArrowIcon />
                  </button>
                ) : (
                  <button
                    className="link-block flex-1 justify-center disabled:opacity-40"
                    disabled={!canPlaceOrder}
                    onClick={placeOrder}
                    type="button"
                  >
                    Pay and place order
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </aside>
        ) : null}
      </div>
    </div>
  );
}
