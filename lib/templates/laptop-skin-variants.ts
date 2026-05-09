import type { ProductTemplateWithService } from "@/lib/supabase/queries";

export const LAPTOP_SKIN_1_ID = "laptop-skin-01";
export const LAPTOP_SKIN_1: ProductTemplateWithService = {
  id: LAPTOP_SKIN_1_ID,
  service_id: null,
  title: "Laptop Skin - Galaxy Space",
  slug: LAPTOP_SKIN_1_ID,
  category: "laptop-skin",
  thumbnail_url: "/template-images/laptop-skin-01.png",
  editable_fields: ["background_image", "main_text", "sub_text"],
  is_featured: true,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 1400,
    height: 960,
    background: "#080820",
    accent: "#7C4DFF",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 1400, h: 960, fill: "#080820", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "nebula-1", type: "ellipse", name: "Nebula 1", x: 0, y: 0, w: 700, h: 500, fill: "#3D0066", stroke: null, opacity: 0.4, locked: true, visible: true, rotation: -20 },
      { id: "nebula-2", type: "ellipse", name: "Nebula 2", x: 700, y: 400, w: 800, h: 600, fill: "#000D6B", stroke: null, opacity: 0.5, locked: true, visible: true, rotation: 10 },
      { id: "nebula-3", type: "ellipse", name: "Nebula 3", x: 300, y: 600, w: 600, h: 400, fill: "#0D47A1", stroke: null, opacity: 0.3, locked: true, visible: true, rotation: 0 },
      { id: "star-1", type: "ellipse", name: "Star 1", x: 100, y: 80, w: 4, h: 4, fill: "#FFFFFF", stroke: null, opacity: 0.9, locked: true, visible: true, rotation: 0 },
      { id: "star-2", type: "ellipse", name: "Star 2", x: 400, y: 200, w: 3, h: 3, fill: "#FFFFFF", stroke: null, opacity: 0.7, locked: true, visible: true, rotation: 0 },
      { id: "star-3", type: "ellipse", name: "Star 3", x: 900, y: 100, w: 5, h: 5, fill: "#FFFFFF", stroke: null, opacity: 0.8, locked: true, visible: true, rotation: 0 },
      { id: "star-4", type: "ellipse", name: "Star 4", x: 1200, y: 300, w: 3, h: 3, fill: "#FFFFFF", stroke: null, opacity: 0.6, locked: true, visible: true, rotation: 0 },
      { id: "star-5", type: "ellipse", name: "Star 5", x: 600, y: 700, w: 4, h: 4, fill: "#FFFFFF", stroke: null, opacity: 0.8, locked: true, visible: true, rotation: 0 },
      { id: "star-6", type: "ellipse", name: "Star 6", x: 1300, y: 800, w: 3, h: 3, fill: "#FFFFFF", stroke: null, opacity: 0.7, locked: true, visible: true, rotation: 0 },
      { id: "planet", type: "ellipse", name: "Planet", x: 950, y: 150, w: 220, h: 220, fill: "#4A148C", stroke: "#7C4DFF", strokeWidth: 3, opacity: 0.85, locked: false, visible: true, rotation: 0 },
      { id: "planet-ring", type: "ellipse", name: "Planet Ring", x: 880, y: 235, w: 360, h: 50, fill: "transparent", stroke: "#9C27B0", strokeWidth: 8, opacity: 0.5, locked: false, visible: true, rotation: -15 },
      { id: "main-text", type: "text", name: "Main Text", x: 500, y: 440, text: "EXPLORE THE UNIVERSE", fontSize: 72, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFFFFF", textAlign: "center", letterSpacing: 8, opacity: 0.9, locked: false, visible: true, rotation: 0, editable: true },
      { id: "sub-text", type: "text", name: "Sub Text", x: 500, y: 540, text: "∞  Beyond the Stars  ∞", fontSize: 28, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#B39DDB", textAlign: "center", letterSpacing: 4, opacity: 0.8, locked: false, visible: true, rotation: 0, editable: true },
      { id: "camera-cutout", type: "ellipse", name: "Camera Cutout", x: 678, y: 18, w: 44, h: 44, fill: "#080820", stroke: "#333366", strokeWidth: 1, opacity: 1, locked: true, visible: true, rotation: 0 }
    ]
  }
};

