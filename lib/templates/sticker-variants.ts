import type { ProductTemplateWithService } from "@/lib/supabase/queries";

export const STICKER_1_ID = "sticker-01";
export const STICKER_1: ProductTemplateWithService = {
  id: STICKER_1_ID,
  service_id: null,
  title: "Sticker - Mountain Adventure",
  slug: STICKER_1_ID,
  category: "sticker",
  thumbnail_url: "/template-images/sticker-01.png",
  editable_fields: ["main_text", "sub_text"],
  is_featured: true,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 400,
    height: 400,
    background: "#FFFFFF",
    accent: "#1565C0",
    layers: [
      { id: "sticker-outline", type: "ellipse", name: "Sticker Outline (White Edge)", x: 0, y: 0, w: 400, h: 400, fill: "#FFFFFF", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bg", type: "ellipse", name: "Background Circle", x: 14, y: 14, w: 372, h: 372, fill: "#1565C0", stroke: "#0D47A1", strokeWidth: 3, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "sky", type: "ellipse", name: "Sky Area", x: 14, y: 14, w: 372, h: 200, fill: "#1976D2", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "mountain-1", type: "rect", name: "Mountain 1", x: 60, y: 200, w: 140, h: 200, fill: "#0D47A1", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "mountain-2", type: "rect", name: "Mountain 2", x: 160, y: 170, w: 160, h: 220, fill: "#1565C0", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "snow-cap", type: "ellipse", name: "Snow Cap", x: 195, y: 155, w: 90, h: 50, fill: "#FFFFFF", stroke: null, opacity: 0.9, locked: true, visible: true, rotation: 0 },
      { id: "border-inner", type: "ellipse", name: "Inner Border", x: 22, y: 22, w: 356, h: 356, fill: "transparent", stroke: "#FFFFFF", strokeWidth: 1.5, opacity: 0.4, locked: false, visible: true, rotation: 0 },
      { id: "main-text", type: "text", name: "Main Text", x: 200, y: 88, text: "EXPLORE MORE", fontSize: 28, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFFFFF", textAlign: "center", letterSpacing: 3, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "sub-text", type: "text", name: "Sub Text", x: 200, y: 348, text: "Adventure Awaits · Nepal", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#BBDEFB", textAlign: "center", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const STICKER_2_ID = "sticker-02";
export const STICKER_2: ProductTemplateWithService = {
  id: STICKER_2_ID,
  service_id: null,
  title: "Sticker - Cute Animal",
  slug: STICKER_2_ID,
  category: "sticker",
  thumbnail_url: "/template-images/sticker-02.png",
  editable_fields: ["main_text", "sub_text"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 400,
    height: 400,
    background: "#FFFFFF",
    accent: "#FF7043",
    layers: [
      { id: "sticker-outline", type: "ellipse", name: "Sticker Outline (White Edge)", x: 0, y: 0, w: 400, h: 400, fill: "#FFFFFF", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bg", type: "ellipse", name: "Background Circle", x: 10, y: 10, w: 380, h: 380, fill: "#FFF3E0", stroke: "#FF7043", strokeWidth: 4, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "face-body", type: "ellipse", name: "Face", x: 100, y: 90, w: 200, h: 200, fill: "#FFCC80", stroke: "#FF8F00", strokeWidth: 2, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "ear-left", type: "ellipse", name: "Ear Left", x: 90, y: 80, w: 55, h: 55, fill: "#FFB74D", stroke: "#FF8F00", strokeWidth: 2, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "ear-right", type: "ellipse", name: "Ear Right", x: 255, y: 80, w: 55, h: 55, fill: "#FFB74D", stroke: "#FF8F00", strokeWidth: 2, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "eye-left", type: "ellipse", name: "Eye Left", x: 145, y: 160, w: 28, h: 28, fill: "#4E342E", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "eye-right", type: "ellipse", name: "Eye Right", x: 227, y: 160, w: 28, h: 28, fill: "#4E342E", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "eye-shine-l", type: "ellipse", name: "Eye Shine L", x: 154, y: 165, w: 9, h: 9, fill: "#FFFFFF", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "eye-shine-r", type: "ellipse", name: "Eye Shine R", x: 236, y: 165, w: 9, h: 9, fill: "#FFFFFF", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "nose", type: "ellipse", name: "Nose", x: 185, y: 202, w: 30, h: 20, fill: "#E64A19", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "cheek-left", type: "ellipse", name: "Cheek Left", x: 120, y: 200, w: 45, h: 30, fill: "#FF8A65", stroke: null, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "cheek-right", type: "ellipse", name: "Cheek Right", x: 235, y: 200, w: 45, h: 30, fill: "#FF8A65", stroke: null, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "main-text", type: "text", name: "Main Text", x: 200, y: 322, text: "So Cute! 🐾", fontSize: 28, fontFamily: "'Comic Sans MS', cursive", fontWeight: "bold", fontStyle: "normal", fill: "#FF7043", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "sub-text", type: "text", name: "Sub Text", x: 200, y: 360, text: "Best Friend Forever", fontSize: 13, fontFamily: "'Comic Sans MS', cursive", fontWeight: "normal", fontStyle: "normal", fill: "#8D6E63", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const STICKER_3_ID = "sticker-03";
export const STICKER_3: ProductTemplateWithService = {
  id: STICKER_3_ID,
  service_id: null,
  title: "Sticker - Motivational Quote",
  slug: STICKER_3_ID,
  category: "sticker",
  thumbnail_url: "/template-images/sticker-03.png",
  editable_fields: ["main_text", "sub_text"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 400,
    height: 400,
    background: "#FFFFFF",
    accent: "#7B1FA2",
    layers: [
      { id: "sticker-outline", type: "ellipse", name: "Sticker Outline (White Edge)", x: 0, y: 0, w: 400, h: 400, fill: "#FFFFFF", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bg", type: "ellipse", name: "Background Circle", x: 10, y: 10, w: 380, h: 380, fill: "#4A148C", stroke: "#7B1FA2", strokeWidth: 4, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bg-inner", type: "ellipse", name: "Inner Gradient Feel", x: 30, y: 30, w: 340, h: 340, fill: "#6A1B9A", stroke: null, opacity: 0.4, locked: true, visible: true, rotation: 0 },
      { id: "deco-circle-1", type: "ellipse", name: "Deco Circle 1", x: 20, y: 20, w: 360, h: 360, fill: "transparent", stroke: "#CE93D8", strokeWidth: 1, opacity: 0.4, locked: false, visible: true, rotation: 0 },
      { id: "deco-circle-2", type: "ellipse", name: "Deco Circle 2", x: 35, y: 35, w: 330, h: 330, fill: "transparent", stroke: "#CE93D8", strokeWidth: 0.5, opacity: 0.2, locked: false, visible: true, rotation: 0 },
      { id: "star-deco-1", type: "ellipse", name: "Star Deco 1", x: 60, y: 70, w: 14, h: 14, fill: "#F3E5F5", stroke: null, opacity: 0.6, locked: true, visible: true, rotation: 0 },
      { id: "star-deco-2", type: "ellipse", name: "Star Deco 2", x: 310, y: 60, w: 10, h: 10, fill: "#F3E5F5", stroke: null, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "star-deco-3", type: "ellipse", name: "Star Deco 3", x: 340, y: 300, w: 12, h: 12, fill: "#F3E5F5", stroke: null, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "star-deco-4", type: "ellipse", name: "Star Deco 4", x: 50, y: 310, w: 10, h: 10, fill: "#F3E5F5", stroke: null, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "quote-mark-top", type: "text", name: "Quote Mark Top", x: 110, y: 100, text: "❝", fontSize: 50, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#CE93D8", textAlign: "left", letterSpacing: 0, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "main-text", type: "text", name: "Main Text", x: 200, y: 190, text: "Dream Big.\nStay Bold.", fontSize: 34, fontFamily: "Georgia, serif", fontWeight: "bold", fontStyle: "italic", fill: "#FFFFFF", textAlign: "center", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "quote-mark-bot", type: "text", name: "Quote Mark Bottom", x: 280, y: 265, text: "❞", fontSize: 50, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "normal", fill: "#CE93D8", textAlign: "left", letterSpacing: 0, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "sub-text", type: "text", name: "Sub Text", x: 200, y: 340, text: "You got this ✨", fontSize: 16, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#CE93D8", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};
