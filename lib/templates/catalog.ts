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

export function searchLocalTemplates(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return LOCAL_TEMPLATE_CATALOG;

  const categoryAliases = {
    wedding: "wedding card wedding invitation marriage invitation",
    "id-card": "id card student id card identity card student identity card",
    "student-id": "student id card student identity card id card",
    business: "business card visiting card",
    birthday: "birthday card birthday invitation",
    sticker: "sticker label sticker badge",
    "laptop-skin": "laptop skin laptop wrapper skin cover"
  } as const;

  return LOCAL_TEMPLATE_CATALOG.filter((template) => {
    const haystack = [
      template.id,
      template.slug,
      template.title,
      template.category,
      template.services?.title,
      template.category ? categoryAliases[template.category as keyof typeof categoryAliases] ?? "" : ""
    ]
    .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
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