export const LAPTOP_SKIN_2_ID = "laptop-skin-02";
export const LAPTOP_SKIN_2: ProductTemplateWithService = {
  id: LAPTOP_SKIN_2_ID,
  service_id: null,
  title: "Laptop Skin - Tropical Jungle",
  slug: LAPTOP_SKIN_2_ID,
  category: "laptop-skin",
  thumbnail_url: "/template-images/laptop-skin-02.png",
  editable_fields: ["background_image", "main_text", "sub_text"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 1400,
    height: 960,
    background: "#1B5E20",
    accent: "#FFEB3B",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 1400, h: 960, fill: "#1B5E20", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bg-overlay", type: "rect", name: "Gradient Overlay", x: 0, y: 0, w: 1400, h: 960, fill: "#0A3D0A", stroke: null, opacity: 0.35, locked: true, visible: true, rotation: 0 },
      { id: "leaf-1", type: "ellipse", name: "Leaf 1", x: -100, y: -50, w: 500, h: 300, fill: "#2E7D32", stroke: "#1B5E20", strokeWidth: 2, opacity: 0.9, locked: true, visible: true, rotation: 30 },
      { id: "leaf-2", type: "ellipse", name: "Leaf 2", x: 1100, y: -60, w: 450, h: 280, fill: "#388E3C", stroke: "#1B5E20", strokeWidth: 2, opacity: 0.9, locked: true, visible: true, rotation: -25 },
      { id: "leaf-3", type: "ellipse", name: "Leaf 3", x: -80, y: 700, w: 400, h: 250, fill: "#43A047", stroke: "#2E7D32", strokeWidth: 2, opacity: 0.8, locked: true, visible: true, rotation: -15 },
      { id: "leaf-4", type: "ellipse", name: "Leaf 4", x: 1050, y: 680, w: 420, h: 260, fill: "#2E7D32", stroke: "#1B5E20", strokeWidth: 2, opacity: 0.8, locked: true, visible: true, rotation: 20 },
      { id: "sun-glow", type: "ellipse", name: "Sun Glow", x: 530, y: 200, w: 340, h: 340, fill: "#FFEE58", stroke: null, opacity: 0.12, locked: true, visible: true, rotation: 0 },
      { id: "sun", type: "ellipse", name: "Sun", x: 620, y: 290, w: 160, h: 160, fill: "#FFEE58", stroke: "#FDD835", strokeWidth: 2, opacity: 0.75, locked: false, visible: true, rotation: 0 },
      { id: "main-text", type: "text", name: "Main Text", x: 700, y: 560, text: "INTO THE WILD", fontSize: 88, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFEB3B", textAlign: "center", letterSpacing: 6, opacity: 0.95, locked: false, visible: true, rotation: 0, editable: true },
      { id: "sub-text", type: "text", name: "Sub Text", x: 700, y: 665, text: "Nature is calling — answer it.", fontSize: 32, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#A5D6A7", textAlign: "center", letterSpacing: 2, opacity: 0.85, locked: false, visible: true, rotation: 0, editable: true },
      { id: "camera-cutout", type: "ellipse", name: "Camera Cutout", x: 678, y: 18, w: 44, h: 44, fill: "#1B5E20", stroke: "#2E7D32", strokeWidth: 1, opacity: 1, locked: true, visible: true, rotation: 0 }
    ]
  }
};

export const LAPTOP_SKIN_3_ID = "laptop-skin-03";
export const LAPTOP_SKIN_3: ProductTemplateWithService = {
  id: LAPTOP_SKIN_3_ID,
  service_id: null,
  title: "Laptop Skin - Abstract Geometry",
  slug: LAPTOP_SKIN_3_ID,
  category: "laptop-skin",
  thumbnail_url: "/template-images/laptop-skin-03.png",
  editable_fields: ["background_image", "main_text", "sub_text"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 1400,
    height: 960,
    background: "#FAFAFA",
    accent: "#FF3D00",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 1400, h: 960, fill: "#FAFAFA", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "geo-rect-1", type: "rect", name: "Geo Rect 1", x: 0, y: 0, w: 350, h: 960, fill: "#FF3D00", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "geo-rect-2", type: "rect", name: "Geo Rect 2", x: 330, y: 0, w: 30, h: 960, fill: "#FF6D00", stroke: null, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "geo-rect-3", type: "rect", name: "Geo Rect 3", x: 1050, y: 0, w: 350, h: 960, fill: "#212121", stroke: null, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "geo-rect-4", type: "rect", name: "Geo Rect 4", x: 1040, y: 0, w: 30, h: 960, fill: "#424242", stroke: null, opacity: 0.5, locked: true, visible: true, rotation: 0 },
      { id: "geo-circle-1", type: "ellipse", name: "Geo Circle 1", x: 0, y: 350, w: 350, h: 350, fill: "#BF360C", stroke: null, opacity: 0.8, locked: true, visible: true, rotation: 0 },
      { id: "geo-circle-2", type: "ellipse", name: "Geo Circle 2", x: 1050, y: 250, w: 350, h: 350, fill: "#FAFAFA", stroke: null, opacity: 0.06, locked: true, visible: true, rotation: 0 },
      { id: "main-text", type: "text", name: "Main Text", x: 700, y: 390, text: "DESIGN.\nCREATE.\nINSPIRE.", fontSize: 80, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#212121", textAlign: "center", letterSpacing: 4, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "sub-text", type: "text", name: "Sub Text", x: 700, y: 680, text: "Your ideas. Your canvas.", fontSize: 28, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#757575", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "accent-bar", type: "rect", name: "Accent Bar", x: 550, y: 725, w: 300, h: 4, fill: "#FF3D00", stroke: null, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "camera-cutout", type: "ellipse", name: "Camera Cutout", x: 678, y: 18, w: 44, h: 44, fill: "#FAFAFA", stroke: "#E0E0E0", strokeWidth: 1, opacity: 1, locked: true, visible: true, rotation: 0 }
    ]
  }
};
