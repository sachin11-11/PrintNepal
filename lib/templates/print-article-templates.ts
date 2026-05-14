import type { ProductTemplateWithService } from "@/lib/supabase/queries";

type LayerValue = string | number | boolean | null;
type TemplateLayer = Record<string, LayerValue>;

const TEMPLATE_DATE = "2026-05-12T00:00:00.000Z";
const SANS = "'Trebuchet MS', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

function rect(id: string, x: number, y: number, w: number, h: number, fill: string, opacity = 1): TemplateLayer {
  return { id, type: "rect", name: id, x, y, w, h, fill, stroke: null, strokeWidth: 0, opacity, locked: false, visible: true, rotation: 0 };
}

function line(id: string, x: number, y: number, w: number, fill: string, opacity = 1): TemplateLayer {
  return { id, type: "rect", name: id, x, y, w, h: 2, fill, stroke: null, strokeWidth: 0, opacity, locked: false, visible: true, rotation: 0 };
}

function circle(id: string, x: number, y: number, w: number, h: number, fill: string, opacity = 1): TemplateLayer {
  return { id, type: "ellipse", name: id, x, y, w, h, fill, stroke: null, strokeWidth: 0, opacity, locked: false, visible: true, rotation: 0 };
}

function text(
  field: string,
  value: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  fill: string,
  options: { weight?: string; family?: string; align?: "left" | "center" | "right"; height?: number; letterSpacing?: number } = {}
): TemplateLayer {
  return {
    id: field,
    field,
    type: "text",
    name: field,
    x,
    y,
    w: width,
    h: options.height ?? Math.max(28, fontSize * 1.5),
    text: value,
    fontSize,
    fontFamily: options.family ?? SANS,
    fontWeight: options.weight ?? "normal",
    fontStyle: "normal",
    fill,
    textAlign: options.align ?? "left",
    letterSpacing: options.letterSpacing ?? 0,
    opacity: 1,
    locked: false,
    visible: true,
    rotation: 0,
    editable: true
  };
}

function image(field: string, x: number, y: number, w: number, h: number): TemplateLayer {
  return { id: field, field, type: "image", name: field, x, y, w, h, src: null, placeholder: true, clipShape: "rect", opacity: 1, locked: false, visible: true, rotation: 0, editable: true };
}

