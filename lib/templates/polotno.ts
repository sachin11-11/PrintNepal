import { resolveTemplateLayout, type TemplateCanvasObject, type TemplateCanvasTemplate } from "./layout";

type PolotnoElement = Record<string, unknown>;

function numeric(value: unknown, fallback: number) {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function firstFontFamily(fontFamily?: string) {
  return (fontFamily ?? "Inter").split(",")[0].replace(/['"]/g, "").trim() || "Inter";
}

function layerBox(layer: TemplateCanvasObject) {
  return {
    x: numeric(layer.left ?? layer.x, 0),
    y: numeric(layer.top ?? layer.y, 0),
    width: Math.max(1, numeric(layer.width ?? layer.w, layer.type === "line" ? 120 : 80)),
    height: Math.max(1, numeric(layer.height ?? layer.h, layer.type === "line" ? 2 : layer.type === "text" ? numeric(layer.fontSize, 18) * 1.4 : 80))
  };
}

function placeholderImage(width: number, height: number, label = "Upload image") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" rx="12" fill="#f1f5f9"/>
      <rect x="8" y="8" width="${Math.max(1, width - 16)}" height="${Math.max(1, height - 16)}" rx="10" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 8"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="14" fill="#64748b">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function baseElement(layer: TemplateCanvasObject, index: number) {
  const { x, y, width, height } = layerBox(layer);
  const locked = Boolean(layer.locked || layer.selectable === false);

  return {
    id: layer.id ?? `layer-${index}`,
    name: layer.name ?? layer.id ?? `Layer ${index + 1}`,
    x,
    y,
    width,
    height,
    rotation: numeric(layer.rotation ?? layer.angle, 0),
    opacity: numeric(layer.opacity, 1),
    visible: layer.visible ?? true,
    draggable: !locked,
    resizable: !locked,
    selectable: !locked,
    contentEditable: !locked && layer.editable !== false,
    styleEditable: !locked,
    removable: layer.id !== "bg" && !locked,
    showInExport: true,
    custom: {
      sourceId: layer.id,
      field: layer.field ?? null,
      role: layer.role ?? null,
      printNepalLayer: true
    }
  };
}

function transparentToUndefined(color?: string | null) {
  if (!color || color === "transparent") return "rgba(0,0,0,0)";
  return color;
}

function layerToPolotnoElement(layer: TemplateCanvasObject, index: number): PolotnoElement | null {
  const base = baseElement(layer, index);

  if (layer.type === "text") {
    return {
      ...base,
      type: "text",
      text: String(layer.text ?? "Text"),
      placeholder: String(layer.text ?? "Text"),
      fontSize: numeric(layer.fontSize, 18),
      fontFamily: firstFontFamily(layer.fontFamily),
      fontStyle: layer.fontStyle ?? "normal",
      fontWeight: layer.fontWeight ?? "normal",
      textDecoration: "none",
      textTransform: "none",
      fill: layer.fill ?? "#111111",
      align: layer.textAlign ?? "left",
      verticalAlign: "top",
      strokeWidth: 0,
      stroke: "rgba(0,0,0,0)",
      lineHeight: 1.2,
      letterSpacing: numeric(layer.letterSpacing, 0)
    };
  }

  if (layer.type === "image") {
    const { width, height } = layerBox(layer);

    return {
      ...base,
      type: "image",
      src: layer.src || placeholderImage(width, height, layer.field ? "Upload " + layer.field.replace(/_/g, " ") : "Upload image"),
      cropX: 0,
      cropY: 0,
      cropWidth: 1,
      cropHeight: 1,
      cornerRadius: layer.clipShape === "rect" ? numeric(layer.rx, 0) : 0,
      flipX: false,
      flipY: false,
      clipSrc: "",
      borderColor: layer.stroke ?? "rgba(0,0,0,0)",
      borderSize: numeric(layer.strokeWidth, 0),
      keepRatio: true,
      stretchEnabled: false
    };
  }

  if (layer.type === "line") {
    return {
      ...base,
      type: "line",
      height: Math.max(1, numeric(layer.height ?? layer.h, 1)),
      color: layer.stroke ?? layer.fill ?? "#111111",
      dash: [],
      startHead: "",
      endHead: ""
    };
  }

  if (layer.type === "rect" || layer.type === "ellipse" || layer.type === "circle") {
    return {
      ...base,
      type: "figure",
      subType: layer.type === "rect" ? "rect" : "circle",
      fill: transparentToUndefined(layer.fill),
      dash: [],
      strokeWidth: numeric(layer.strokeWidth, 0),
      stroke: layer.stroke ?? "rgba(0,0,0,0)",
      cornerRadius: layer.type === "rect" ? numeric(layer.rx ?? layer.ry, 0) : 0
    };
  }

  return null;
}

export function templateToPolotnoJSON(template: TemplateCanvasTemplate) {
  const layout = resolveTemplateLayout(template);
  const children = layout.objects
    .map((layer, index) => layerToPolotnoElement(layer, index))
    .filter(Boolean);

  return {
    width: layout.width,
    height: layout.height,
    unit: "px",
    dpi: 300,
    fonts: [],
    audios: [],
    pages: [
      {
        id: "page-1",
        width: "auto",
        height: "auto",
        background: layout.background,
        bleed: 0,
        duration: 5000,
        children
      }
    ]
  };
}
