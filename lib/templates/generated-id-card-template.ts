import type { ProductTemplateWithService } from "@/lib/supabase/queries";

type Palette = {
  title: string;
  institution: string;
  subtitle: string;
  program: string;
  level: string;
  bg: string;
  header: string;
  accent: string;
  surface: string;
  ink: string;
  muted: string;
  soft: string;
  warning: string;
  photoSide: "left" | "right";
  logoShape: "circle" | "square";
};

const EDITABLE_FIELDS = [
  "logo",
  "institution_name",
  "institution_subtitle",
  "student_name",
  "student_id",
  "program",
  "level",
  "dob",
  "blood_group",
  "valid_until",
  "guardian_contact",
  "address",
  "signature_text",
  "photo"
];

const VARIANTS: Palette[] = [
  {
    title: "Generated Minimal Student ID Card",
    institution: "HIMALAYAN PUBLIC SCHOOL",
    subtitle: "Knowledge, Discipline, Service",
    program: "Computer Science",
    level: "Grade 10",
    bg: "#F8FAFC",
    header: "#102A43",
    accent: "#2DD4BF",
    surface: "#FFFFFF",
    ink: "#102A43",
    muted: "#64748B",
    soft: "#D9E2EC",
    warning: "#DC2626",
    photoSide: "left",
    logoShape: "circle"
  },
  {
    title: "Generated Civic Student ID Card",
    institution: "EVEREST MODEL ACADEMY",
    subtitle: "Smart campus identity",
    program: "Management",
    level: "Bachelor I",
    bg: "#F6F7F2",
    header: "#233D4D",
    accent: "#FCCA46",
    surface: "#FFFFFF",
    ink: "#1F2933",
    muted: "#667085",
    soft: "#E7E5DC",
    warning: "#B42318",
    photoSide: "right",
    logoShape: "square"
  },
  {
    title: "Generated Medical Student ID Card",
    institution: "KATHMANDU HEALTH COLLEGE",
    subtitle: "Clinical access credential",
    program: "Nursing",
    level: "Year 2",
    bg: "#F7FBFF",
    header: "#075985",
    accent: "#38BDF8",
    surface: "#FFFFFF",
    ink: "#0F172A",
    muted: "#5B6B7A",
    soft: "#DCEAF7",
    warning: "#E11D48",
    photoSide: "left",
    logoShape: "circle"
  },
  {
    title: "Generated Premium Student ID Card",
    institution: "LUMBINI INTERNATIONAL SCHOOL",
    subtitle: "Global learning community",
    program: "Science",
    level: "Grade 12",
    bg: "#FBF8F1",
    header: "#22223B",
    accent: "#C9A227",
    surface: "#FFFFFF",
    ink: "#22223B",
    muted: "#6C6A73",
    soft: "#EEE7D3",
    warning: "#9F1239",
    photoSide: "right",
    logoShape: "circle"
  },
  {
    title: "Generated Technical Student ID Card",
    institution: "NATIONAL TECH INSTITUTE",
    subtitle: "Engineering and applied skills",
    program: "Civil Engineering",
    level: "Diploma",
    bg: "#F4F7FB",
    header: "#111827",
    accent: "#60A5FA",
    surface: "#FFFFFF",
    ink: "#111827",
    muted: "#64748B",
    soft: "#E2E8F0",
    warning: "#EF4444",
    photoSide: "left",
    logoShape: "square"
  },
  {
    title: "Generated Arts Student ID Card",
    institution: "PATAN CREATIVE SCHOOL",
    subtitle: "Fine arts and design",
    program: "Visual Arts",
    level: "Studio 3",
    bg: "#FFF7ED",
    header: "#7C2D12",
    accent: "#FB923C",
    surface: "#FFFFFF",
    ink: "#431407",
    muted: "#7C6F64",
    soft: "#FED7AA",
    warning: "#BE123C",
    photoSide: "right",
    logoShape: "circle"
  },
  {
    title: "Generated Sports Student ID Card",
    institution: "VALLEY SPORTS ACADEMY",
    subtitle: "Training, teamwork, excellence",
    program: "Athletics",
    level: "Junior Squad",
    bg: "#F0FDF4",
    header: "#14532D",
    accent: "#22C55E",
    surface: "#FFFFFF",
    ink: "#052E16",
    muted: "#5D6F64",
    soft: "#DCFCE7",
    warning: "#DC2626",
    photoSide: "left",
    logoShape: "square"
  },
  {
    title: "Generated Montessori Student ID Card",
    institution: "SUNRISE MONTESSORI",
    subtitle: "Early learning identity",
    program: "Primary",
    level: "Level 4",
    bg: "#FFFBEB",
    header: "#854D0E",
    accent: "#F59E0B",
    surface: "#FFFFFF",
    ink: "#422006",
    muted: "#75624A",
    soft: "#FEF3C7",
    warning: "#C2410C",
    photoSide: "right",
    logoShape: "circle"
  },
  {
    title: "Generated Corporate Intern ID Card",
    institution: "PRINTNEPAL TRAINING CENTER",
    subtitle: "Internship and access pass",
    program: "Production Intern",
    level: "Batch A",
    bg: "#F8FAFC",
    header: "#0F172A",
    accent: "#A78BFA",
    surface: "#FFFFFF",
    ink: "#0F172A",
    muted: "#64748B",
    soft: "#EDE9FE",
    warning: "#DC2626",
    photoSide: "left",
    logoShape: "square"
  },
  {
    title: "Generated Library Student ID Card",
    institution: "CITY LEARNING LIBRARY",
    subtitle: "Reader membership credential",
    program: "Library Member",
    level: "Student",
    bg: "#F5F3FF",
    header: "#4C1D95",
    accent: "#C4B5FD",
    surface: "#FFFFFF",
    ink: "#2E1065",
    muted: "#6D5D86",
    soft: "#EDE9FE",
    warning: "#BE123C",
    photoSide: "right",
    logoShape: "circle"
  },
  {
    title: "Generated Clean School ID Card",
    institution: "BAGMATI CENTRAL SCHOOL",
    subtitle: "Official student credential",
    program: "General Studies",
    level: "Grade 8",
    bg: "#F7F7F4",
    header: "#1F2937",
    accent: "#14B8A6",
    surface: "#FFFFFF",
    ink: "#1F2937",
    muted: "#6B7280",
    soft: "#E5E7EB",
    warning: "#B91C1C",
    photoSide: "left",
    logoShape: "square"
  }
];

