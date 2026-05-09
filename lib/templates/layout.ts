export type TemplateCanvasObject = {
  type?: string;
  field?: string;
  role?: "accent" | "placeholder" | "base";
  id?: string;
  name?: string;
  text?: string;
  src?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  minWidth?: number;
  minHeight?: number;
  radius?: number;
  rx?: number;
  ry?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: "left" | "center" | "right";
  letterSpacing?: number;
  angle?: number;
  rotation?: number;
  clipShape?: "ellipse" | "rect";
  placeholder?: boolean;
  editable?: boolean;
  visible?: boolean;
  selectable?: boolean;
  locked?: boolean;
};

export type TemplateCanvasLayout = {
  width: number;
  height: number;
  minX: number;
  minY: number;
  background: string;
  accent?: string | null;
  objects: TemplateCanvasObject[];
};

export type TemplateCanvasTemplate = {
  width?: number;
  height?: number;
  background?: string;
  accent?: string;
  objects?: TemplateCanvasObject[];
  layers?: TemplateCanvasObject[];
};

function numeric(value: unknown, fallback: number) {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback;
}

function estimateTextWidth(object: TemplateCanvasObject) {
  const fontSize = numeric(object.fontSize, 18);
  const lines = String(object.text ?? "").split("\n");
  const longestLine = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const spacing = typeof object.letterSpacing === "number" ? object.letterSpacing : 0;
  const roughWidth = longestLine * fontSize * 0.62 + Math.max(0, longestLine - 1) * spacing * 0.08 + 12;

  return Math.max(numeric(object.minWidth, 0), Math.ceil(roughWidth));
}

function estimateTextHeight(object: TemplateCanvasObject) {
  const fontSize = numeric(object.fontSize, 18);
  const lines = String(object.text ?? "").split("\n").length || 1;

  return Math.max(numeric(object.minHeight, 0), Math.ceil(lines * fontSize * 1.45 + 8));
}

function normalizedObject(object: TemplateCanvasObject): TemplateCanvasObject {
  const width = object.type === "text"
    ? numeric(object.width ?? object.w, estimateTextWidth(object))
    : numeric(object.width ?? object.w, 0);
  const height = object.type === "text"
    ? numeric(object.height ?? object.h, estimateTextHeight(object))
    : numeric(object.height ?? object.h, 0);
  const anchorX = numeric(object.x ?? object.left, 0);
  const top = numeric(object.y ?? object.top, 0);
  const left = object.type === "text"
    ? (object.textAlign === "center"
      ? anchorX - width / 2
      : object.textAlign === "right"
        ? anchorX - width
        : anchorX)
    : numeric(object.left ?? object.x, 0);
  const rotation = typeof object.rotation === "number" ? object.rotation : object.angle;
  const visible = object.visible ?? true;

  return {
    ...object,
    left,
    top,
    width,
    height,
    angle: rotation,
    visible,
    selectable: object.selectable ?? !object.locked
  };
}

function objectBounds(object: TemplateCanvasObject) {
  const left = numeric(object.left ?? object.x, 0);
  const top = numeric(object.top ?? object.y, 0);

  if (object.type === "circle" || object.type === "ellipse") {
    const radius = numeric(object.radius, 0);
    const width = numeric(object.width ?? object.w, radius * 2);
    const height = numeric(object.height ?? object.h, radius * 2);
    return {
      minX: left,
      minY: top,
      maxX: left + width,
      maxY: top + height
    };
  }

  if (object.type === "line") {
    const width = numeric(object.width ?? object.w, 0);
    const height = numeric(object.height ?? object.h, 0);
    return {
      minX: Math.min(left, left + width),
      minY: Math.min(top, top + height),
      maxX: Math.max(left, left + width),
      maxY: Math.max(top, top + height)
    };
  }

  const width = numeric(object.width ?? object.w, 0);
  const height = numeric(
    object.height ?? object.h,
    object.type === "text" ? Math.max(numeric(object.minHeight, 0), numeric(object.fontSize, 18) * 1.5) : 0
  );

  return {
    minX: left,
    minY: top,
    maxX: left + width,
    maxY: top + height
  };
}

export function resolveTemplateLayout(template: TemplateCanvasTemplate): TemplateCanvasLayout {
  const rawObjects = Array.isArray(template.layers) ? template.layers : Array.isArray(template.objects) ? template.objects : [];
  const objects = rawObjects.map(normalizedObject);
  const explicitWidth = numeric(template.width, 0);
  const explicitHeight = numeric(template.height, 0);

  let minX = 0;
  let minY = 0;
  let maxX = explicitWidth;
  let maxY = explicitHeight;

  if (objects.length > 0) {
    minX = Number.POSITIVE_INFINITY;
    minY = Number.POSITIVE_INFINITY;
    maxX = 0;
    maxY = 0;

    for (const object of objects) {
      const bounds = objectBounds(object);
      minX = Math.min(minX, bounds.minX);
      minY = Math.min(minY, bounds.minY);
      maxX = Math.max(maxX, bounds.maxX);
      maxY = Math.max(maxY, bounds.maxY);
    }
  }

  const width = Math.max(explicitWidth || 0, Math.ceil(maxX - minX), 320);
  const height = Math.max(explicitHeight || 0, Math.ceil(maxY - minY), 320);

  return {
    width,
    height,
    minX: Number.isFinite(minX) ? Math.min(0, minX) : 0,
    minY: Number.isFinite(minY) ? Math.min(0, minY) : 0,
    background: template.background ?? "#ffffff",
    accent: template.accent,
    objects
  };
}
