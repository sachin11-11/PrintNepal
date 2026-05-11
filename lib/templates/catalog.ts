import { WEDDING_CARD_TEMPLATE, WEDDING_CARD_TEMPLATE_ID } from "./wedding-card-template";
import { WEDDING_CARD_2, WEDDING_CARD_3 } from "./wedding-card-variants";
import { STUDENT_ID_CARD_TEMPLATE, STUDENT_ID_CARD_TEMPLATE_ID } from "./student-id-card-template";
import { STUDENT_ID_1, STUDENT_ID_2, STUDENT_ID_3 } from "./student-id-card-variants";
import { BUSINESS_CARD_1, BUSINESS_CARD_2, BUSINESS_CARD_3 } from "./business-card-templates";
import { BIRTHDAY_CARD_1, BIRTHDAY_CARD_2, BIRTHDAY_CARD_3 } from "./birthday-card-variants";
import { LAPTOP_SKIN_1, LAPTOP_SKIN_2, LAPTOP_SKIN_3 } from "./laptop-skin-variants";
import { STICKER_1, STICKER_2, STICKER_3 } from "./sticker-variants";
import type { ProductTemplateWithService } from "@/lib/supabase/queries";

export const LOCAL_TEMPLATE_CATALOG: ProductTemplateWithService[] = [
  WEDDING_CARD_TEMPLATE,
  WEDDING_CARD_2,
  WEDDING_CARD_3,
  STUDENT_ID_CARD_TEMPLATE,
  STUDENT_ID_1,
  STUDENT_ID_2,
  STUDENT_ID_3,
  BUSINESS_CARD_1,
  BUSINESS_CARD_2,
  BUSINESS_CARD_3,
  BIRTHDAY_CARD_1,
  BIRTHDAY_CARD_2,
  BIRTHDAY_CARD_3,
  LAPTOP_SKIN_1,
  LAPTOP_SKIN_2,
  LAPTOP_SKIN_3,
  STICKER_1,
  STICKER_2,
  STICKER_3
];

const categoryAliases = {
  wedding: "wedding card wedding invitation marriage invitation invite bridal ceremony",
  "id-card": "id card student id card identity card student identity card school card",
  "student-id": "student id card student identity card id card school card identity",
  business: "business card visiting card professional card corporate card",
  birthday: "birthday card birthday invitation party invite celebration",
  sticker: "sticker label sticker badge decal vinyl",
  "laptop-skin": "laptop skin laptop wrapper skin cover laptop sticker"
} as const;

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getSearchText(template: ProductTemplateWithService) {
  return [
    template.id,
    template.slug,
    template.title,
    template.category,
    template.services?.title,
    template.category ? categoryAliases[template.category as keyof typeof categoryAliases] ?? "" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function scoreTemplateMatch(template: ProductTemplateWithService, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 1;

  const title = normalizeSearchText(template.title);
  const slug = normalizeSearchText(template.slug);
  const category = normalizeSearchText(template.category ?? "");
  const service = normalizeSearchText(template.services?.title ?? "");
  const haystack = normalizeSearchText(getSearchText(template));
  const queryTerms = normalizedQuery.split(" ").filter(Boolean);

  let score = 0;

  if (title === normalizedQuery) score += 120;
  if (slug === normalizedQuery) score += 105;
  if (category === normalizedQuery) score += 90;

  if (title.startsWith(normalizedQuery)) score += 80;
  if (slug.startsWith(normalizedQuery)) score += 65;
  if (category.startsWith(normalizedQuery)) score += 55;
  if (service.startsWith(normalizedQuery)) score += 45;

  if (title.includes(normalizedQuery)) score += 40;
  if (slug.includes(normalizedQuery)) score += 30;
  if (service.includes(normalizedQuery)) score += 25;
  if (haystack.includes(normalizedQuery)) score += 20;

  for (const term of queryTerms) {
    if (title.split(" ").some((word) => word.startsWith(term))) score += 18;
    if (slug.split(" ").some((word) => word.startsWith(term))) score += 14;
    if (category.split(" ").some((word) => word.startsWith(term))) score += 12;
    if (haystack.split(" ").some((word) => word.startsWith(term))) score += 8;
    if (haystack.includes(term)) score += 4;
  }

  const allTermsMatch = queryTerms.every((term) => haystack.includes(term));
  return allTermsMatch ? score : 0;
}

export function getLocalTemplateByIdentifier(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  return (
    LOCAL_TEMPLATE_CATALOG.find(
      (template) =>
        template.id.toLowerCase() === normalized ||
        template.slug.toLowerCase() === normalized ||
        template.title.toLowerCase() === normalized
    ) ?? null
  );
}

export function getRankedLocalTemplateMatches(query: string) {
  const normalized = query.trim();
  if (!normalized) return LOCAL_TEMPLATE_CATALOG;

  return LOCAL_TEMPLATE_CATALOG.map((template, index) => ({
    template,
    index,
    score: scoreTemplateMatch(template, normalized)
  }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.template);
}

export function searchLocalTemplates(query: string) {
  return getRankedLocalTemplateMatches(query);
}

export {
  WEDDING_CARD_TEMPLATE,
  WEDDING_CARD_TEMPLATE_ID,
  STUDENT_ID_CARD_TEMPLATE,
  STUDENT_ID_CARD_TEMPLATE_ID,
  STUDENT_ID_1,
  STUDENT_ID_2,
  STUDENT_ID_3,
  BUSINESS_CARD_1,
  BUSINESS_CARD_2,
  BUSINESS_CARD_3,
  BIRTHDAY_CARD_1,
  BIRTHDAY_CARD_2,
  BIRTHDAY_CARD_3,
  LAPTOP_SKIN_1,
  LAPTOP_SKIN_2,
  LAPTOP_SKIN_3,
  STICKER_1,
  STICKER_2,
  STICKER_3
};