function templateId(index: number) {
  return `generated-student-id-card-${String(index + 1).padStart(2, "0")}`;
}

function rect(
  id: string,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  extra: Record<string, unknown> = {}
) {
  return { id, name, type: "rect", x, y, w, h, fill, visible: true, ...extra };
}

function text(
  id: string,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  fontSize: number,
  fill: string,
  extra: Record<string, unknown> = {}
) {
  return {
    id,
    name,
    type: "text",
    x,
    y,
    width,
    height,
    text: value,
    fontSize,
    fontFamily: "Inter, Arial, sans-serif",
    fontWeight: "800",
    fill,
    textAlign: "left",
    visible: true,
    ...extra
  };
}

function fieldText(
  id: string,
  label: string,
  x: number,
  y: number,
  width: number,
  value: string,
  palette: Palette,
  extra: Record<string, unknown> = {}
) {
  return [
    text(`${id}-label`, `${label} label`, x, y, width, 18, label, 13, palette.muted, {
      fontWeight: "700",
      editable: false,
      locked: true
    }),
    text(id, label, x, y + 30, width, 28, value, 20, palette.ink, {
      field: id.replace(/-/g, "_"),
      editable: true,
      locked: false,
      ...extra
    })
  ];
}

function buildTemplate(palette: Palette, index: number): ProductTemplateWithService {
  const id = templateId(index);
  const photoX = palette.photoSide === "left" ? 46 : 392;
  const infoX = palette.photoSide === "left" ? 288 : 46;
  const logoRadius = palette.logoShape === "circle" ? 46 : 18;
  const cardTitleX = palette.photoSide === "left" ? 284 : 356;

  return {
    id,
    service_id: null,
    title: palette.title,
    slug: id,
    category: "id-card",
    thumbnail_url: null,
    editable_fields: EDITABLE_FIELDS,
    is_featured: index < 4,
    created_at: "2026-05-14T00:00:00.000Z",
    updated_at: "2026-05-14T00:00:00.000Z",
    services: {
      title: "Student ID Card",
      slug: "student-id-card",
      category: "Cards"
    },
    template_json: {
      width: 640,
      height: 1010,
      background: palette.bg,
      accent: palette.accent,
      layers: [
        rect("background", "Card background", 0, 0, 640, 1010, palette.bg, { locked: true }),
        rect("header-panel", "Header panel", 0, 0, 640, 224, palette.header),
        rect("header-accent", "Header accent", 0, 212, 640, 14, palette.accent),
        rect("footer-band", "Footer band", 0, 948, 640, 62, palette.header),
        rect("logo-frame", "Logo frame", 44, 40, 92, 92, palette.surface, {
          type: palette.logoShape === "circle" ? "ellipse" : "rect",
          rx: logoRadius,
          ry: logoRadius,
          stroke: palette.accent,
          strokeWidth: 4
        }),
        {
          id: "logo",
          field: "logo",
          name: "Institution logo",
          type: "image",
          x: 56,
          y: 52,
          w: 68,
          h: 68,
          placeholder: true,
          clipShape: palette.logoShape === "circle" ? "ellipse" : "rect",
          editable: true,
          locked: false,
          visible: true
        },
        text("institution-name", "Institution name", 156, 58, 410, 40, palette.institution, 28, "#FFFFFF", {
          field: "institution_name",
          editable: true,
          locked: false
        }),
        text("institution-subtitle", "Institution subtitle", 158, 104, 360, 28, palette.subtitle, 17, palette.soft, {
          field: "institution_subtitle",
          fontWeight: "600",
          editable: true,
          locked: false
        }),
        rect("card-title-pill", "Card title pill", cardTitleX - 132, 148, 264, 42, palette.accent, { rx: 21, ry: 21 }),
        text("card-title", "Card title", cardTitleX, 175, 240, 24, "STUDENT ID CARD", 15, palette.header, {
          textAlign: "center",
          letterSpacing: 1.6,
          editable: false,
          locked: true
        }),
        rect("photo-shadow", "Photo shadow", photoX + 12, 270, 206, 252, palette.soft, { rx: 20, ry: 20, locked: true }),
        rect("photo-frame", "Photo frame", photoX, 258, 206, 252, palette.surface, {
          rx: 20,
          ry: 20,
          stroke: palette.soft,
          strokeWidth: 2
        }),
        {
          id: "photo",
          field: "photo",
          name: "Student photo",
          type: "image",
          x: photoX + 16,
          y: 274,
          w: 174,
          h: 220,
          placeholder: true,
          clipShape: "rect",
          editable: true,
          locked: false,
          visible: true
        },
        text("student-name-label", "Student name label", infoX, 272, 240, 18, "Student name", 14, palette.muted, {
          fontWeight: "700",
          editable: false,
          locked: true
        }),
        text("student-name", "Student name", infoX, 314, 298, 48, "Aarav Sharma", 34, palette.ink, {
          field: "student_name",
          fontWeight: "900",
          editable: true,
          locked: false
        }),
        ...fieldText("student-id", "Student ID", infoX, 378, 172, "HPS-2026-0142", palette, {
          fill: palette.header,
          letterSpacing: 0.4
        }),
        ...fieldText("valid-until", "Valid until", infoX + 184, 378, 132, "31 Dec 2026", palette),
        rect("details-card", "Details card", 42, 548, 556, 258, palette.surface, {
          rx: 22,
          ry: 22,
          stroke: palette.soft,
          strokeWidth: 2
        }),
        ...fieldText("program", "Program", 72, 596, 250, palette.program, palette),
        ...fieldText("level", "Level", 362, 596, 150, palette.level, palette),
        ...fieldText("dob", "DOB", 72, 668, 170, "01 Jan 2010", palette),
        ...fieldText("blood-group", "Blood", 288, 668, 88, "B+", palette, { fill: palette.warning, fontWeight: "900" }),
        ...fieldText("guardian-contact", "Contact", 402, 668, 150, "+977-9800000000", palette, { fontSize: 17 }),
        ...fieldText("address", "Address", 72, 740, 392, "Kathmandu, Nepal", palette, { fontSize: 19 }),
        {
          id: "signature-line",
          name: "Signature line",
          type: "line",
          x: 54,
          y: 876,
          w: 188,
          h: 0,
          stroke: palette.muted,
          strokeWidth: 2,
          visible: true
        },
        text("signature-text", "Signature label", 148, 905, 180, 18, "Authorized signature", 13, palette.muted, {
          field: "signature_text",
          textAlign: "center",
          fontWeight: "700",
          editable: true,
          locked: false
        }),
        rect("qr-box", "QR box", 488, 836, 96, 96, palette.surface, {
          rx: 10,
          ry: 10,
          stroke: palette.soft,
          strokeWidth: 2
        }),
        text("qr-label", "QR label", 536, 890, 88, 24, "QR", 22, palette.muted, {
          textAlign: "center",
          fontWeight: "900",
          editable: false,
          locked: true
        }),
        text("emergency-note", "Emergency note", 320, 986, 570, 20, "IF FOUND, PLEASE RETURN TO THE SCHOOL ADMINISTRATION OFFICE", 14, "#FFFFFF", {
          textAlign: "center",
          letterSpacing: 0.6,
          editable: false,
          locked: true
        })
      ]
    }
  };
}

export const GENERATED_ID_CARD_TEMPLATES = VARIANTS.map(buildTemplate);
export const GENERATED_ID_CARD_TEMPLATE = GENERATED_ID_CARD_TEMPLATES[0];
export const GENERATED_ID_CARD_TEMPLATE_ID = GENERATED_ID_CARD_TEMPLATE.id;
