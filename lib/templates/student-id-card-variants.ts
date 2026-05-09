import type { ProductTemplateWithService } from "@/lib/supabase/queries";

export const STUDENT_ID_1_ID = "student-id-01";
export const STUDENT_ID_1: ProductTemplateWithService = {
  id: STUDENT_ID_1_ID,
  service_id: null,
  title: "Student ID - University Blue",
  slug: STUDENT_ID_1_ID,
  category: "student-id",
  thumbnail_url: "/template-images/student-id-01.png",
  editable_fields: ["school_name", "photo", "student_name", "student_id", "program", "year", "dob", "blood_group", "valid_until"],
  is_featured: true,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 300,
    height: 480,
    background: "#F5F7FA",
    accent: "#1565C0",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 300, h: 480, fill: "#F5F7FA", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "header", type: "rect", name: "Header Band", x: 0, y: 0, w: 300, h: 110, fill: "#1565C0", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "header-accent", type: "rect", name: "Header Accent", x: 0, y: 106, w: 300, h: 4, fill: "#FFD600", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "footer", type: "rect", name: "Footer Band", x: 0, y: 440, w: 300, h: 40, fill: "#1565C0", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "school-logo", type: "image", name: "School Logo", x: 16, y: 16, w: 60, h: 60, src: null, placeholder: true, clipShape: "rect", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "school-name", type: "text", name: "School Name", x: 165, y: 30, text: "Tribhuvan University", fontSize: 14, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFFFFF", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "id-label", type: "text", name: "ID Card Label", x: 165, y: 55, text: "STUDENT IDENTITY CARD", fontSize: 9, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#FFD600", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "photo-frame", type: "rect", name: "Photo Frame", x: 95, y: 130, w: 110, h: 130, fill: "#E8EAF6", stroke: "#1565C0", strokeWidth: 2, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "photo", type: "image", name: "Student Photo", x: 95, y: 130, w: 110, h: 130, src: null, placeholder: true, clipShape: "rect", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "student-name", type: "text", name: "Student Name", x: 150, y: 278, text: "Ram Bahadur Thapa", fontSize: 16, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#1A237E", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "program", type: "text", name: "Program", x: 150, y: 300, text: "B.Sc. Computer Science", fontSize: 11, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#1565C0", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "divider", type: "rect", name: "Divider", x: 20, y: 320, w: 260, h: 1, fill: "#90CAF9", stroke: null, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "label-id", type: "text", name: "Label: ID", x: 30, y: 338, text: "Student ID:", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#555555", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "student-id", type: "text", name: "Student ID Number", x: 130, y: 338, text: "077-BCS-001", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#1A1A1A", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "label-year", type: "text", name: "Label: Year", x: 30, y: 358, text: "Year:", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#555555", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "year", type: "text", name: "Year / Semester", x: 130, y: 358, text: "3rd Year", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#1A1A1A", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "label-dob", type: "text", name: "Label: DOB", x: 30, y: 378, text: "Date of Birth:", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#555555", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "dob", type: "text", name: "Date of Birth", x: 130, y: 378, text: "2002-04-15", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#1A1A1A", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "label-blood", type: "text", name: "Label: Blood", x: 30, y: 398, text: "Blood Group:", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#555555", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "blood-group", type: "text", name: "Blood Group", x: 130, y: 398, text: "O+", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#D32F2F", textAlign: "left", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "valid-until", type: "text", name: "Valid Until", x: 150, y: 455, text: "Valid Until: 2027-07-31", fontSize: 9, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#FFFFFF", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const STUDENT_ID_2_ID = "student-id-02";
export const STUDENT_ID_2: ProductTemplateWithService = {
  id: STUDENT_ID_2_ID,
  service_id: null,
  title: "Student ID - Modern Dark",
  slug: STUDENT_ID_2_ID,
  category: "student-id",
  thumbnail_url: "/template-images/student-id-02.png",
  editable_fields: ["school_name", "photo", "student_name", "student_id", "program", "year", "dob", "blood_group", "valid_until"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 300,
    height: 480,
    background: "#121212",
    accent: "#00E5FF",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 300, h: 480, fill: "#121212", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "top-glow", type: "rect", name: "Top Glow", x: 0, y: 0, w: 300, h: 3, fill: "#00E5FF", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "bottom-glow", type: "rect", name: "Bottom Glow", x: 0, y: 477, w: 300, h: 3, fill: "#00E5FF", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "border", type: "rect", name: "Card Border", x: 8, y: 8, w: 284, h: 464, fill: "transparent", stroke: "#00E5FF", strokeWidth: 0.5, opacity: 0.4, locked: false, visible: true, rotation: 0 },
      { id: "school-logo", type: "image", name: "School Logo", x: 20, y: 20, w: 50, h: 50, src: null, placeholder: true, clipShape: "ellipse", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "school-name", type: "text", name: "School Name", x: 160, y: 28, text: "Global Tech Institute", fontSize: 13, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFFFFF", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "id-label", type: "text", name: "ID Card Label", x: 160, y: 48, text: "STUDENT ID CARD", fontSize: 8, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#00E5FF", textAlign: "center", letterSpacing: 3, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "separator1", type: "rect", name: "Separator 1", x: 20, y: 78, w: 260, h: 1, fill: "#00E5FF", stroke: null, opacity: 0.3, locked: false, visible: true, rotation: 0 },
      { id: "photo-frame", type: "ellipse", name: "Photo Frame", x: 95, y: 100, w: 110, h: 110, fill: "#1E1E1E", stroke: "#00E5FF", strokeWidth: 1.5, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "photo", type: "image", name: "Student Photo", x: 95, y: 100, w: 110, h: 110, src: null, placeholder: true, clipShape: "ellipse", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "student-name", type: "text", name: "Student Name", x: 150, y: 230, text: "Sita Karki", fontSize: 18, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFFFFF", textAlign: "center", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "program", type: "text", name: "Program", x: 150, y: 254, text: "BBA – Marketing", fontSize: 11, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#00E5FF", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "separator2", type: "rect", name: "Separator 2", x: 20, y: 274, w: 260, h: 1, fill: "#00E5FF", stroke: null, opacity: 0.2, locked: false, visible: true, rotation: 0 },
      { id: "student-id", type: "text", name: "ID Number", x: 150, y: 292, text: "ID: GTI-2024-0092", fontSize: 11, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#CCCCCC", textAlign: "center", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "year", type: "text", name: "Year", x: 150, y: 312, text: "2nd Year  |  Semester IV", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#AAAAAA", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "dob", type: "text", name: "Date of Birth", x: 150, y: 332, text: "DOB: 2003-09-22", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#AAAAAA", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "blood-group", type: "text", name: "Blood Group", x: 150, y: 352, text: "Blood Group: A+", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#FF5252", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "barcode-placeholder", type: "rect", name: "Barcode Area", x: 75, y: 390, w: 150, h: 50, fill: "#1E1E1E", stroke: "#333333", strokeWidth: 1, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "valid-until", type: "text", name: "Valid Until", x: 150, y: 455, text: "Valid Until: 2026-12-31", fontSize: 9, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#666666", textAlign: "center", letterSpacing: 1, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};

export const STUDENT_ID_3_ID = "student-id-03";
export const STUDENT_ID_3: ProductTemplateWithService = {
  id: STUDENT_ID_3_ID,
  service_id: null,
  title: "Student ID - Green School",
  slug: STUDENT_ID_3_ID,
  category: "student-id",
  thumbnail_url: "/template-images/student-id-03.png",
  editable_fields: ["school_name", "photo", "student_name", "student_id", "program", "year", "dob", "blood_group", "valid_until"],
  is_featured: false,
  created_at: "2026-05-09T00:00:00.000Z",
  updated_at: "2026-05-09T00:00:00.000Z",
  template_json: {
    width: 300,
    height: 480,
    background: "#FFFFFF",
    accent: "#2E7D32",
    layers: [
      { id: "bg", type: "rect", name: "Background", x: 0, y: 0, w: 300, h: 480, fill: "#FFFFFF", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "header", type: "rect", name: "Header", x: 0, y: 0, w: 300, h: 90, fill: "#2E7D32", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "header-stripe", type: "rect", name: "Header Stripe", x: 0, y: 88, w: 300, h: 6, fill: "#A5D6A7", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "footer", type: "rect", name: "Footer", x: 0, y: 450, w: 300, h: 30, fill: "#2E7D32", stroke: null, strokeWidth: 0, opacity: 1, locked: true, visible: true, rotation: 0 },
      { id: "border", type: "rect", name: "Card Border", x: 0, y: 0, w: 300, h: 480, fill: "transparent", stroke: "#2E7D32", strokeWidth: 1.5, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "school-logo", type: "image", name: "School Logo", x: 16, y: 12, w: 65, h: 65, src: null, placeholder: true, clipShape: "ellipse", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "school-name", type: "text", name: "School Name", x: 170, y: 22, text: "Budhanilkantha School", fontSize: 13, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#FFFFFF", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "id-label", type: "text", name: "ID Card Label", x: 170, y: 45, text: "STUDENT IDENTITY CARD", fontSize: 7.5, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#A5D6A7", textAlign: "center", letterSpacing: 2, opacity: 1, locked: false, visible: true, rotation: 0, editable: false },
      { id: "photo-frame", type: "rect", name: "Photo Frame", x: 90, y: 112, w: 120, h: 140, fill: "#E8F5E9", stroke: "#2E7D32", strokeWidth: 2, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "photo", type: "image", name: "Student Photo", x: 90, y: 112, w: 120, h: 140, src: null, placeholder: true, clipShape: "rect", opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "student-name", type: "text", name: "Student Name", x: 150, y: 268, text: "Hari Prasad Sharma", fontSize: 15, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "normal", fill: "#1B5E20", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "program", type: "text", name: "Program", x: 150, y: 289, text: "Grade 11 – Science", fontSize: 11, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#2E7D32", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "divider", type: "rect", name: "Divider", x: 20, y: 308, w: 260, h: 1, fill: "#A5D6A7", stroke: null, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "row-id", type: "text", name: "Student ID", x: 150, y: 322, text: "Roll No: 11-SC-024", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#333333", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "row-year", type: "text", name: "Academic Year", x: 150, y: 340, text: "Academic Year: 2025–2026", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#333333", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "row-dob", type: "text", name: "DOB", x: 150, y: 358, text: "DOB: 2008-01-10", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#333333", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "row-blood", type: "text", name: "Blood Group", x: 150, y: 376, text: "Blood Group: B+", fontSize: 10, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#B71C1C", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true },
      { id: "barcode-area", type: "rect", name: "Barcode Area", x: 80, y: 400, w: 140, h: 40, fill: "#F1F8E9", stroke: "#A5D6A7", strokeWidth: 1, opacity: 1, locked: false, visible: true, rotation: 0 },
      { id: "valid-until", type: "text", name: "Valid Until", x: 150, y: 460, text: "Valid Until: July 2026", fontSize: 9, fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "normal", fontStyle: "normal", fill: "#FFFFFF", textAlign: "center", letterSpacing: 0, opacity: 1, locked: false, visible: true, rotation: 0, editable: true }
    ]
  }
};
