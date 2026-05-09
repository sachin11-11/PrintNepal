export type Service = {
  title: string;
  slug: string;
  description: string;
  material: string;
  price: string;
  category: string;
  image_url: string;
};

export type ProductDesign = {
  title: string;
  serviceSlug: string;
  image_url: string;
  finish: string;
  price: string;
};

export const serviceImages: Record<string, string> = {
  "wedding-catalogs-cards": "https://images.pexels.com/photos/29821871/pexels-photo-29821871.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "custom-stickers": "https://images.unsplash.com/photo-1619468129361-605ebea04b44?auto=format&fit=crop&w=1400&q=80",
  "laptop-wrappers": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80",
  "business-essentials": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1400&q=80",
  "architectural-blueprints": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
  "fine-art-prints": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=80",
  "business-cards": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1400&q=80",
  "custom-t-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
  "yard-signs": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
  drinkware: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1400&q=80",
  "silver-sparkle-paper-printing": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=80",
  "stitch-binding": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80"
};

export const suggestions = [
  "Silver Sparkle",
  "Matte Vinyl",
  "300gsm Cardstock",
  "Linen Texture"
];

export const services: Service[] = [
  {
    title: "Wedding catalogs/cards",
    slug: "wedding-catalogs-cards",
    description: "Premium invitations, catalogs, RSVP cards, envelopes, and keepsakes.",
    material: "Pearl, linen, textured cardstock",
    price: "From NPR 35",
    category: "Events",
    image_url: serviceImages["wedding-catalogs-cards"]
  },
  {
    title: "Custom stickers",
    slug: "custom-stickers",
    description: "Die-cut stickers, labels, seals, packaging marks, and sticker sheets.",
    material: "Matte vinyl, gloss vinyl",
    price: "From NPR 8",
    category: "Branding",
    image_url: serviceImages["custom-stickers"]
  },
  {
    title: "Laptop wrappers",
    slug: "laptop-wrappers",
    description: "Durable custom laptop skins with clean laminated finishes.",
    material: "Laminated vinyl",
    price: "From NPR 699",
    category: "Custom",
    image_url: serviceImages["laptop-wrappers"]
  },
  {
    title: "Business essentials",
    slug: "business-essentials",
    description: "Letterheads, envelopes, folders, invoices, and launch kits.",
    material: "Premium office stock",
    price: "From NPR 1,499",
    category: "Business",
    image_url: serviceImages["business-essentials"]
  },
  {
    title: "Architectural blueprints",
    slug: "architectural-blueprints",
    description: "Large-format drawings, plan sets, site documents, and revisions.",
    material: "Bond paper, tracing paper",
    price: "From NPR 120",
    category: "Large Format",
    image_url: serviceImages["architectural-blueprints"]
  },
  {
    title: "Fine art prints",
    slug: "fine-art-prints",
    description: "Gallery-grade color prints for artists, photographers, and studios.",
    material: "Archival matte, satin photo",
    price: "From NPR 350",
    category: "Art",
    image_url: serviceImages["fine-art-prints"]
  },
  {
    title: "Business cards",
    slug: "business-cards",
    description: "Sharp business cards with premium paper and finishing options.",
    material: "300gsm cardstock",
    price: "From NPR 499",
    category: "Business",
    image_url: serviceImages["business-cards"]
  },
  {
    title: "ID cards",
    slug: "id-cards",
    description: "Employee ID cards, student cards, visitor badges, and lanyard-ready cards.",
    material: "PVC card, laminated card, badge holder",
    price: "From NPR 120",
    category: "Business",
    image_url: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Custom T-shirts",
    slug: "custom-t-shirts",
    description: "Small-batch branded T-shirts for teams, events, and creators.",
    material: "Cotton, DTF transfer",
    price: "From NPR 799",
    category: "Apparel",
    image_url: serviceImages["custom-t-shirts"]
  },
  {
    title: "Yard signs",
    slug: "yard-signs",
    description: "Weather-ready signs for campaigns, properties, and promotions.",
    material: "Coroplast",
    price: "From NPR 650",
    category: "Signage",
    image_url: serviceImages["yard-signs"]
  },
  {
    title: "Drinkware",
    slug: "drinkware",
    description: "Personalized mugs, bottles, and branded drinkware sets.",
    material: "Ceramic, steel",
    price: "From NPR 450",
    category: "Merch",
    image_url: serviceImages.drinkware
  },
  {
    title: "Silver sparkle paper printing",
    slug: "silver-sparkle-paper-printing",
    description: "Premium shimmer paper for cards, certificates, and invitations.",
    material: "Silver sparkle paper",
    price: "From NPR 55",
    category: "Specialty",
    image_url: serviceImages["silver-sparkle-paper-printing"]
  },
  {
    title: "Stitch binding",
    slug: "stitch-binding",
    description: "Elegant booklets, portfolios, reports, and catalogs with stitch binding.",
    material: "Booklet stock",
    price: "From NPR 180",
    category: "Finishing",
    image_url: serviceImages["stitch-binding"]
  }
];

