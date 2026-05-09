import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const serviceImages = {
  "wedding-catalogs-cards": "/images/services/printshop-premium.svg",
  "custom-stickers": "/images/services/printshop-premium.svg",
  "laptop-wrappers": "/images/services/printshop-premium.svg",
  "business-essentials": "/images/services/printshop-premium.svg",
  "architectural-blueprints": "/images/services/printshop-premium.svg",
  "fine-art-prints": "/images/services/printshop-premium.svg",
  "business-cards": "/images/services/printshop-premium.svg",
  "custom-t-shirts": "/images/services/printshop-premium.svg",
  "yard-signs": "/images/services/printshop-premium.svg",
  drinkware: "/images/services/printshop-premium.svg",
  "silver-sparkle-paper-printing": "/images/services/printshop-premium.svg",
  "stitch-binding": "/images/services/printshop-premium.svg"
};

const services = [
  ["Wedding catalogs/cards", "wedding-catalogs-cards", "Events", "Premium wedding cards, catalogs, invitations, envelopes, and ceremony print sets.", 35, true],
  ["Custom stickers", "custom-stickers", "Branding", "Die-cut stickers, labels, seals, packaging marks, and sticker sheets.", 8, true],
  ["Laptop wrappers", "laptop-wrappers", "Custom", "Durable custom laptop wrappers and skins with laminated matte or gloss finishes.", 699, true],
  ["Business essentials", "business-essentials", "Business", "Letterheads, folders, invoices, envelopes, and daily business print kits.", 1499, false],
  ["Architectural blueprints", "architectural-blueprints", "Large Format", "Large-format architectural blueprints, site plans, drawings, and revision sets.", 120, false],
  ["Fine art prints", "fine-art-prints", "Art", "Gallery-grade color prints for artists, photographers, and design studios.", 350, false],
  ["Business cards", "business-cards", "Business", "Premium business cards with clean paper stocks and finishing options.", 499, true],
  ["Custom T-shirts", "custom-t-shirts", "Apparel", "Small-batch custom T-shirt printing for teams, brands, and events.", 799, true],
  ["Yard signs", "yard-signs", "Signage", "Weather-ready yard signs for campaigns, properties, and local promotions.", 650, false],
  ["Drinkware", "drinkware", "Merch", "Custom mugs, bottles, and branded drinkware for gifts and business merchandise.", 450, false],
  ["Silver sparkle paper printing", "silver-sparkle-paper-printing", "Specialty", "Silver sparkle paper printing for premium cards, certificates, invitations, and catalogs.", 55, true],
  ["Stitch binding", "stitch-binding", "Finishing", "Elegant stitch binding for booklets, portfolios, menus, reports, and catalogs.", 180, false]
].map(([title, slug, category, description, base_price, is_featured]) => ({
  title,
  slug,
  category,
  description,
  image_url: serviceImages[slug],
  base_price,
  is_featured
}));

const materials = [
  ["Silver Sparkle", "Specialty paper", "A4, A5, custom card sizes", "Sparkle", 25, "Reflective silver sparkle stock for wedding cards, invitations, certificates, and premium catalogs."],
  ["Matte Vinyl", "Sticker vinyl", "Custom cut", "Matte laminate", 15, "Soft-touch vinyl for stickers, labels, laptop wrappers, and packaging."],
  ["300gsm Cardstock", "Card paper", "A4, A5, business card", "Smooth matte", 10, "Heavy cardstock for business cards, postcards, wedding cards, and brand essentials."],
  ["Linen Texture", "Textured paper", "A4, A5, invitation sizes", "Linen", 18, "Elegant textured paper for wedding catalogs, cards, menus, and formal stationery."],
  ["Pearl Paper", "Specialty paper", "Invitation sizes", "Pearl shimmer", 22, "Soft pearlescent stock for premium event stationery."],
  ["Archival Matte", "Fine art paper", "A4, A3, custom art sizes", "Matte", 35, "Museum-style matte paper for fine art prints and photography editions."],
  ["Gloss Vinyl", "Sticker vinyl", "Custom cut", "Gloss laminate", 15, "High-impact sticker and wrapper vinyl with a polished finish."],
  ["Bond Blueprint Paper", "Large format paper", "A2, A1, A0", "Technical matte", 0, "Clean large-format paper for architectural blueprints and site plans."]
].map(([name, type, size, finish, price_modifier, description]) => ({
  name,
  type,
  size,
  finish,
  price_modifier,
  description
}));

const { error: servicesError } = await supabase
  .from("services")
  .upsert(services, { onConflict: "slug" });

if (servicesError) {
  throw servicesError;
}

const materialNames = materials.map((material) => material.name);
const { error: deleteMaterialsError } = await supabase
  .from("materials")
  .delete()
  .in("name", materialNames);

if (deleteMaterialsError) {
  throw deleteMaterialsError;
}

const { error: materialsError } = await supabase.from("materials").insert(materials);

if (materialsError) {
  throw materialsError;
}

console.log(`Seeded ${services.length} services and ${materials.length} materials.`);
