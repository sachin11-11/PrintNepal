export type PrintProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  minQuantity: number;
  basePrice: number;
  turnaroundHours: number;
  popular?: boolean;
  sizes: string[];
  paperTypes: string[];
};

export type CatalogOption = {
  id: string;
  label: string;
  multiplier?: number;
  add?: number;
};

export const categoryImages: Record<string, string> = {
  "Business Stationery": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
  Documents: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  Marketing: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
  Signage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  Stickers: "https://images.unsplash.com/photo-1619468129361-605ebea04b44?auto=format&fit=crop&w=900&q=80",
  Events: "https://images.pexels.com/photos/29821871/pexels-photo-29821871.jpeg?auto=compress&cs=tinysrgb&w=900",
  Hospitality: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=900&q=80",
  Cards: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=900&q=80",
  "Large Format": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  Photo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
  Merchandise: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  Seasonal: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80",
  Packaging: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80"
};

export const sizeOptions: CatalogOption[] = [
  { id: "a6", label: "105 x 148 mm (A6)", multiplier: 0.6 },
  { id: "a5", label: "148 x 210 mm (A5)", multiplier: 0.8 },
  { id: "a4", label: "210 x 297 mm (A4)", multiplier: 1 },
  { id: "a3", label: "297 x 420 mm (A3)", multiplier: 1.85 },
  { id: "a2", label: "420 x 594 mm (A2)", multiplier: 3.4 },
  { id: "business-card", label: "90 x 50 mm (Business card)", multiplier: 0.42 },
  { id: "id-card", label: "86 x 54 mm (ID card)", multiplier: 0.9 },
  { id: "letterhead", label: "210 x 297 mm (Letterhead)", multiplier: 1 },
  { id: "dl-envelope", label: "110 x 220 mm (DL envelope)", multiplier: 0.85 },
  { id: "custom", label: "Custom dimensions", multiplier: 1.25 }
];

export const paperOptions: CatalogOption[] = [
  { id: "80gsm", label: "80gsm bond", add: 0 },
  { id: "100gsm", label: "100gsm premium bond", add: 3 },
  { id: "130gsm", label: "130gsm art paper", add: 6 },
  { id: "170gsm", label: "170gsm art paper", add: 10 },
  { id: "250gsm", label: "250gsm cardstock", add: 18 },
  { id: "300gsm", label: "300gsm cardstock", add: 24 },
  { id: "350gsm", label: "350gsm matte card", add: 32 },
  { id: "pvc", label: "PVC card", add: 55 },
  { id: "sticker-matte", label: "Matte sticker vinyl", add: 20 },
  { id: "sticker-gloss", label: "Gloss sticker vinyl", add: 24 },
  { id: "kraft", label: "Kraft paper", add: 14 },
  { id: "linen", label: "Linen textured paper", add: 28 },
  { id: "pearl", label: "Pearl shimmer paper", add: 36 }
];

export const finishingOptions: CatalogOption[] = [
  { id: "none", label: "No finishing", add: 0 },
  { id: "matte-lamination", label: "Matte lamination", add: 18 },
  { id: "gloss-lamination", label: "Gloss lamination", add: 18 },
  { id: "round-corners", label: "Round corners", add: 8 },
  { id: "folding", label: "Folding", add: 6 },
  { id: "binding", label: "Binding", add: 45 },
  { id: "die-cut", label: "Die cut", add: 35 }
];

export const deliveryAreas: CatalogOption[] = [
  { id: "pickup", label: "Pickup at shop", add: 0 },
  { id: "nearby", label: "Nearby Kathmandu", add: 120 },
  { id: "inside-ring-road", label: "Inside ring road", add: 180 },
  { id: "outside-ring-road", label: "Outside ring road", add: 280 },
  { id: "lalitpur-bhaktapur", label: "Lalitpur / Bhaktapur", add: 350 },
  { id: "courier", label: "Courier outside valley", add: 550 }
];

