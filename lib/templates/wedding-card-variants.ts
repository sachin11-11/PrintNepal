import type { ProductTemplateWithService } from "@/lib/supabase/queries";

export const WEDDING_CARD_2_ID = "wedding-card-02";
export const WEDDING_CARD_2: ProductTemplateWithService = {
  id: WEDDING_CARD_2_ID,
  service_id: null,
  title: "Wedding Invitation – Dark Floral",
  slug: WEDDING_CARD_2_ID,
  category: "wedding",
  thumbnail_url: "/template-images/wedding-card-02.png",
  editable_fields: ["tagline", "photo", "name_bride", "name_groom", "date", "time", "venue", "rsvp"],
  is_featured: true,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 500,
    height: 700,
    background: "#1A1A2E",
    accent: "#E8C9A0",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 500, h: 700, fill: "#1A1A2E", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bg-texture", type: "rect", name: "Texture Overlay", x: 0, y: 0, w: 500, h: 700, fill: "#16213E", stroke: null, strokeWidth: 0, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "border-outer", type: "rect", name: "Outer Border", x: 16, y: 16, w: 468, h: 668, fill: "transparent", stroke: "#E8C9A0", strokeWidth: 1.5, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "floral-top", type: "rect", name: "Top Floral Bar", x: 60, y: 55, w: 380, h: 1, fill: "#E8C9A0", stroke: null, opacity: 0.6, locked: false, visible: true, rotation: 0 },
      { id: "floral-top2", type: "rect", name: "Top Floral Bar2", x: 60, y: 59, w: 380, h: 1, fill: "#E8C9A0", stroke: null, opacity: 0.3, locked: false, visible: true, rotation: 0 },
      { id: "floral-bottom", type: "rect", name: "Bottom Floral Bar", x: 60, y: 641, w: 380, h: 1, fill: "#E8C9A0", stroke: null, opacity: 0.6, locked: false, visible: true, rotation: 0 },
      { id: "floral-bottom2", type: "rect", name: "Bottom Floral Bar2", x: 60, y: 645, w: 380, h: 1, fill: "#E8C9A0", stroke: null, opacity: 0.3, locked: false, visible: true, rotation: 0 },
      { id: "corner-tl", type: "ellipse", name: "Deco TL", x: 16, y: 16, w: 50, h: 50, fill: "transparent", stroke: "#E8C9A0", strokeWidth: 1, opacity: 0.5, locked: false, visible: true, rotation: 0 },
      { id: "corner-tr", type: "ellipse", name: "Deco TR", x: 434, y: 16, w: 50, h: 50, fill: "transparent", stroke: "#E8C9A0", strokeWidth: 1, opacity: 0.5, locked: false, visible: true, rotation: 0 },
      { id: "corner-bl", type: "ellipse", name: "Deco BL", x: 16, y: 634, w: 50, h: 50, fill: "transparent", stroke: "#E8C9A0", strokeWidth: 1, opacity: 0.5, locked: false, visible: true, rotation: 0 },
      { id: "corner-br", type: "ellipse", name: "Deco BR", x: 434, y: 634, w: 50, h: 50, fill: "transparent", stroke: "#E8C9A0", strokeWidth: 1, opacity: 0.5, locked: false, visible: true, rotation: 0 },
      { id: "tagline", type: "text", name: "Tagline", x: 250, y: 100, text: "♥  YOU ARE INVITED  ♥", fontSize: 11, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#E8C9A0", textAlign: "center", letterSpacing: 4, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "photo-frame", type: "ellipse", name: "Photo Frame", x: 155, y: 140, w: 190, h: 190, fill: "#0F3460", stroke: "#E8C9A0", strokeWidth: 2, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "photo", type: "image", name: "Couple Photo", x: 155, y: 140, w: 190, h: 190, src: null, placeholder: true, clipShape: "ellipse", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "name-bride", type: "text", name: "Bride Name", x: 250, y: 380, text: "Ananya", fontSize: 38, fontFamily: "'Palatino Linotype', Palatino, serif", fontWeight: "normal", fontStyle: "italic", fill: "#E8C9A0", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "divider-line", type: "rect", name: "Name Divider", x: 180, y: 418, w: 140, h: 1, fill: "#E8C9A0", stroke: null, opacity: 0.5, locked: false, visible: true, rotation: 0 },
      { id: "name-groom", type: "text", name: "Groom Name", x: 250, y: 455, text: "Arjun", fontSize: 38, fontFamily: "'Palatino Linotype', Palatino, serif", fontWeight: "normal", fontStyle: "italic", fill: "#E8C9A0", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "invite-text", type: "text", name: "Invite Message", x: 250, y: 500, text: "joyfully invite you to celebrate their union", fontSize: 12, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#B8A898", textAlign: "center", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "date", type: "text", name: "Wedding Date", x: 250, y: 532, text: "Friday, 20th December 2025", fontSize: 18, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#E8C9A0", textAlign: "center", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "time", type: "text", name: "Wedding Time", x: 250, y: 558, text: "7:00 PM onwards", fontSize: 12, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#B8A898", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "venue", type: "text", name: "Venue", x: 250, y: 578, text: "Himalayan Convention Centre, Pokhara", fontSize: 11, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#B8A898", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "rsvp", type: "text", name: "RSVP", x: 250, y: 620, text: "RSVP  ·  +977-9801234567", fontSize: 10, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#E8C9A0", textAlign: "center", letterSpacing: 3, opacity: 0.9, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const WEDDING_CARD_3_ID = "wedding-card-03";
export const WEDDING_CARD_3: ProductTemplateWithService = {
  id: WEDDING_CARD_3_ID,
  service_id: null,
  title: "Wedding Invitation – Blush Minimal",
  slug: WEDDING_CARD_3_ID,
  category: "wedding",
  thumbnail_url: "/template-images/wedding-card-03.png",
  editable_fields: ["tagline", "photo", "name_bride", "name_groom", "date", "time", "venue", "rsvp"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 500,
    height: 700,
    background: "#FFF0F3",
    accent: "#D4A5A5",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 500, h: 700, fill: "#FFF0F3", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "header-band", type: "rect", name: "Header Band", x: 0, y: 0, w: 500, h: 120, fill: "#F8D7DA", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "footer-band", type: "rect", name: "Footer Band", x: 0, y: 620, w: 500, h: 80, fill: "#F8D7DA", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "border", type: "rect", name: "Border", x: 20, y: 20, w: 460, h: 660, fill: "transparent", stroke: "#D4A5A5", strokeWidth: 1, opacity: 0.6, locked: false, visible: true, rotation: 0 },
      { id: "tagline", type: "text", name: "Tagline", x: 250, y: 48, text: "— WEDDING INVITATION —", fontSize: 10, fontFamily: "'Book Antiqua', Palatino, serif", fontWeight: "normal", fontStyle: "normal", fill: "#8B4A5C", textAlign: "center", letterSpacing: 4, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "script-top", type: "text", name: "Script Header", x: 250, y: 85, text: "We're getting married!", fontSize: 18, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#C97690", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "photo-frame", type: "rect", name: "Photo Frame", x: 125, y: 145, w: 250, h: 220, fill: "#F8D7DA", stroke: "#D4A5A5", strokeWidth: 1.5, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "photo", type: "image", name: "Couple Photo", x: 125, y: 145, w: 250, h: 220, src: null, placeholder: true, clipShape: "rect", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "name-bride", type: "text", name: "Bride Name", x: 250, y: 405, text: "Nisha", fontSize: 40, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#8B4A5C", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "ampersand", type: "text", name: "Ampersand", x: 250, y: 440, text: "&", fontSize: 18, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#D4A5A5", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "name-groom", type: "text", name: "Groom Name", x: 250, y: 475, text: "Suresh", fontSize: 40, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#8B4A5C", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "divider", type: "rect", name: "Content Divider", x: 100, y: 515, w: 300, h: 1, fill: "#D4A5A5", stroke: null, opacity: 0.8, locked: false, visible: true, rotation: 0 },
      { id: "date", type: "text", name: "Wedding Date", x: 250, y: 535, text: "Sunday, 8th March 2026", fontSize: 16, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#8B4A5C", textAlign: "center", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "time", type: "text", name: "Wedding Time", x: 250, y: 560, text: "5:30 PM", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#C97690", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "venue", type: "text", name: "Venue", x: 250, y: 582, text: "Dwarika's Hotel, Kathmandu", fontSize: 12, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#C97690", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "rsvp", type: "text", name: "RSVP", x: 250, y: 645, text: "RSVP · +977-9845678901", fontSize: 10, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#8B4A5C", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};