export const productDesigns: ProductDesign[] = [
  {
    title: "Blush Floral Wedding Invite",
    serviceSlug: "wedding-catalogs-cards",
    image_url: "https://images.pexels.com/photos/29821871/pexels-photo-29821871.jpeg?auto=compress&cs=tinysrgb&w=1200",
    finish: "Matte pearl cardstock with envelope",
    price: "From NPR 65"
  },
  {
    title: "Rustic Kraft Invitation Suite",
    serviceSlug: "wedding-catalogs-cards",
    image_url: "https://images.pexels.com/photos/29395419/pexels-photo-29395419.jpeg?auto=compress&cs=tinysrgb&w=1200",
    finish: "Kraft textured paper with RSVP insert",
    price: "From NPR 75"
  },
  {
    title: "Greenery Wedding Card Set",
    serviceSlug: "wedding-catalogs-cards",
    image_url: "https://images.pexels.com/photos/29821868/pexels-photo-29821868.jpeg?auto=compress&cs=tinysrgb&w=1200",
    finish: "Linen cardstock with floral artwork",
    price: "From NPR 70"
  },
  {
    title: "Corporate Staff ID",
    serviceSlug: "id-cards",
    image_url: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?auto=format&fit=crop&w=1200&q=80",
    finish: "PVC card with portrait and QR field",
    price: "From NPR 120"
  },
  {
    title: "Student ID Badge",
    serviceSlug: "id-cards",
    image_url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80",
    finish: "Laminated card with badge slot",
    price: "From NPR 90"
  }
];

export const collections = services.slice(0, 6).map((service, index) => ({
  ...service,
  className:
    index === 0 ? "md:col-span-2 md:row-span-2" : index === 4 ? "md:col-span-2" : "",
  tone:
    index % 3 === 0
      ? "from-stone-100 to-white"
      : index % 3 === 1
        ? "from-zinc-100 to-white"
        : "from-slate-100 to-white"
}));

export const gallery = [
  {
    title: "Minimal wedding suite",
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Cafe loyalty stickers",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Studio art editions",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Startup launch cards",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Laptop skin drop",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Boutique packaging",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80"
  }
];

export const orders = [
  { id: "PN-1048", customer: "Aarya Studio", service: "Fine art prints", status: "In Production", total: "NPR 8,450" },
  { id: "PN-1047", customer: "Himal Events", service: "Wedding catalogs/cards", status: "Proofing", total: "NPR 24,000" },
  { id: "PN-1046", customer: "Momo Labs", service: "Custom stickers", status: "Ready", total: "NPR 3,200" }
];

export const materials = [
  "Silver Sparkle",
  "Matte Vinyl",
  "300gsm Cardstock",
  "Linen Texture",
  "Pearl Paper",
  "Archival Matte"
];