function makeTemplate(config: {
  id: string;
  title: string;
  category: string;
  width: number;
  height: number;
  background: string;
  accent: string;
  fields: string[];
  layers: TemplateLayer[];
  featured?: boolean;
}): ProductTemplateWithService {
  return {
    id: config.id,
    service_id: null,
    title: config.title,
    slug: config.id,
    category: config.category,
    thumbnail_url: null,
    editable_fields: config.fields,
    is_featured: config.featured ?? false,
    created_at: TEMPLATE_DATE,
    updated_at: TEMPLATE_DATE,
    services: null,
    template_json: {
      width: config.width,
      height: config.height,
      background: config.background,
      accent: config.accent,
      layers: [
        { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: config.width, h: config.height, fill: config.background, stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
        ...config.layers
      ]
    }
  };
}

export const BROCHURE_TRIFOLD_SERVICE = makeTemplate({
  id: "brochure-trifold-service",
  title: "Brochure - Tri Fold Service",
  category: "brochure",
  width: 900,
  height: 420,
  background: "#ffffff",
  accent: "#1677ff",
  fields: ["headline", "subheadline", "panel_1", "panel_2", "panel_3", "phone", "website", "logo"],
  featured: true,
  layers: [
    rect("left-panel", 0, 0, 300, 420, "#eef5ff"),
    rect("center-panel", 300, 0, 300, 420, "#ffffff"),
    rect("right-panel", 600, 0, 300, 420, "#f7fafc"),
    rect("accent-bar", 0, 0, 900, 10, "#1677ff"),
    image("logo", 34, 34, 76, 76),
    text("headline", "Premium Printing For Your Brand", 34, 136, 250, 34, "#102033", { weight: "bold" }),
    text("subheadline", "Fast local service with sharp color and reliable finishing.", 34, 186, 238, 18, "#4b5b6b", { height: 80 }),
    text("panel_1", "Design\nPrint\nDeliver", 334, 54, 230, 30, "#111827", { weight: "bold", height: 126 }),
    text("panel_2", "Business stationery, marketing prints, packaging inserts, and event materials.", 334, 200, 230, 18, "#4b5563", { height: 104 }),
    text("panel_3", "Visit us for same-day print support in Kathmandu.", 634, 72, 220, 22, "#111827", { weight: "bold", height: 92 }),
    line("contact-line", 634, 274, 200, "#1677ff"),
    text("phone", "+977-9748808237", 634, 296, 200, 18, "#102033"),
    text("website", "printnepal.com", 634, 328, 200, 18, "#102033")
  ]
});

export const BROCHURE_REAL_ESTATE = makeTemplate({
  id: "brochure-real-estate",
  title: "Brochure - Real Estate Listing",
  category: "brochure",
  width: 900,
  height: 420,
  background: "#f8fafc",
  accent: "#0f766e",
  fields: ["headline", "subheadline", "location", "feature_1", "feature_2", "feature_3", "phone", "hero_image"],
  layers: [
    image("hero_image", 0, 0, 450, 420),
    rect("right", 450, 0, 450, 420, "#f8fafc"),
    text("headline", "Modern Family Residence", 490, 50, 330, 38, "#102033", { weight: "bold", family: SERIF, height: 90 }),
    text("subheadline", "Bright interiors, premium finishing, and a quiet neighborhood close to city essentials.", 490, 154, 330, 20, "#425466", { height: 72 }),
    text("location", "Bhaisepati, Lalitpur", 490, 244, 330, 18, "#0f766e", { weight: "bold" }),
    text("feature_1", "4 Bedrooms", 490, 286, 140, 18, "#102033"),
    text("feature_2", "3 Bathrooms", 650, 286, 140, 18, "#102033"),
    text("feature_3", "2 Parking", 490, 322, 140, 18, "#102033"),
    text("phone", "Call: +977-9800000000", 490, 366, 270, 18, "#102033", { weight: "bold" })
  ]
});

export const BROCHURE_CLINIC = makeTemplate({
  id: "brochure-clinic-care",
  title: "Brochure - Clinic Care",
  category: "brochure",
  width: 900,
  height: 420,
  background: "#ffffff",
  accent: "#14b8a6",
  fields: ["clinic_name", "headline", "service_1", "service_2", "service_3", "address", "phone", "logo"],
  layers: [
    rect("teal-band", 0, 0, 900, 92, "#dff8f4"),
    circle("soft-circle", 702, -64, 220, 220, "#14b8a6", 0.18),
    image("logo", 32, 22, 54, 54),
    text("clinic_name", "CityCare Clinic", 104, 28, 300, 24, "#0f172a", { weight: "bold" }),
    text("headline", "Complete Family Health Services", 48, 132, 350, 40, "#0f172a", { weight: "bold", family: SERIF, height: 96 }),
    text("service_1", "General Consultation", 492, 130, 280, 22, "#0f172a", { weight: "bold" }),
    text("service_2", "Lab Tests And Diagnostics", 492, 184, 280, 22, "#0f172a", { weight: "bold" }),
    text("service_3", "Vaccination And Follow-Up", 492, 238, 280, 22, "#0f172a", { weight: "bold" }),
    line("clinic-line", 48, 302, 350, "#14b8a6"),
    text("address", "Putalisadak, Kathmandu", 48, 326, 300, 18, "#475569"),
    text("phone", "+977-9800000000", 48, 356, 300, 18, "#475569")
  ]
});

export const FLYER_SALE_BOLD = makeTemplate({
  id: "flyer-sale-bold",
  title: "Flyer - Retail Sale",
  category: "flyer",
  width: 420,
  height: 600,
  background: "#fff7ed",
  accent: "#ea580c",
  fields: ["headline", "discount", "details", "date", "address", "logo"],
  featured: true,
  layers: [
    rect("top", 0, 0, 420, 188, "#ea580c"),
    circle("badge", 245, 118, 130, 130, "#111827"),
    image("logo", 26, 28, 62, 62),
    text("headline", "Mega Weekend Sale", 28, 216, 350, 42, "#111827", { weight: "bold", height: 100 }),
    text("discount", "40% OFF", 266, 158, 90, 30, "#ffffff", { weight: "bold", align: "center", height: 52 }),
    text("details", "Fresh arrivals, gifts, packaging, stationery and more.", 30, 332, 340, 21, "#475569", { height: 88 }),
    text("date", "Friday - Sunday", 30, 450, 260, 23, "#ea580c", { weight: "bold" }),
    text("address", "New Road, Kathmandu", 30, 500, 300, 18, "#111827")
  ]
});

export const FLYER_COMMUNITY_EVENT = makeTemplate({
  id: "flyer-community-event",
  title: "Flyer - Community Event",
  category: "flyer",
  width: 420,
  height: 600,
  background: "#f8fafc",
  accent: "#2563eb",
  fields: ["event_name", "headline", "date", "time", "venue", "contact", "hero_image"],
  layers: [
    image("hero_image", 0, 0, 420, 236),
    rect("title-band", 0, 216, 420, 146, "#2563eb"),
    text("event_name", "Kathmandu Design Meetup", 30, 246, 342, 34, "#ffffff", { weight: "bold", height: 78 }),
    text("headline", "Talks, workshops and local creative networking.", 30, 378, 342, 20, "#1f2937", { height: 76 }),
    text("date", "May 24, 2026", 30, 468, 160, 20, "#2563eb", { weight: "bold" }),
    text("time", "2:00 PM", 222, 468, 120, 20, "#2563eb", { weight: "bold" }),
    text("venue", "Lazimpat, Kathmandu", 30, 514, 270, 18, "#111827"),
    text("contact", "Register: hello@example.com", 30, 544, 310, 16, "#475569")
  ]
});

export const POSTER_CONCERT_NIGHT = makeTemplate({
  id: "poster-concert-night",
  title: "Poster - Concert Night",
  category: "poster",
  width: 500,
  height: 700,
  background: "#111827",
  accent: "#f59e0b",
  fields: ["headline", "artist", "date", "venue", "ticket_note", "hero_image"],
  layers: [
    image("hero_image", 40, 54, 420, 270),
    line("poster-line", 40, 360, 420, "#f59e0b", 1),
    text("headline", "Live Music Night", 40, 392, 420, 46, "#ffffff", { weight: "bold", family: SERIF, align: "center", height: 86 }),
    text("artist", "Featuring The Valley Band", 60, 494, 380, 22, "#f59e0b", { align: "center", weight: "bold" }),
    text("date", "Saturday, June 6", 70, 552, 360, 22, "#ffffff", { align: "center" }),
    text("venue", "Thamel House, Kathmandu", 70, 590, 360, 18, "#cbd5e1", { align: "center" }),
    text("ticket_note", "Tickets at the gate", 70, 642, 360, 17, "#cbd5e1", { align: "center" })
  ]
});

export const POSTER_PRODUCT_LAUNCH = makeTemplate({
  id: "poster-product-launch",
  title: "Poster - Product Launch",
  category: "poster",
  width: 500,
  height: 700,
  background: "#ffffff",
  accent: "#7c3aed",
  fields: ["brand", "headline", "details", "date", "website", "product_image"],
  layers: [
    circle("violet-circle", 278, -88, 330, 330, "#ede9fe"),
    image("product_image", 72, 94, 356, 250),
    text("brand", "AURA TECH", 48, 396, 240, 18, "#7c3aed", { weight: "bold", letterSpacing: 2 }),
    text("headline", "New Product Launch", 48, 430, 380, 44, "#111827", { weight: "bold", height: 96 }),
    text("details", "Join us for live demos, launch pricing and product consultation.", 48, 542, 370, 20, "#4b5563", { height: 76 }),
    text("date", "June 15, 2026", 48, 626, 210, 20, "#111827", { weight: "bold" }),
    text("website", "auratech.example", 284, 626, 170, 18, "#7c3aed")
  ]
});

export const CERTIFICATE_ACHIEVEMENT_GOLD = makeTemplate({
  id: "certificate-achievement-gold",
  title: "Certificate - Achievement Gold",
  category: "certificate",
  width: 842,
  height: 595,
  background: "#fffdf7",
  accent: "#b8860b",
  fields: ["recipient_name", "certificate_title", "body", "date", "issuer", "signature"],
  featured: true,
  layers: [
    rect("border-outer", 24, 24, 794, 547, "rgba(184,134,11,0.08)"),
    rect("border-top", 42, 42, 758, 4, "#b8860b"),
    rect("border-bottom", 42, 548, 758, 4, "#b8860b"),
    text("certificate_title", "Certificate Of Achievement", 96, 90, 650, 36, "#1f2937", { weight: "bold", family: SERIF, align: "center", height: 60 }),
    text("body", "This certificate is proudly presented to", 160, 178, 520, 22, "#475569", { align: "center" }),
    text("recipient_name", "Recipient Name", 126, 232, 590, 44, "#b8860b", { weight: "bold", family: SERIF, align: "center", height: 80 }),
    text("issuer", "PrintNepal Training Center", 130, 420, 260, 20, "#111827", { align: "center" }),
    line("issuer-line", 130, 398, 260, "#111827", 0.6),
    text("date", "May 12, 2026", 460, 420, 230, 20, "#111827", { align: "center" }),
    line("date-line", 460, 398, 230, "#111827", 0.6),
    text("signature", "Authorized Signature", 130, 458, 260, 16, "#64748b", { align: "center" })
  ]
});

export const CERTIFICATE_TRAINING_CLEAN = makeTemplate({
  id: "certificate-training-clean",
  title: "Certificate - Training Clean",
  category: "certificate",
  width: 842,
  height: 595,
  background: "#f8fafc",
  accent: "#0f766e",
  fields: ["recipient_name", "course_name", "body", "date", "organization", "signature"],
  layers: [
    rect("left-accent", 0, 0, 84, 595, "#0f766e"),
    circle("seal", 646, 82, 92, 92, "#ccfbf1"),
    text("course_name", "Training Completion Certificate", 132, 98, 520, 36, "#0f172a", { weight: "bold", family: SERIF, height: 70 }),
    text("body", "Awarded for successful completion of the workshop to", 132, 194, 520, 21, "#475569"),
    text("recipient_name", "Recipient Name", 132, 250, 560, 46, "#0f766e", { weight: "bold", family: SERIF, height: 76 }),
    text("organization", "Issued by PrintNepal Academy", 132, 390, 300, 20, "#0f172a"),
    text("date", "Date: May 12, 2026", 132, 430, 260, 18, "#475569"),
    line("sig-line", 520, 432, 210, "#0f172a", 0.7),
    text("signature", "Signature", 520, 452, 210, 16, "#64748b", { align: "center" })
  ]
});

export const LETTERHEAD_CORPORATE_BLUE = makeTemplate({
  id: "letterhead-corporate-blue",
  title: "Letterhead - Corporate Blue",
  category: "letterhead",
  width: 595,
  height: 842,
  background: "#ffffff",
  accent: "#1d4ed8",
  fields: ["company", "tagline", "address", "phone", "email", "website", "logo"],
  layers: [
    rect("top-band", 0, 0, 595, 92, "#eff6ff"),
    rect("footer-band", 0, 794, 595, 48, "#1d4ed8"),
    image("logo", 42, 24, 52, 52),
    text("company", "Company Name Pvt. Ltd.", 112, 24, 320, 25, "#0f172a", { weight: "bold" }),
    text("tagline", "Professional printing and branding partner", 112, 56, 330, 14, "#475569"),
    line("body-line", 42, 132, 512, "#1d4ed8", 0.8),
    text("address", "Kathmandu, Nepal", 42, 808, 170, 13, "#ffffff"),
    text("phone", "+977-9800000000", 236, 808, 135, 13, "#ffffff"),
    text("email", "hello@example.com", 394, 808, 150, 13, "#ffffff"),
    text("website", "example.com", 430, 58, 120, 13, "#1d4ed8", { align: "right" })
  ]
});

export const LETTERHEAD_MINIMAL_GREEN = makeTemplate({
  id: "letterhead-minimal-green",
  title: "Letterhead - Minimal Green",
  category: "letterhead",
  width: 595,
  height: 842,
  background: "#ffffff",
  accent: "#15803d",
  fields: ["company", "tagline", "address", "phone", "email", "logo"],
  layers: [
    image("logo", 44, 44, 58, 58),
    text("company", "Evergreen Consulting", 122, 48, 310, 24, "#111827", { weight: "bold" }),
    text("tagline", "Strategy, finance and compliance", 122, 78, 300, 14, "#64748b"),
    line("top-rule", 44, 128, 508, "#15803d"),
    line("footer-rule", 44, 768, 508, "#15803d"),
    text("address", "Lazimpat, Kathmandu", 44, 790, 160, 13, "#475569"),
    text("phone", "+977-9800000000", 224, 790, 140, 13, "#475569"),
    text("email", "hello@example.com", 386, 790, 160, 13, "#475569")
  ]
});

export const BOOKLET_COMPANY_PROFILE = makeTemplate({
  id: "booklet-company-profile",
  title: "Booklet - Company Profile Cover",
  category: "booklet",
  width: 595,
  height: 842,
  background: "#f8fafc",
  accent: "#0f172a",
  fields: ["company", "headline", "year", "website", "cover_image", "logo"],
  featured: true,
  layers: [
    image("cover_image", 0, 0, 595, 472),
    rect("bottom", 0, 472, 595, 370, "#0f172a"),
    image("logo", 48, 520, 60, 60),
    text("company", "Company Name", 126, 530, 300, 24, "#ffffff", { weight: "bold" }),
    text("headline", "Company Profile", 48, 630, 440, 52, "#ffffff", { weight: "bold", family: SERIF, height: 96 }),
    text("year", "2026", 48, 744, 120, 22, "#93c5fd", { weight: "bold" }),
    text("website", "example.com", 338, 746, 170, 18, "#cbd5e1", { align: "right" })
  ]
});

export const BOOKLET_TRAINING_MANUAL = makeTemplate({
  id: "booklet-training-manual",
  title: "Booklet - Training Manual Cover",
  category: "booklet",
  width: 595,
  height: 842,
  background: "#ffffff",
  accent: "#dc2626",
  fields: ["headline", "module", "department", "date", "cover_image", "logo"],
  layers: [
    rect("red-block", 0, 0, 595, 230, "#dc2626"),
    image("cover_image", 54, 278, 486, 300),
    image("logo", 48, 44, 62, 62),
    text("headline", "Training Manual", 48, 128, 380, 46, "#ffffff", { weight: "bold", height: 82 }),
    text("module", "Customer Service Basics", 54, 622, 410, 30, "#111827", { weight: "bold", family: SERIF, height: 58 }),
    text("department", "Operations Department", 54, 692, 260, 18, "#475569"),
    text("date", "May 2026", 54, 728, 160, 18, "#dc2626", { weight: "bold" })
  ]
});

export const MENU_CAFE_SINGLE_PAGE = makeTemplate({
  id: "menu-cafe-single-page",
  title: "Menu - Cafe Single Page",
  category: "menu",
  width: 595,
  height: 842,
  background: "#fffaf0",
  accent: "#92400e",
  fields: ["restaurant", "section_1", "item_1", "item_2", "section_2", "item_3", "item_4", "phone"],
  layers: [
    text("restaurant", "Himalayan Cafe", 80, 58, 430, 44, "#78350f", { weight: "bold", family: SERIF, align: "center", height: 70 }),
    line("menu-rule", 92, 138, 410, "#92400e", 0.8),
    text("section_1", "Coffee", 76, 184, 180, 28, "#92400e", { weight: "bold", family: SERIF }),
    text("item_1", "Americano ............ NPR 180", 76, 238, 360, 20, "#111827"),
    text("item_2", "Cafe Latte ............ NPR 240", 76, 278, 360, 20, "#111827"),
    text("section_2", "Bites", 76, 376, 180, 28, "#92400e", { weight: "bold", family: SERIF }),
    text("item_3", "Veg Sandwich ...... NPR 280", 76, 430, 360, 20, "#111827"),
    text("item_4", "Chocolate Cake .... NPR 220", 76, 470, 360, 20, "#111827"),
    text("phone", "+977-9800000000", 80, 742, 430, 18, "#78350f", { align: "center" })
  ]
});

export const MENU_RESTAURANT_CLASSIC = makeTemplate({
  id: "menu-restaurant-classic",
  title: "Menu - Restaurant Classic",
  category: "menu",
  width: 595,
  height: 842,
  background: "#ffffff",
  accent: "#991b1b",
  fields: ["restaurant", "special", "starter", "main", "dessert", "address", "hero_image"],
  layers: [
    image("hero_image", 0, 0, 595, 240),
    rect("title", 56, 194, 482, 116, "#991b1b"),
    text("restaurant", "The Dining Room", 86, 220, 422, 38, "#ffffff", { weight: "bold", family: SERIF, align: "center", height: 58 }),
    text("special", "Chef's Special Menu", 86, 266, 422, 18, "#fecaca", { align: "center" }),
    text("starter", "Starter: Tomato Soup / Chicken Sekuwa", 72, 388, 440, 20, "#111827"),
    text("main", "Main: Thakali Set / Grilled Fish / Veg Curry", 72, 446, 440, 20, "#111827"),
    text("dessert", "Dessert: Juju Dhau / Brownie / Ice Cream", 72, 504, 440, 20, "#111827"),
    line("menu-bottom", 72, 628, 440, "#991b1b", 0.8),
    text("address", "Durbarmarg, Kathmandu", 72, 660, 440, 18, "#475569", { align: "center" })
  ]
});

export const POSTCARD_PROMO_FRONT = makeTemplate({
  id: "postcard-promo-front",
  title: "Postcard - Promotion Front",
  category: "postcard",
  width: 600,
  height: 420,
  background: "#ffffff",
  accent: "#0891b2",
  fields: ["headline", "offer", "details", "code", "website", "hero_image", "logo"],
  layers: [
    image("hero_image", 0, 0, 318, 420),
    rect("right-panel", 318, 0, 282, 420, "#ecfeff"),
    image("logo", 352, 34, 56, 56),
    text("headline", "Summer Print Offer", 352, 118, 210, 34, "#0f172a", { weight: "bold", height: 82 }),
    text("offer", "Save 20%", 352, 218, 180, 38, "#0891b2", { weight: "bold" }),
    text("details", "Use this postcard for customer campaigns, shop launches and product promos.", 352, 278, 200, 16, "#475569", { height: 72 }),
    text("code", "CODE: PRINT20", 352, 360, 190, 17, "#0f172a", { weight: "bold" }),
    text("website", "printnepal.com", 352, 386, 170, 14, "#0891b2")
  ]
});

export const PRINT_ARTICLE_TEMPLATES: ProductTemplateWithService[] = [
  BROCHURE_TRIFOLD_SERVICE,
  BROCHURE_REAL_ESTATE,
  BROCHURE_CLINIC,
  FLYER_SALE_BOLD,
  FLYER_COMMUNITY_EVENT,
  POSTER_CONCERT_NIGHT,
  POSTER_PRODUCT_LAUNCH,
  CERTIFICATE_ACHIEVEMENT_GOLD,
  CERTIFICATE_TRAINING_CLEAN,
  LETTERHEAD_CORPORATE_BLUE,
  LETTERHEAD_MINIMAL_GREEN,
  BOOKLET_COMPANY_PROFILE,
  BOOKLET_TRAINING_MANUAL,
  MENU_CAFE_SINGLE_PAGE,
  MENU_RESTAURANT_CLASSIC,
  POSTCARD_PROMO_FRONT
];
