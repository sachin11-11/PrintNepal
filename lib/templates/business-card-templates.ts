import type { ProductTemplateWithService } from "@/lib/supabase/queries";

export const BUSINESS_CARD_1_ID = "business-card-01";
export const BUSINESS_CARD_1: ProductTemplateWithService = {
  id: BUSINESS_CARD_1_ID,
  service_id: null,
  title: "Business Card - Corporate Navy",
  slug: BUSINESS_CARD_1_ID,
  category: "business",
  thumbnail_url: "/template-images/business-card-01.png",
  editable_fields: ["name", "title", "company", "email", "phone", "website", "logo"],
  is_featured: true,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 350,
    height: 200,
    background: "#0D1B2A",
    accent: "#4FC3F7",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 350, h: 200, fill: "#0D1B2A", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "accent-bar", type: "rect", name: "Left Accent Bar", x: 0, y: 0, w: 6, h: 200, fill: "#4FC3F7", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "accent-line", type: "rect", name: "Bottom Line", x: 24, y: 175, w: 302, h: 1, fill: "#4FC3F7", stroke: null, strokeWidth: 0, opacity: 0.4, locked: false, visible: true, rotation: 0 },
      { id: "logo", type: "image", name: "Company Logo", x: 270, y: 20, w: 60, h: 60, src: null, placeholder: true, clipShape: "rect", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "name", type: "text", name: "Full Name", x: 24, y: 55, text: "Alex Johnson", fontSize: 22, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFFFFF", textAlign: "left", letterSpacing: 0.5, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "title", type: "text", name: "Job Title", x: 24, y: 82, text: "Senior Product Manager", fontSize: 11, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#4FC3F7", textAlign: "left", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "company", type: "text", name: "Company Name", x: 24, y: 98, text: "TechCorp Solutions Pvt. Ltd.", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#8BAFC5", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "email", type: "text", name: "Email", x: 24, y: 135, text: "alex@techcorp.com", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#CCDDEE", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "phone", type: "text", name: "Phone", x: 24, y: 152, text: "+977-9800000001", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#CCDDEE", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "website", type: "text", name: "Website", x: 24, y: 183, text: "www.techcorp.com", fontSize: 9, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#8BAFC5", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const BUSINESS_CARD_2_ID = "business-card-02";
export const BUSINESS_CARD_2: ProductTemplateWithService = {
  id: BUSINESS_CARD_2_ID,
  service_id: null,
  title: "Business Card - Minimal White",
  slug: BUSINESS_CARD_2_ID,
  category: "business",
  thumbnail_url: "/template-images/business-card-02.png",
  editable_fields: ["name", "title", "company", "email", "phone", "website", "logo"],
  is_featured: true,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 350,
    height: 200,
    background: "#FFFFFF",
    accent: "#1A1A1A",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 350, h: 200, fill: "#FFFFFF", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "top-bar", type: "rect", name: "Top Black Bar", x: 0, y: 0, w: 350, h: 8, fill: "#1A1A1A", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bottom-bar", type: "rect", name: "Bottom Black Bar", x: 0, y: 192, w: 350, h: 8, fill: "#1A1A1A", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "logo", type: "image", name: "Company Logo", x: 270, y: 24, w: 56, h: 56, src: null, placeholder: true, clipShape: "rect", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "name", type: "text", name: "Full Name", x: 24, y: 40, text: "Sarah Mitchell", fontSize: 24, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: "normal", fontStyle: "normal", fill: "#1A1A1A", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "title", type: "text", name: "Job Title", x: 24, y: 70, text: "Creative Director", fontSize: 11, fontFamily: "Georgia, serif", fontWeight: "normal", fontStyle: "italic", fill: "#555555", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "separator", type: "rect", name: "Separator", x: 24, y: 100, w: 60, h: 1, fill: "#1A1A1A", stroke: null, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "company", type: "text", name: "Company Name", x: 24, y: 115, text: "Studio Black & White", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#333333", textAlign: "left", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "email", type: "text", name: "Email", x: 24, y: 142, text: "sarah@studiobw.com", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#444444", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "phone", type: "text", name: "Phone", x: 24, y: 158, text: "+977-9811111111", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#444444", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "website", type: "text", name: "Website", x: 24, y: 174, text: "studiobw.com", fontSize: 9, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#888888", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const BUSINESS_CARD_3_ID = "business-card-03";
export const BUSINESS_CARD_3: ProductTemplateWithService = {
  id: BUSINESS_CARD_3_ID,
  service_id: null,
  title: "Business Card - Gradient Sunset",
  slug: BUSINESS_CARD_3_ID,
  category: "business",
  thumbnail_url: "/template-images/business-card-03.png",
  editable_fields: ["name", "title", "company", "email", "phone", "website", "logo"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 350,
    height: 200,
    background: "#FF6B35",
    accent: "#FFFFFF",
    layers: [
      { id: "bg", type: "rect", name: "Background Gradient Base", x: 0, y: 0, w: 350, h: 200, fill: "#FF6B35", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bg-overlay", type: "rect", name: "Gradient Overlay", x: 0, y: 0, w: 350, h: 200, fill: "#C94082", stroke: null, strokeWidth: 0, opacity: 0.45, locked: true, visible: true, rotation: 0 },
      { id: "circle-deco", type: "ellipse", name: "Decorative Circle", x: 220, y: -40, w: 200, h: 200, fill: "#FFFFFF", stroke: null, strokeWidth: 0, opacity: 0.06, locked: true, visible: true, rotation: 0 },
      { id: "circle-deco2", type: "ellipse", name: "Decorative Circle 2", x: 260, y: 80, w: 140, h: 140, fill: "#FFFFFF", stroke: null, strokeWidth: 0, opacity: 0.06, locked: true, visible: true, rotation: 0 },
      { id: "logo", type: "image", name: "Company Logo", x: 275, y: 20, w: 55, h: 55, src: null, placeholder: true, clipShape: "ellipse", opacity: 0.9, locked: false, visible: true, rotation: 0, editable: true },
      { id: "name", type: "text", name: "Full Name", x: 24, y: 50, text: "Riya Sharma", fontSize: 26, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFFFFF", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "title", type: "text", name: "Job Title", x: 24, y: 82, text: "Brand Strategist", fontSize: 11, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "rgba(255,255,255,0.85)", textAlign: "left", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "company", type: "text", name: "Company Name", x: 24, y: 100, text: "Vivid Creative Agency", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "rgba(255,255,255,0.7)", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "separator", type: "rect", name: "Separator", x: 24, y: 125, w: 200, h: 0.8, fill: "#FFFFFF", stroke: null, opacity: 0.3, locked: false, visible: true, rotation: 0 },
      { id: "email", type: "text", name: "Email", x: 24, y: 140, text: "riya@vividcreative.com", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#FFFFFF", textAlign: "left", letterSpacing: 0, opacity: 0.9, locked: false, visible: true, rotation: 0, editable: true },
      { id: "phone", type: "text", name: "Phone", x: 24, y: 158, text: "+977-9822222222", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#FFFFFF", textAlign: "left", letterSpacing: 0, opacity: 0.9, locked: false, visible: true, rotation: 0, editable: true },
      { id: "website", type: "text", name: "Website", x: 24, y: 176, text: "vividcreative.com", fontSize: 9, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "rgba(255,255,255,0.7)", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};