export const walletOptions = [
  { id: "esewa", label: "eSewa", note: "Wallet checkout" },
  { id: "khalti", label: "Khalti", note: "Wallet checkout" },
  { id: "imepay", label: "IME Pay", note: "Mobile wallet" },
  { id: "connectips", label: "ConnectIPS", note: "Bank transfer" },
  { id: "cod", label: "Pay on pickup", note: "Counter payment" }
];

export const printCatalog: PrintProduct[] = [
  { id: "letter-head", name: "Letterhead", category: "Business Stationery", unit: "sheet", minQuantity: 100, basePrice: 9, turnaroundHours: 24, popular: true, sizes: ["letterhead", "a4", "custom"], paperTypes: ["80gsm", "100gsm", "130gsm"] },
  { id: "business-card", name: "Business Card", category: "Business Stationery", unit: "card", minQuantity: 100, basePrice: 6, turnaroundHours: 24, popular: true, sizes: ["business-card", "custom"], paperTypes: ["300gsm", "350gsm", "linen", "pearl"] },
  { id: "envelope", name: "Envelope", category: "Business Stationery", unit: "piece", minQuantity: 100, basePrice: 12, turnaroundHours: 36, sizes: ["dl-envelope", "custom"], paperTypes: ["80gsm", "100gsm", "kraft"] },
  { id: "invoice-pad", name: "Invoice Pad", category: "Business Stationery", unit: "pad", minQuantity: 10, basePrice: 160, turnaroundHours: 48, sizes: ["a5", "a4", "custom"], paperTypes: ["80gsm", "100gsm"] },
  { id: "receipt-pad", name: "Receipt Pad", category: "Business Stationery", unit: "pad", minQuantity: 10, basePrice: 145, turnaroundHours: 48, sizes: ["a6", "a5", "custom"], paperTypes: ["80gsm", "100gsm"] },
  { id: "folder", name: "Presentation Folder", category: "Business Stationery", unit: "piece", minQuantity: 50, basePrice: 55, turnaroundHours: 72, sizes: ["a4", "custom"], paperTypes: ["250gsm", "300gsm", "350gsm"] },
  { id: "notepad", name: "Notepad", category: "Business Stationery", unit: "pad", minQuantity: 25, basePrice: 120, turnaroundHours: 48, sizes: ["a6", "a5", "a4"], paperTypes: ["80gsm", "100gsm"] },
  { id: "company-profile", name: "Company Profile", category: "Documents", unit: "copy", minQuantity: 10, basePrice: 220, turnaroundHours: 72, sizes: ["a4", "custom"], paperTypes: ["130gsm", "170gsm", "250gsm"] },
  { id: "brochure", name: "Brochure", category: "Marketing", unit: "piece", minQuantity: 100, basePrice: 18, turnaroundHours: 48, popular: true, sizes: ["a5", "a4", "custom"], paperTypes: ["130gsm", "170gsm", "250gsm"] },
  { id: "flyer", name: "Pamphlet / Flyer", category: "Marketing", unit: "piece", minQuantity: 100, basePrice: 8, turnaroundHours: 24, popular: true, sizes: ["a6", "a5", "a4"], paperTypes: ["100gsm", "130gsm", "170gsm"] },
  { id: "poster", name: "Poster", category: "Marketing", unit: "piece", minQuantity: 10, basePrice: 95, turnaroundHours: 24, sizes: ["a3", "a2", "custom"], paperTypes: ["130gsm", "170gsm", "250gsm"] },
  { id: "banner", name: "Flex Banner", category: "Signage", unit: "sq ft", minQuantity: 10, basePrice: 65, turnaroundHours: 24, sizes: ["custom"], paperTypes: ["sticker-gloss"] },
  { id: "standee", name: "Rollup Standee", category: "Signage", unit: "piece", minQuantity: 1, basePrice: 2200, turnaroundHours: 48, sizes: ["custom"], paperTypes: ["sticker-gloss"] },
  { id: "yard-sign", name: "Yard Sign", category: "Signage", unit: "piece", minQuantity: 5, basePrice: 650, turnaroundHours: 48, sizes: ["a3", "custom"], paperTypes: ["sticker-gloss"] },
  { id: "vinyl-sticker", name: "Vinyl Sticker", category: "Stickers", unit: "piece", minQuantity: 50, basePrice: 18, turnaroundHours: 24, popular: true, sizes: ["a6", "a5", "custom"], paperTypes: ["sticker-matte", "sticker-gloss"] },
  { id: "label-sticker", name: "Product Label Sticker", category: "Stickers", unit: "piece", minQuantity: 100, basePrice: 7, turnaroundHours: 24, sizes: ["a6", "custom"], paperTypes: ["sticker-matte", "sticker-gloss"] },
  { id: "die-cut-sticker", name: "Die Cut Sticker", category: "Stickers", unit: "piece", minQuantity: 50, basePrice: 24, turnaroundHours: 48, sizes: ["a6", "a5", "custom"], paperTypes: ["sticker-matte", "sticker-gloss"] },
  { id: "wedding-card", name: "Wedding Card", category: "Events", unit: "card", minQuantity: 50, basePrice: 65, turnaroundHours: 72, popular: true, sizes: ["a5", "a4", "custom"], paperTypes: ["250gsm", "300gsm", "linen", "pearl"] },
  { id: "invitation-card", name: "Invitation Card", category: "Events", unit: "card", minQuantity: 50, basePrice: 42, turnaroundHours: 48, sizes: ["a6", "a5", "custom"], paperTypes: ["250gsm", "300gsm", "pearl"] },
  { id: "birthday-card", name: "Birthday Card", category: "Events", unit: "card", minQuantity: 25, basePrice: 38, turnaroundHours: 48, sizes: ["a6", "a5", "custom"], paperTypes: ["250gsm", "300gsm"] },
  { id: "menu-card", name: "Restaurant Menu", category: "Hospitality", unit: "piece", minQuantity: 20, basePrice: 95, turnaroundHours: 48, sizes: ["a4", "a3", "custom"], paperTypes: ["250gsm", "300gsm"] },
  { id: "table-tent", name: "Table Tent", category: "Hospitality", unit: "piece", minQuantity: 25, basePrice: 85, turnaroundHours: 48, sizes: ["a5", "custom"], paperTypes: ["250gsm", "300gsm"] },
  { id: "id-card", name: "ID Card", category: "Cards", unit: "card", minQuantity: 10, basePrice: 120, turnaroundHours: 24, popular: true, sizes: ["id-card"], paperTypes: ["pvc"] },
  { id: "membership-card", name: "Membership Card", category: "Cards", unit: "card", minQuantity: 25, basePrice: 95, turnaroundHours: 24, sizes: ["id-card"], paperTypes: ["pvc", "300gsm"] },
  { id: "gift-card", name: "Gift Card", category: "Cards", unit: "card", minQuantity: 25, basePrice: 55, turnaroundHours: 36, sizes: ["business-card", "custom"], paperTypes: ["300gsm", "350gsm"] },
  { id: "certificate", name: "Certificate", category: "Documents", unit: "piece", minQuantity: 20, basePrice: 40, turnaroundHours: 24, sizes: ["a4", "custom"], paperTypes: ["170gsm", "250gsm", "pearl"] },
  { id: "booklet", name: "Booklet", category: "Documents", unit: "copy", minQuantity: 10, basePrice: 180, turnaroundHours: 72, sizes: ["a5", "a4"], paperTypes: ["100gsm", "130gsm", "170gsm"] },
  { id: "catalog", name: "Product Catalog", category: "Documents", unit: "copy", minQuantity: 10, basePrice: 240, turnaroundHours: 96, sizes: ["a5", "a4"], paperTypes: ["130gsm", "170gsm", "250gsm"] },
  { id: "manual", name: "Training Manual", category: "Documents", unit: "copy", minQuantity: 10, basePrice: 210, turnaroundHours: 72, sizes: ["a4"], paperTypes: ["80gsm", "100gsm", "130gsm"] },
  { id: "thesis", name: "Thesis Print", category: "Documents", unit: "copy", minQuantity: 1, basePrice: 650, turnaroundHours: 48, sizes: ["a4"], paperTypes: ["80gsm", "100gsm"] },
  { id: "blueprint", name: "Blueprint", category: "Large Format", unit: "sheet", minQuantity: 5, basePrice: 120, turnaroundHours: 12, sizes: ["a3", "a2", "custom"], paperTypes: ["80gsm", "100gsm"] },
  { id: "architectural-plan", name: "Architectural Plan", category: "Large Format", unit: "sheet", minQuantity: 5, basePrice: 180, turnaroundHours: 12, sizes: ["a3", "a2", "custom"], paperTypes: ["80gsm", "100gsm"] },
  { id: "photo-print", name: "Photo Print", category: "Photo", unit: "print", minQuantity: 5, basePrice: 35, turnaroundHours: 12, sizes: ["a6", "a5", "a4", "custom"], paperTypes: ["170gsm", "250gsm"] },
  { id: "canvas-print", name: "Canvas Print", category: "Photo", unit: "piece", minQuantity: 1, basePrice: 1450, turnaroundHours: 72, sizes: ["a3", "a2", "custom"], paperTypes: ["sticker-matte"] },
  { id: "fine-art-print", name: "Fine Art Print", category: "Photo", unit: "print", minQuantity: 1, basePrice: 350, turnaroundHours: 48, sizes: ["a4", "a3", "custom"], paperTypes: ["170gsm", "250gsm"] },
  { id: "t-shirt", name: "Custom T-Shirt", category: "Merchandise", unit: "piece", minQuantity: 5, basePrice: 799, turnaroundHours: 72, sizes: ["custom"], paperTypes: ["sticker-matte"] },
  { id: "mug", name: "Printed Mug", category: "Merchandise", unit: "piece", minQuantity: 5, basePrice: 450, turnaroundHours: 48, sizes: ["custom"], paperTypes: ["sticker-gloss"] },
  { id: "bottle", name: "Printed Bottle", category: "Merchandise", unit: "piece", minQuantity: 10, basePrice: 650, turnaroundHours: 72, sizes: ["custom"], paperTypes: ["sticker-gloss"] },
  { id: "lanyard", name: "Lanyard", category: "Merchandise", unit: "piece", minQuantity: 50, basePrice: 85, turnaroundHours: 72, sizes: ["custom"], paperTypes: ["sticker-gloss"] },
  { id: "calendar", name: "Calendar", category: "Seasonal", unit: "piece", minQuantity: 25, basePrice: 180, turnaroundHours: 96, sizes: ["a5", "a4", "custom"], paperTypes: ["170gsm", "250gsm"] },
  { id: "diary", name: "Diary", category: "Seasonal", unit: "piece", minQuantity: 25, basePrice: 420, turnaroundHours: 120, sizes: ["a5", "custom"], paperTypes: ["80gsm", "100gsm"] },
  { id: "greeting-card", name: "Greeting Card", category: "Seasonal", unit: "card", minQuantity: 25, basePrice: 35, turnaroundHours: 48, sizes: ["a6", "a5"], paperTypes: ["250gsm", "300gsm", "pearl"] },
  { id: "packaging-sleeve", name: "Packaging Sleeve", category: "Packaging", unit: "piece", minQuantity: 100, basePrice: 28, turnaroundHours: 96, sizes: ["custom"], paperTypes: ["250gsm", "300gsm", "kraft"] },
  { id: "box-label", name: "Box Label", category: "Packaging", unit: "piece", minQuantity: 100, basePrice: 9, turnaroundHours: 24, sizes: ["a6", "custom"], paperTypes: ["sticker-matte", "sticker-gloss"] },
  { id: "thank-you-card", name: "Thank You Card", category: "Packaging", unit: "card", minQuantity: 50, basePrice: 18, turnaroundHours: 36, sizes: ["business-card", "a6"], paperTypes: ["250gsm", "300gsm", "kraft"] },
  { id: "hang-tag", name: "Hang Tag", category: "Packaging", unit: "piece", minQuantity: 100, basePrice: 12, turnaroundHours: 48, sizes: ["business-card", "custom"], paperTypes: ["300gsm", "350gsm", "kraft"] },
  { id: "coupon", name: "Coupon", category: "Marketing", unit: "piece", minQuantity: 100, basePrice: 6, turnaroundHours: 24, sizes: ["business-card", "a6"], paperTypes: ["100gsm", "130gsm", "170gsm"] },
  { id: "door-hanger", name: "Door Hanger", category: "Marketing", unit: "piece", minQuantity: 100, basePrice: 28, turnaroundHours: 72, sizes: ["a5", "custom"], paperTypes: ["250gsm", "300gsm"] },
  { id: "sticker-sheet", name: "Sticker Sheet", category: "Stickers", unit: "sheet", minQuantity: 25, basePrice: 75, turnaroundHours: 48, sizes: ["a5", "a4"], paperTypes: ["sticker-matte", "sticker-gloss"] },
  { id: "wall-sticker", name: "Wall Sticker", category: "Stickers", unit: "sq ft", minQuantity: 10, basePrice: 95, turnaroundHours: 48, sizes: ["custom"], paperTypes: ["sticker-matte", "sticker-gloss"] },
  { id: "vehicle-sticker", name: "Vehicle Sticker", category: "Stickers", unit: "sq ft", minQuantity: 10, basePrice: 120, turnaroundHours: 72, sizes: ["custom"], paperTypes: ["sticker-gloss"] },
  { id: "foam-board", name: "Foam Board Print", category: "Signage", unit: "piece", minQuantity: 5, basePrice: 480, turnaroundHours: 48, sizes: ["a3", "a2", "custom"], paperTypes: ["sticker-gloss"] },
  { id: "acrylic-sign", name: "Acrylic Sign", category: "Signage", unit: "piece", minQuantity: 1, basePrice: 2200, turnaroundHours: 120, sizes: ["custom"], paperTypes: ["sticker-gloss"] },
  { id: "name-plate", name: "Name Plate", category: "Signage", unit: "piece", minQuantity: 1, basePrice: 850, turnaroundHours: 72, sizes: ["custom"], paperTypes: ["sticker-gloss"] },
  { id: "event-pass", name: "Event Pass", category: "Events", unit: "card", minQuantity: 50, basePrice: 28, turnaroundHours: 48, sizes: ["id-card", "custom"], paperTypes: ["250gsm", "300gsm", "pvc"] },
  { id: "ticket", name: "Event Ticket", category: "Events", unit: "piece", minQuantity: 100, basePrice: 8, turnaroundHours: 24, sizes: ["business-card", "a6"], paperTypes: ["100gsm", "130gsm"] },
  { id: "wristband", name: "Event Wristband", category: "Events", unit: "piece", minQuantity: 100, basePrice: 22, turnaroundHours: 72, sizes: ["custom"], paperTypes: ["sticker-matte"] },
  { id: "bookmark", name: "Bookmark", category: "Documents", unit: "piece", minQuantity: 100, basePrice: 10, turnaroundHours: 36, sizes: ["custom"], paperTypes: ["250gsm", "300gsm"] },
  { id: "postcard", name: "Postcard", category: "Marketing", unit: "card", minQuantity: 50, basePrice: 22, turnaroundHours: 36, sizes: ["a6", "custom"], paperTypes: ["250gsm", "300gsm"] }
];
