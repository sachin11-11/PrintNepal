import { LOCAL_TEMPLATE_CATALOG } from "./catalog";

export const TEMPLATE_CATEGORY_ORDER = ["id-card"] as const;

export const TEMPLATE_CATEGORY_LABELS: Record<(typeof TEMPLATE_CATEGORY_ORDER)[number], string> = {
  "id-card": "ID cards"
};

export function getTemplateCategoryGroups() {
  return TEMPLATE_CATEGORY_ORDER.map((category) => ({
    category,
    label: TEMPLATE_CATEGORY_LABELS[category],
    templates: LOCAL_TEMPLATE_CATALOG.filter((template) => template.category === category)
  })).filter((group) => group.templates.length > 0);
}

export function getTemplateCategory(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  return TEMPLATE_CATEGORY_ORDER.find((category) => category === normalized) ?? null;
}
