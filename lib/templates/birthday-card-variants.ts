import type { ProductTemplateWithService } from "@/lib/supabase/queries";

export const BIRTHDAY_CARD_1_ID = "birthday-card-01";
export const BIRTHDAY_CARD_1: ProductTemplateWithService = {
  id: BIRTHDAY_CARD_1_ID,
  service_id: null,
  title: "Birthday Card - Confetti Party",
  slug: BIRTHDAY_CARD_1_ID,
  category: "birthday",
  thumbnail_url: "/template-images/birthday-card-01.png",
  editable_fields: ["headline", "name", "age", "message", "from", "photo"],
  is_featured: true,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 500,
    height: 700,
    background: "#FFFDE7",
    accent: "#FF6F00",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 500, h: 700, fill: "#FFFDE7", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "top-band", type: "rect", name: "Top Band", x: 0, y: 0, w: 500, h: 14, fill: "#FF6F00", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bottom-band", type: "rect", name: "Bottom Band", x: 0, y: 686, w: 500, h: 14, fill: "#FF6F00", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "confetti-1", type: "ellipse", name: "Confetti 1", x: 40, y: 40, w: 18, h: 10, fill: "#FF4081", stroke: null, opacity: 0.8, locked: true, visible: true, rotation: 30 },
      { id: "confetti-2", type: "ellipse", name: "Confetti 2", x: 420, y: 60, w: 14, h: 8, fill: "#00BCD4", stroke: null, opacity: 0.8, locked: true, visible: true, rotation: -20 },
      { id: "confetti-3", type: "ellipse", name: "Confetti 3", x: 80, y: 620, w: 16, h: 9, fill: "#FFEB3B", stroke: null, opacity: 0.8, locked: true, visible: true, rotation: 15 },
      { id: "confetti-4", type: "ellipse", name: "Confetti 4", x: 380, y: 600, w: 18, h: 10, fill: "#7C4DFF", stroke: null, opacity: 0.8, locked: true, visible: true, rotation: -30 },
      { id: "confetti-5", type: "rect", name: "Confetti 5", x: 200, y: 30, w: 12, h: 6, fill: "#4CAF50", stroke: null, opacity: 0.8, locked: true, visible: true, rotation: 45 },
      { id: "confetti-6", type: "rect", name: "Confetti 6", x: 460, y: 320, w: 10, h: 5, fill: "#FF6F00", stroke: null, opacity: 0.7, locked: true, visible: true, rotation: -45 },
      { id: "headline", type: "text", name: "Headline", x: 250, y: 90, text: "🎉 Happy Birthday! 🎉", fontSize: 30, fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive", fontWeight: "bold", fontStyle: "normal", fill: "#FF6F00", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "photo-frame", type: "ellipse", name: "Photo Frame", x: 150, y: 145, w: 200, h: 200, fill: "#FFE0B2", stroke: "#FF6F00", strokeWidth: 3, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "photo", type: "image", name: "Birthday Person Photo", x: 150, y: 145, w: 200, h: 200, src: null, placeholder: true, clipShape: "ellipse", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "name", type: "text", name: "Person Name", x: 250, y: 382, text: "Dear Rohan,", fontSize: 28, fontFamily: "'Comic Sans MS', cursive", fontWeight: "bold", fontStyle: "normal", fill: "#E65100", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "age", type: "text", name: "Age", x: 250, y: 420, text: "Wishing you an amazing 25th birthday!", fontSize: 15, fontFamily: "'Comic Sans MS', cursive", fontWeight: "normal", fontStyle: "normal", fill: "#FF6F00", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "message", type: "text", name: "Message", x: 250, y: 480, text: "May your day be filled with joy, laughter,\nand all your favorite things!", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#5D4037", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "from", type: "text", name: "From", x: 250, y: 600, text: "With love, Your Family ❤️", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#FF6F00", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const BIRTHDAY_CARD_2_ID = "birthday-card-02";
export const BIRTHDAY_CARD_2: ProductTemplateWithService = {
  id: BIRTHDAY_CARD_2_ID,
  service_id: null,
  title: "Birthday Card - Elegant Gold",
  slug: BIRTHDAY_CARD_2_ID,
  category: "birthday",
  thumbnail_url: "/template-images/birthday-card-02.png",
  editable_fields: ["headline", "name", "age", "message", "from", "photo"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 500,
    height: 700,
    background: "#1C1208",
    accent: "#D4AF37",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 500, h: 700, fill: "#1C1208", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "border-outer", type: "rect", name: "Border Outer", x: 12, y: 12, w: 476, h: 676, fill: "transparent", stroke: "#D4AF37", strokeWidth: 2, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "border-inner", type: "rect", name: "Border Inner", x: 20, y: 20, w: 460, h: 660, fill: "transparent", stroke: "#D4AF37", strokeWidth: 0.5, opacity: 0.5, locked: false, visible: true, rotation: 0 },
      { id: "corner-tl", type: "ellipse", name: "Corner TL", x: 12, y: 12, w: 40, h: 40, fill: "transparent", stroke: "#D4AF37", strokeWidth: 1.5, opacity: 0.6, locked: false, visible: true, rotation: 0 },
      { id: "corner-tr", type: "ellipse", name: "Corner TR", x: 448, y: 12, w: 40, h: 40, fill: "transparent", stroke: "#D4AF37", strokeWidth: 1.5, opacity: 0.6, locked: false, visible: true, rotation: 0 },
      { id: "corner-bl", type: "ellipse", name: "Corner BL", x: 12, y: 648, w: 40, h: 40, fill: "transparent", stroke: "#D4AF37", strokeWidth: 1.5, opacity: 0.6, locked: false, visible: true, rotation: 0 },
      { id: "corner-br", type: "ellipse", name: "Corner BR", x: 448, y: 648, w: 40, h: 40, fill: "transparent", stroke: "#D4AF37", strokeWidth: 1.5, opacity: 0.6, locked: false, visible: true, rotation: 0 },
      { id: "headline", type: "text", name: "Headline", x: 250, y: 80, text: "HAPPY BIRTHDAY", fontSize: 32, fontFamily: "'Palatino Linotype', Palatino, serif", fontWeight: "bold", fontStyle: "normal", fill: "#D4AF37", textAlign: "center", letterSpacing: 6, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "deco-line-top", type: "rect", name: "Deco Line Top", x: 80, y: 108, w: 340, h: 1, fill: "#D4AF37", stroke: null, opacity: 0.4, locked: false, visible: true, rotation: 0 },
      { id: "photo-frame", type: "ellipse", name: "Photo Frame", x: 155, y: 140, w: 190, h: 190, fill: "#2A1E0A", stroke: "#D4AF37", strokeWidth: 2.5, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "photo", type: "image", name: "Birthday Person Photo", x: 155, y: 140, w: 190, h: 190, src: null, placeholder: true, clipShape: "ellipse", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "name", type: "text", name: "Person Name", x: 250, y: 378, text: "Celebrating", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#C8A96E", textAlign: "center", letterSpacing: 3, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "person-name", type: "text", name: "Name", x: 250, y: 415, text: "Sunita Rai", fontSize: 38, fontFamily: "'Palatino Linotype', Palatino, serif", fontWeight: "normal", fontStyle: "italic", fill: "#D4AF37", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "age", type: "text", name: "Age", x: 250, y: 458, text: "Turning 30 · A Milestone Celebrated", fontSize: 12, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#C8A96E", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "deco-line-mid", type: "rect", name: "Deco Line Mid", x: 80, y: 480, w: 340, h: 1, fill: "#D4AF37", stroke: null, opacity: 0.3, locked: false, visible: true, rotation: 0 },
      { id: "message", type: "text", name: "Message", x: 250, y: 510, text: "May this special day bring you happiness\nbeyond measure and blessings without end.", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#C8A96E", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "from", type: "text", name: "From", x: 250, y: 618, text: "— With Warmest Wishes —", fontSize: 11, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#D4AF37", textAlign: "center", letterSpacing: 1, opacity: 0.8, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const BIRTHDAY_CARD_3_ID = "birthday-card-03";
export const BIRTHDAY_CARD_3: ProductTemplateWithService = {
  id: BIRTHDAY_CARD_3_ID,
  service_id: null,
  title: "Birthday Card - Kids Fun",
  slug: BIRTHDAY_CARD_3_ID,
  category: "birthday",
  thumbnail_url: "/template-images/birthday-card-03.png",
  editable_fields: ["headline", "name", "age", "message", "from", "photo"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 500,
    height: 700,
    background: "#E3F2FD",
    accent: "#F06292",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 500, h: 700, fill: "#E3F2FD", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "circle-big", type: "ellipse", name: "Big Circle Deco", x: -60, y: -60, w: 240, h: 240, fill: "#F48FB1", stroke: null, opacity: 0.25, locked: true, visible: true, rotation: 0 },
      { id: "circle-big2", type: "ellipse", name: "Big Circle Deco 2", x: 320, y: 500, w: 220, h: 220, fill: "#81D4FA", stroke: null, opacity: 0.25, locked: true, visible: true, rotation: 0 },
      { id: "star-1", type: "ellipse", name: "Star Deco 1", x: 50, y: 300, w: 20, h: 20, fill: "#FFD54F", stroke: null, opacity: 0.7, locked: true, visible: true, rotation: 0 },
      { id: "star-2", type: "ellipse", name: "Star Deco 2", x: 420, y: 150, w: 16, h: 16, fill: "#F06292", stroke: null, opacity: 0.7, locked: true, visible: true, rotation: 0 },
      { id: "star-3", type: "ellipse", name: "Star Deco 3", x: 440, y: 450, w: 12, h: 12, fill: "#AED581", stroke: null, opacity: 0.7, locked: true, visible: true, rotation: 0 },
      { id: "balloon-1", type: "ellipse", name: "Balloon 1", x: 60, y: 60, w: 60, h: 75, fill: "#F06292", stroke: "#E91E63", strokeWidth: 1, opacity: 0.85, locked: true, visible: true, rotation: -15 },
      { id: "balloon-2", type: "ellipse", name: "Balloon 2", x: 380, y: 50, w: 60, h: 75, fill: "#FFD54F", stroke: "#FFC107", strokeWidth: 1, opacity: 0.85, locked: true, visible: true, rotation: 15 },
      { id: "headline", type: "text", name: "Headline", x: 250, y: 175, text: "🎂 Happy Birthday! 🎂", fontSize: 32, fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive", fontWeight: "bold", fontStyle: "normal", fill: "#F06292", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "name", type: "text", name: "Person Name", x: 250, y: 235, text: "Little Aarav!", fontSize: 36, fontFamily: "'Comic Sans MS', cursive", fontWeight: "bold", fontStyle: "normal", fill: "#0288D1", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "photo-frame", type: "ellipse", name: "Photo Frame", x: 145, y: 280, w: 210, h: 210, fill: "#FFFFFF", stroke: "#F06292", strokeWidth: 4, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "photo", type: "image", name: "Birthday Child Photo", x: 145, y: 280, w: 210, h: 210, src: null, placeholder: true, clipShape: "ellipse", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "age", type: "text", name: "Age", x: 250, y: 515, text: "You are 5 years old today! 🌟", fontSize: 16, fontFamily: "'Comic Sans MS', cursive", fontWeight: "bold", fontStyle: "normal", fill: "#FF9800", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "message", type: "text", name: "Message", x: 250, y: 560, text: "Keep smiling, keep shining,\nyou're our superstar! ⭐", fontSize: 14, fontFamily: "'Comic Sans MS', cursive", fontWeight: "normal", fontStyle: "normal", fill: "#5D4037", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "from", type: "text", name: "From", x: 250, y: 640, text: "With lots of love! 💕", fontSize: 14, fontFamily: "'Comic Sans MS', cursive", fontWeight: "normal", fontStyle: "normal", fill: "#F06292", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};
