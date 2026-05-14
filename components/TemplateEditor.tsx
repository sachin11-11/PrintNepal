"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { resolveTemplateLayout, type TemplateCanvasObject, type TemplateCanvasTemplate } from "@/lib/templates/layout";

type ActiveLayerState = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  locked: boolean;
  isText: boolean;
};

function ToolButton({
  label,
  children,
  onClick
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center border border-black/10 bg-white text-sm font-semibold text-ink transition hover:border-black/25 hover:bg-mist"
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

export type TemplateEditorValue = TemplateCanvasTemplate;

export type TemplateEditorHandle = {
  exportPng: () => Promise<string>;
  exportJson: () => unknown;
  updateField: (field: string, value: string) => void;
  replaceImage: (field: string, dataUrl: string) => void;
};

type TemplateEditorProps = {
  template: TemplateEditorValue;
  values?: Record<string, string>;
  fields?: string[];
  category?: string | null;
  baseImageUrl?: string | null;
  headerActions?: React.ReactNode;
};

type TransformHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

type LayerBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type InteractionState =
  | { mode: "move"; id: string; offsetX: number; offsetY: number }
  | { mode: "resize"; id: string; handle: TransformHandle; startBox: LayerBox }
  | { mode: "rotate"; id: string; centerX: number; centerY: number; startAngle: number; initialRotation: number };

const MIN_LAYER_SIZE = 8;
const ZOOM_MIN = 25;
const ZOOM_MAX = 300;
const ZOOM_STEP = 10;

type EditorIconName =
  | "design"
  | "text"
  | "upload"
  | "elements"
  | "layers"
  | "duplicate"
  | "undo"
  | "lock"
  | "unlock"
  | "delete"
  | "forward"
  | "backward"
  | "location"
  | "send"
  | "eye"
  | "eyeOff";

type ShapeDefinition = {
  kind: string;
  label: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
};

const SHAPE_LIBRARY: ShapeDefinition[] = [
  { kind: "rectangle", label: "Rectangle", width: 180, height: 95 },
  { kind: "square", label: "Square", width: 120, height: 120 },
  { kind: "rounded-rectangle", label: "Rounded rectangle", width: 180, height: 95 },
  { kind: "circle", label: "Circle", width: 120, height: 120 },
  { kind: "oval", label: "Oval", width: 170, height: 105 },
  { kind: "line", label: "Line", fill: "none", strokeWidth: 4, width: 170, height: 0 },
  { kind: "arrow", label: "Arrow", fill: "none", strokeWidth: 4, width: 170, height: 65 },
  { kind: "triangle", label: "Triangle", width: 130, height: 120 },
  { kind: "right-triangle", label: "Right triangle", width: 130, height: 120 },
  { kind: "diamond", label: "Diamond", width: 130, height: 130 },
  { kind: "pentagon", label: "Pentagon", width: 130, height: 120 },
  { kind: "hexagon", label: "Hexagon", width: 150, height: 120 },
  { kind: "octagon", label: "Octagon", width: 140, height: 120 },
  { kind: "star", label: "Star", width: 140, height: 140 },
  { kind: "heart", label: "Heart", width: 140, height: 130 },
  { kind: "speech-bubble", label: "Speech bubble", width: 165, height: 115 },
  { kind: "thought-bubble", label: "Thought bubble", width: 165, height: 115 },
  { kind: "trapezoid", label: "Trapezoid", width: 150, height: 110 },
  { kind: "parallelogram", label: "Parallelogram", width: 155, height: 105 },
  { kind: "chevron", label: "Chevron", width: 155, height: 105 },
  { kind: "banner", label: "Banner", width: 185, height: 90 },
  { kind: "wavy-line", label: "Wavy line", fill: "none", strokeWidth: 4, width: 180, height: 56 },
  { kind: "arc", label: "Arc", fill: "none", strokeWidth: 4, width: 160, height: 90 },
  { kind: "cross", label: "Cross", width: 130, height: 130 },
  { kind: "plus", label: "Plus", width: 130, height: 130 }
];

export function EditorIcon({ name, className = "h-5 w-5" }: { name: EditorIconName; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 2.25 };
  const paths: Record<EditorIconName, React.ReactNode> = {
    design: <><path d="M4 20h16" /><path d="M7 16.5 16.5 7 19 9.5 9.5 19H7z" /><path d="m14.8 8.7 2.5 2.5" /></>,
    text: <><path d="M5 6h14" /><path d="M12 6v12" /><path d="M9 18h6" /><path d="M7 6v3" /><path d="M17 6v3" /></>,
    upload: <><path d="M7 18a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 1.5A3.5 3.5 0 0 1 17 18H7z" /><path d="M12 16V8" /><path d="m8.8 11.2 3.2-3.2 3.2 3.2" /></>,
    elements: <><rect x="3.5" y="4" width="7.5" height="7.5" rx="1.2" /><circle cx="17" cy="7.8" r="3.8" /><path d="M4 20h7l-3.5-6z" /><path d="M15 15h5v5h-5z" /></>,
    layers: <><rect x="6" y="4" width="12" height="8" rx="1.5" /><rect x="4" y="8" width="12" height="8" rx="1.5" /><rect x="8" y="12" width="12" height="8" rx="1.5" /></>,
    duplicate: <><rect x="8" y="8" width="11" height="11" rx="1.8" /><rect x="5" y="5" width="11" height="11" rx="1.8" /></>,
    undo: <><path d="M9 7H4v5" /><path d="M4 12c1.8-4.8 7.3-7 12-4.3 4.8 2.8 4.8 9.2 0 12" /></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" /><path d="M12 14v2" /></>,
    unlock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8.5 10V7.5a3.5 3.5 0 0 1 6.4-2" /><path d="M12 14v2" /></>,
    delete: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M7 7l1 14h8l1-14" /><path d="M10.5 11v6" /><path d="M13.5 11v6" /></>,
    forward: <><rect x="8" y="8" width="10" height="10" rx="1.5" /><path d="M6 16V6h10" /><path d="m12 4 4 2-4 2" /></>,
    backward: <><rect x="6" y="6" width="10" height="10" rx="1.5" /><path d="M8 18h10V8" /><path d="m12 20-4-2 4-2" /></>,
    location: <><path d="M12 21s7-5.3 7-11a7 7 0 0 0-14 0c0 5.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
    send: <><path d="M3.5 11.5 21 3.5 13 21l-2.2-7.8z" /><path d="m21 3.5-10.2 9.7" /></>,
    eye: <><path d="M2.5 12s3.8-6.5 9.5-6.5S21.5 12 21.5 12s-3.8 6.5-9.5 6.5S2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M3 3l18 18" /><path d="M10.7 5.7A10 10 0 0 1 12 5.5c5.7 0 9.5 6.5 9.5 6.5a15 15 0 0 1-2.2 3" /><path d="M6.5 6.8C4 8.5 2.5 12 2.5 12s3.8 6.5 9.5 6.5a9 9 0 0 0 3.7-.8" /></>
  };

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      <g {...common}>{paths[name]}</g>
    </svg>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  disabled,
  className = "h-9 w-9"
}: {
  label: string;
  icon: EditorIconName;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      className={`inline-flex items-center justify-center border border-black/10 bg-white text-ink transition hover:border-black/25 hover:bg-mist disabled:opacity-40 ${className}`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      <EditorIcon className="h-6 w-6" name={icon} />
    </button>
  );
}

function polygonPoints(points: Array<[number, number]>) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function pointsPath(points: Array<[number, number]>) {
  return `M ${points.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`;
}

function regularPolygonPoints(cx: number, cy: number, rx: number, ry: number, sides: number, offset = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = offset + (index * Math.PI * 2) / sides;
    return [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry] as [number, number];
  });
}

function starPoints(cx: number, cy: number, outer: number, inner: number, points = 5) {
  return Array.from({ length: points * 2 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / points;
    const radius = index % 2 === 0 ? outer : inner;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius] as [number, number];
  });
}

function shapePath(kind: string, x: number, y: number, w: number, h: number) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2;
  switch (kind) {
    case "line":
      return `M ${x} ${cy} L ${x + w} ${cy}`;
    case "arrow":
      return `M ${x} ${cy} H ${x + w * 0.82} M ${x + w * 0.66} ${y + h * 0.22} L ${x + w} ${cy} L ${x + w * 0.66} ${y + h * 0.78}`;
    case "triangle":
      return `M ${cx} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    case "right-triangle":
      return `M ${x} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    case "diamond":
      return `M ${cx} ${y} L ${x + w} ${cy} L ${cx} ${y + h} L ${x} ${cy} Z`;
    case "pentagon":
      return pointsPath(regularPolygonPoints(cx, cy, w / 2, h / 2, 5));
    case "hexagon":
      return `M ${x + w * 0.25} ${y} L ${x + w * 0.75} ${y} L ${x + w} ${cy} L ${x + w * 0.75} ${y + h} L ${x + w * 0.25} ${y + h} L ${x} ${cy} Z`;
    case "octagon":
      return `M ${x + w * 0.3} ${y} L ${x + w * 0.7} ${y} L ${x + w} ${y + h * 0.3} L ${x + w} ${y + h * 0.7} L ${x + w * 0.7} ${y + h} L ${x + w * 0.3} ${y + h} L ${x} ${y + h * 0.7} L ${x} ${y + h * 0.3} Z`;
    case "star":
      return pointsPath(starPoints(cx, cy, r, r * 0.45, 5));
    case "heart":
      return `M ${cx} ${y + h * 0.82} C ${x - w * 0.05} ${y + h * 0.42}, ${x + w * 0.08} ${y}, ${cx} ${y + h * 0.28} C ${x + w * 0.92} ${y}, ${x + w * 1.05} ${y + h * 0.42}, ${cx} ${y + h * 0.82} Z`;
    case "speech-bubble":
      return `M ${x + 12} ${y} H ${x + w - 12} Q ${x + w} ${y} ${x + w} ${y + 12} V ${y + h - 26} Q ${x + w} ${y + h - 14} ${x + w - 12} ${y + h - 14} H ${x + w * 0.42} L ${x + w * 0.24} ${y + h} L ${x + w * 0.28} ${y + h - 14} H ${x + 12} Q ${x} ${y + h - 14} ${x} ${y + h - 26} V ${y + 12} Q ${x} ${y} ${x + 12} ${y} Z`;
    case "thought-bubble":
      return `M ${cx} ${y} C ${x + w * 0.9} ${y}, ${x + w} ${y + h * 0.2}, ${x + w * 0.86} ${y + h * 0.45} C ${x + w} ${y + h * 0.75}, ${x + w * 0.66} ${y + h * 0.95}, ${x + w * 0.45} ${y + h * 0.78} C ${x + w * 0.16} ${y + h}, ${x - w * 0.04} ${y + h * 0.66}, ${x + w * 0.13} ${y + h * 0.45} C ${x - w * 0.04} ${y + h * 0.18}, ${x + w * 0.18} ${y}, ${cx} ${y} Z`;
    case "trapezoid":
      return `M ${x + w * 0.22} ${y} H ${x + w * 0.78} L ${x + w} ${y + h} H ${x} Z`;
    case "parallelogram":
      return `M ${x + w * 0.22} ${y} H ${x + w} L ${x + w * 0.78} ${y + h} H ${x} Z`;
    case "chevron":
      return `M ${x} ${y} H ${x + w * 0.62} L ${x + w} ${cy} L ${x + w * 0.62} ${y + h} H ${x} L ${x + w * 0.38} ${cy} Z`;
    case "banner":
      return `M ${x} ${y} H ${x + w} V ${y + h} L ${x + w * 0.82} ${cy} L ${x + w * 0.64} ${y + h} H ${x + w * 0.36} L ${x + w * 0.18} ${cy} L ${x} ${y + h} Z`;
    case "wavy-line":
      return `M ${x} ${cy} C ${x + w * 0.16} ${y}, ${x + w * 0.34} ${y + h}, ${x + w * 0.5} ${cy} S ${x + w * 0.84} ${y}, ${x + w} ${cy}`;
    case "arc":
      return `M ${x} ${y + h} Q ${cx} ${y - h * 0.75} ${x + w} ${y + h}`;
    case "cross":
      return `M ${x + w * 0.36} ${y} H ${x + w * 0.64} V ${y + h * 0.36} H ${x + w} V ${y + h * 0.64} H ${x + w * 0.64} V ${y + h} H ${x + w * 0.36} V ${y + h * 0.64} H ${x} V ${y + h * 0.36} H ${x + w * 0.36} Z`;
    case "plus":
      return `M ${x + w * 0.4} ${y} H ${x + w * 0.6} V ${y + h * 0.4} H ${x + w} V ${y + h * 0.6} H ${x + w * 0.6} V ${y + h} H ${x + w * 0.4} V ${y + h * 0.6} H ${x} V ${y + h * 0.4} H ${x + w * 0.4} Z`;
    default:
      return `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
  }
}

function ShapeGlyph({ shape }: { shape: ShapeDefinition }) {
  const kind = shape.kind;
  const fill = "none";
  const stroke = "currentColor";
  const strokeWidth = Math.max(2.6, shape.strokeWidth ?? 2.6);

  return (
    <svg aria-hidden="true" className="h-10 w-10" viewBox="0 0 64 48">
      {kind === "rectangle" ? (
        <rect x="10" y="9" width="44" height="30" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ) : kind === "square" ? (
        <rect x="17" y="8" width="30" height="30" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ) : kind === "rounded-rectangle" ? (
        <rect x="8" y="9" width="48" height="30" rx="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ) : kind === "circle" ? (
        <circle cx="32" cy="24" r="17" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ) : kind === "oval" ? (
        <ellipse cx="32" cy="24" rx="23" ry="15" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ) : (
        <path d={shapePath(kind, 8, 7, 48, 34)} fill={fill} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
      )}
    </svg>
  );
}

function fieldLabel(field: string) {
  return field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function isImageField(field: string) {
  return field === "photo" || field === "logo" || field.endsWith("_image") || field.includes("image");
}

function layerField(layer: TemplateCanvasObject) {
  return layer.field ?? (layer.editable ? layer.id ?? null : null);
}

function isLockedObject(object: TemplateCanvasObject) {
  return Boolean(object.locked);
}

function normalizedLayers(template: TemplateEditorValue) {
  const layout = resolveTemplateLayout(template);
  return layout.objects.map((layer, index) => ({
    ...layer,
    id: layer.id ?? `layer-${index}`
  }));
}

function cloneLayers(layers: TemplateCanvasObject[]) {
  return layers.map((layer) => ({ ...layer }));
}

function layerBox(layer: TemplateCanvasObject) {
  const x = layer.left ?? layer.x ?? 0;
  const y = layer.top ?? layer.y ?? 0;
  const w = layer.width ?? layer.w ?? 0;
  const h = layer.height ?? layer.h ?? 0;
  return { x, y, w, h };
}

function layerRotation(layer: TemplateCanvasObject) {
  return layer.rotation ?? layer.angle ?? 0;
}

function normalizeAngle(value: number) {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function angleFromCenter(point: { x: number; y: number }, centerX: number, centerY: number) {
  return (Math.atan2(point.y - centerY, point.x - centerX) * 180) / Math.PI;
}

function transformLayerBox(box: LayerBox, handle: TransformHandle, point: { x: number; y: number }) {
  let nextX = box.x;
  let nextY = box.y;
  let nextW = box.w;
  let nextH = box.h;

  if (handle.includes("e")) {
    nextW = point.x - box.x;
  }
  if (handle.includes("s")) {
    nextH = point.y - box.y;
  }
  if (handle.includes("w")) {
    nextX = Math.min(point.x, box.x + box.w - MIN_LAYER_SIZE);
    nextW = box.x + box.w - nextX;
  }
  if (handle.includes("n")) {
    nextY = Math.min(point.y, box.y + box.h - MIN_LAYER_SIZE);
    nextH = box.y + box.h - nextY;
  }

  nextW = Math.max(MIN_LAYER_SIZE, nextW);
  nextH = Math.max(MIN_LAYER_SIZE, nextH);

  return { x: nextX, y: nextY, w: nextW, h: nextH };
}

function handleCursor(handle: TransformHandle) {
  if (handle === "n" || handle === "s") return "ns-resize";
  if (handle === "e" || handle === "w") return "ew-resize";
  if (handle === "nw" || handle === "se") return "nwse-resize";
  return "nesw-resize";
}

function textAnchor(align?: string) {
  if (align === "center") return "middle";
  if (align === "right") return "end";
  return "start";
}

function textX(layer: TemplateCanvasObject) {
  const { x, w } = layerBox(layer);
  if (layer.textAlign === "center") return x + w / 2;
  if (layer.textAlign === "right") return x + w;
  return x;
}

function estimateTextHeight(layer: TemplateCanvasObject) {
  const fontSize = layer.fontSize ?? 18;
  const lines = String(layer.text ?? "").split("\n").length || 1;
  return Math.ceil(lines * fontSize * 1.45 + 8);
}

function exportLayer(layer: TemplateCanvasObject) {
  const { x, y, w, h } = layerBox(layer);
  const base = {
    id: layer.id,
    name: layer.name,
    field: layerField(layer),
    type: layer.type,
    visible: layer.visible,
    locked: layer.locked,
    opacity: layer.opacity,
    fill: layer.fill,
    stroke: layer.stroke,
    strokeWidth: layer.strokeWidth,
    shapeKind: layer.shapeKind,
    path: layer.path,
    rotation: layer.rotation ?? layer.angle ?? 0
  };

  if (layer.type === "text") {
    return {
      ...base,
      x: layer.textAlign === "center" ? x + w / 2 : layer.textAlign === "right" ? x + w : x,
      y,
      text: layer.text,
      fontSize: layer.fontSize,
      fontFamily: layer.fontFamily,
      fontWeight: layer.fontWeight,
      fontStyle: layer.fontStyle,
      textAlign: layer.textAlign,
      letterSpacing: layer.letterSpacing
    };
  }

  return {
    ...base,
    x,
    y,
    w,
    h,
    src: layer.src,
    clipShape: layer.clipShape,
    placeholder: layer.placeholder,
    editable: layer.editable
  };
}

function MiniActionButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center border border-black/10 bg-white text-[13px] font-semibold text-ink transition hover:border-violet-300 hover:bg-violet-50"
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

export const TemplateEditor = forwardRef<TemplateEditorHandle, TemplateEditorProps>(function TemplateEditor(
  { template, values = {}, fields = [], category, baseImageUrl, headerActions },
  ref
) {
  const editorRootRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasViewportRef = useRef<HTMLDivElement | null>(null);
  const textEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const interactionRef = useRef<InteractionState | null>(null);
  const pointerCaptureRef = useRef<{ element: Element; pointerId: number } | null>(null);
  const undoStackRef = useRef<TemplateCanvasObject[][]>([]);
  const redoStackRef = useRef<TemplateCanvasObject[][]>([]);
  const layout = useMemo(() => resolveTemplateLayout(template), [template]);
  const [layers, setLayers] = useState<TemplateCanvasObject[]>(() => normalizedLayers(template));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFill, setSelectedFill] = useState("#111111");
  const [selectedStroke, setSelectedStroke] = useState("#111111");
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedFontFamily, setSelectedFontFamily] = useState("Inter");
  const [selectedText, setSelectedText] = useState("");
  const [selectedRadius, setSelectedRadius] = useState(0);
  const [activePanel, setActivePanel] = useState<"design" | "text" | "uploads" | "elements" | "layers">("layers");
  const [zoom, setZoom] = useState(92);
  const [historyVersion, setHistoryVersion] = useState(0);

  useEffect(() => {
    setLayers(normalizedLayers(template));
    setSelectedId(null);
    undoStackRef.current = [];
    redoStackRef.current = [];
    setHistoryVersion((value) => value + 1);
  }, [template]);

  const activeLayer = useMemo(() => layers.find((layer) => layer.id === selectedId) ?? null, [layers, selectedId]);
  const canUndo = historyVersion >= 0 && undoStackRef.current.length > 0;

  function pushUndoSnapshot(snapshot = layers) {
    undoStackRef.current = [...undoStackRef.current.slice(-49), cloneLayers(snapshot)];
    redoStackRef.current = [];
    setHistoryVersion((value) => value + 1);
  }

  function setLayersWithHistory(updater: React.SetStateAction<TemplateCanvasObject[]>) {
    pushUndoSnapshot();
    setLayers(updater);
  }

  function undoLayerChange() {
    const previous = undoStackRef.current.pop();
    if (!previous) return;
    setLayers((current) => {
      redoStackRef.current = [...redoStackRef.current.slice(-49), cloneLayers(current)];
      return cloneLayers(previous);
    });
    setSelectedId((id) => (id && previous.some((layer) => layer.id === id) ? id : null));
    setHistoryVersion((value) => value + 1);
  }

  function clampZoom(value: number) {
    return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(value)));
  }

  function changeZoom(delta: number) {
    setZoom((value) => clampZoom(value + delta));
  }

  function changeZoomFromWheel(deltaY: number) {
    setZoom((value) => clampZoom(value + (deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)));
  }

  function zoomToFit() {
    const viewport = canvasViewportRef.current;
    if (!viewport) {
      setZoom(100);
      return;
    }
    const availableWidth = Math.max(240, viewport.clientWidth - 64);
    const availableHeight = Math.max(240, viewport.clientHeight - 64);
    const nextZoom = Math.min((availableWidth / layout.width) * 100, (availableHeight / layout.height) * 100);
    setZoom(clampZoom(nextZoom));
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.ctrlKey && !event.metaKey) return;
      if (event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        undoLayerChange();
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeZoom(ZOOM_STEP);
      } else if (event.key === "-") {
        event.preventDefault();
        changeZoom(-ZOOM_STEP);
      } else if (event.key === "0") {
        event.preventDefault();
        setZoom(100);
      } else if (event.key.toLowerCase() === "1") {
        event.preventDefault();
        zoomToFit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [layout.height, layout.width]);

  useEffect(() => {
    function handleEditorWheel(event: WheelEvent) {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      changeZoomFromWheel(event.deltaY);
    }

    function handleGesture(event: Event) {
      event.preventDefault();
      event.stopPropagation();
    }

    window.addEventListener("wheel", handleEditorWheel, { passive: false, capture: true });
    document.addEventListener("wheel", handleEditorWheel, { passive: false, capture: true });
    window.addEventListener("gesturestart", handleGesture, { passive: false, capture: true });
    window.addEventListener("gesturechange", handleGesture, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", handleEditorWheel, { capture: true });
      document.removeEventListener("wheel", handleEditorWheel, { capture: true });
      window.removeEventListener("gesturestart", handleGesture, { capture: true });
      window.removeEventListener("gesturechange", handleGesture, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!activeLayer) return;
    setSelectedFill(typeof activeLayer.fill === "string" ? activeLayer.fill : "#111111");
    setSelectedStroke(typeof activeLayer.stroke === "string" ? activeLayer.stroke : "#111111");
    setSelectedFontSize(activeLayer.fontSize ?? 24);
    setSelectedFontFamily(activeLayer.fontFamily ?? "Inter");
    setSelectedText(typeof activeLayer.text === "string" ? activeLayer.text : "");
    setSelectedRadius(activeLayer.rx ?? 0);
  }, [activeLayer]);

  function updateLayer(id: string, updater: (layer: TemplateCanvasObject) => TemplateCanvasObject, recordHistory = true) {
    if (recordHistory) {
      pushUndoSnapshot();
    }
    setLayers((current) => current.map((layer) => (layer.id === id ? updater(layer) : layer)));
  }

  function updateActive(properties: Record<string, unknown>) {
    if (!activeLayer) return;
    updateLayer(activeLayer.id ?? "", (layer) => ({ ...layer, ...properties }));
  }

  function selectLayerById(id: string) {
    setSelectedId(id);
  }

  function selectLayer(layer: TemplateCanvasObject) {
    if (!layer.id) return;
    setSelectedId(layer.id);
  }

  function isStudentIdTemplate() {
    return (category ?? "").toLowerCase().includes("student") || fields.includes("student_name");
  }

  function getRenderLayers() {
    const merged = layers.map((layer) => {
      const field = layerField(layer);

      if (field && Object.prototype.hasOwnProperty.call(values, field) && typeof layer.text === "string") {
        const nextText = values[field];
        return {
          ...layer,
          text: ["roll_number", "phone", "blood_group", "expiry_date"].includes(field) && layer.text.includes(":")
            ? `${layer.text.split(":")[0]}: ${nextText}`
            : nextText
        };
      }
      if (field === "color" && layer.role === "accent" && values.color) {
        return { ...layer, fill: values.color };
      }
      return layer;
    });

    if (isStudentIdTemplate() && merged.length === 0) {
      const accent = values.color || layout.accent || "#1d4ed8";
      return [
        { type: "rect", role: "accent", id: "base-bg", x: 0, y: 0, w: 640, h: 400, fill: "#f8fafc", selectable: false },
        { type: "rect", role: "accent", id: "base-bar", x: 0, y: 0, w: 640, h: 110, fill: accent, selectable: false },
        { type: "rect", role: "accent", id: "base-footer", x: 0, y: 364, w: 640, h: 36, fill: accent, selectable: false }
      ];
    }

    return merged;
  }

  const renderLayers = getRenderLayers() as TemplateCanvasObject[];
  const clipLayers = renderLayers.filter(
    (layer) => layer.type === "image" && Boolean((layer as TemplateCanvasObject).src) && (layer as TemplateCanvasObject).clipShape === "ellipse"
  ) as TemplateCanvasObject[];

  function clientToSvgCoords(clientX: number, clientY: number) {
    const svgEl = svgRef.current;
    if (!svgEl) return { x: 0, y: 0 };
    const pt = svgEl.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgEl.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgCoords = pt.matrixTransform(ctm.inverse());
    return { x: svgCoords.x, y: svgCoords.y };
  }

  function pointerToSvgCoords(event: React.PointerEvent<SVGElement>) {
    return clientToSvgCoords(event.clientX, event.clientY);
  }

  function handleShapeDrop(event: React.DragEvent<SVGSVGElement>) {
    const kind = event.dataTransfer.getData("application/printnepal-shape");
    if (!kind) return;
    event.preventDefault();
    const shape = SHAPE_LIBRARY.find((item) => item.kind === kind);
    if (!shape) return;
    const point = clientToSvgCoords(event.clientX, event.clientY);
    const width = shape.width ?? 140;
    const height = shape.height ?? 100;
    addShapeLayer(shape, { x: point.x - width / 2, y: point.y - height / 2 });
  }

  function capturePointer(event: React.PointerEvent<SVGElement>) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerCaptureRef.current = { element: event.currentTarget, pointerId: event.pointerId };
    } catch {
      pointerCaptureRef.current = null;
    }
  }

  function handlePointerDown(layer: TemplateCanvasObject, event: React.PointerEvent<SVGElement>) {
    event.preventDefault();
    event.stopPropagation();
    selectLayer(layer);
    if (isLockedObject(layer) || !layer.id) return;
    pushUndoSnapshot();
    capturePointer(event);
    const point = pointerToSvgCoords(event);
    const { x, y } = layerBox(layer);
    interactionRef.current = {
      mode: "move",
      id: layer.id,
      offsetX: point.x - x,
      offsetY: point.y - y
    };
  }

  function handleResizePointerDown(layer: TemplateCanvasObject, handle: TransformHandle, event: React.PointerEvent<SVGElement>) {
    event.preventDefault();
    event.stopPropagation();
    selectLayer(layer);
    if (isLockedObject(layer) || !layer.id) return;
    pushUndoSnapshot();
    capturePointer(event);
    interactionRef.current = {
      mode: "resize",
      id: layer.id,
      handle,
      startBox: layerBox(layer)
    };
  }

  function handleRotatePointerDown(layer: TemplateCanvasObject, event: React.PointerEvent<SVGElement>) {
    event.preventDefault();
    event.stopPropagation();
    selectLayer(layer);
    if (isLockedObject(layer) || !layer.id) return;
    pushUndoSnapshot();
    capturePointer(event);
    const point = pointerToSvgCoords(event);
    const { x, y, w, h } = layerBox(layer);
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    interactionRef.current = {
      mode: "rotate",
      id: layer.id,
      centerX,
      centerY,
      startAngle: angleFromCenter(point, centerX, centerY),
      initialRotation: layerRotation(layer)
    };
  }

  function handlePointerMove(event: React.PointerEvent<SVGElement>) {
    const interaction = interactionRef.current;
    if (!interaction) return;
    const point = pointerToSvgCoords(event);
    updateLayer(interaction.id, (layer) => {
      if (interaction.mode === "move") {
        const nextX = point.x - interaction.offsetX;
        const nextY = point.y - interaction.offsetY;
        return { ...layer, left: nextX, top: nextY, x: nextX, y: nextY };
      }

      if (interaction.mode === "resize") {
        const box = transformLayerBox(interaction.startBox, interaction.handle, point);
        return { ...layer, left: box.x, top: box.y, width: box.w, height: box.h, x: box.x, y: box.y, w: box.w, h: box.h };
      }

      const currentAngle = angleFromCenter(point, interaction.centerX, interaction.centerY);
      let nextRotation = normalizeAngle(interaction.initialRotation + currentAngle - interaction.startAngle);
      if (event.shiftKey) {
        nextRotation = Math.round(nextRotation / 15) * 15;
      }
      return { ...layer, rotation: nextRotation, angle: nextRotation };
    }, false);
  }

  function stopInteraction() {
    interactionRef.current = null;
  }

  function releasePointerCapture(event: React.PointerEvent<SVGElement>) {
    const capture = pointerCaptureRef.current;
    if (!capture) return;
    try {
      capture.element.releasePointerCapture(capture.pointerId);
    } catch {
      try {
        event.currentTarget.releasePointerCapture(capture.pointerId);
      } catch {
        // Ignore capture release issues; the interaction state is already reset.
      }
    } finally {
      pointerCaptureRef.current = null;
    }
  }

  useImperativeHandle(ref, () => ({
    async exportPng() {
      const svgEl = svgRef.current;
      if (!svgEl) return "";
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.querySelectorAll("[data-selection-overlay='true']").forEach((node) => node.remove());
      const svgString = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      try {
        const image = new Image();
        image.crossOrigin = "anonymous";
        const load = new Promise<string>((resolve) => {
          image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = layout.width * 2;
            canvas.height = layout.height * 2;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(url);
              return;
            }
            ctx.scale(2, 2);
            ctx.drawImage(image, 0, 0, layout.width, layout.height);
            resolve(canvas.toDataURL("image/png"));
          };
          image.onerror = () => resolve(url);
        });
        image.src = url;
        return await load;
      } finally {
        setTimeout(() => URL.revokeObjectURL(url), 0);
      }
    },
    exportJson() {
      return {
        width: layout.width,
        height: layout.height,
        background: layout.background,
        accent: layout.accent,
        layers: (renderLayers as TemplateCanvasObject[]).map(exportLayer)
      };
    },
    updateField(field, value) {
      setLayersWithHistory((current) =>
        current.map((layer) => {
          if (field === "color" && layer.role === "accent") {
            return { ...layer, fill: value };
          }
          if (layerField(layer) !== field || typeof layer.text !== "string") return layer;
          const nextText = ["roll_number", "phone", "blood_group", "expiry_date"].includes(field) && layer.text.includes(":")
            ? `${layer.text.split(":")[0]}: ${value}`
            : value;
          return { ...layer, text: nextText };
        })
      );
    },
    replaceImage(field, dataUrl) {
      setLayersWithHistory((current) =>
        current.map((layer) => (layerField(layer) === field && layer.type === "image" ? { ...layer, src: dataUrl, placeholder: false } : layer))
      );
    }
  }));

  function addTextLayer() {
    const id = `layer-${Date.now()}`;
    const text = "New text";
    setLayersWithHistory((current) => [
      ...current,
      {
        id,
        type: "text",
        text,
        x: 80,
        y: 80,
        width: 220,
        height: 40,
        fontSize: 24,
        fontFamily: selectedFontFamily,
        fill: selectedFill,
        visible: true
      }
    ]);
    setSelectedText(text);
    setActivePanel("text");
    setSelectedId(id);
    window.setTimeout(() => {
      textEditorRef.current?.focus();
      textEditorRef.current?.select();
    }, 0);
  }

  function addShapeLayer(shape: ShapeDefinition, position?: { x: number; y: number }) {
    const id = `layer-${Date.now()}`;
    const width = shape.width ?? 140;
    const height = shape.height ?? 100;
    const x = position?.x ?? Math.max(24, layout.width / 2 - width / 2);
    const y = position?.y ?? Math.max(24, layout.height / 2 - height / 2);
    const isLineLike = shape.fill === "none";

    setLayersWithHistory((current) => [
      ...current,
      {
        id,
        type: "shape",
        shapeKind: shape.kind,
        name: shape.label,
        x,
        y,
        left: x,
        top: y,
        width,
        height,
        w: width,
        h: height,
        fill: isLineLike ? "none" : selectedFill,
        stroke: shape.stroke ?? selectedStroke,
        strokeWidth: shape.strokeWidth ?? 2,
        visible: true,
        selectable: true
      }
    ]);
    setSelectedId(id);
  }

  function addRectangleLayer() {
    addShapeLayer(SHAPE_LIBRARY[0]);
  }

  function addCircleLayer() {
    addShapeLayer(SHAPE_LIBRARY[3]);
  }

  function addLineLayer() {
    addShapeLayer(SHAPE_LIBRARY[5]);
  }

  function uploadImageLayer(file: File) {
    const id = `layer-${Date.now()}`;
    const objectUrl = URL.createObjectURL(file);
    setLayersWithHistory((current) => [
      ...current,
      {
        id,
        type: "image",
        x: 120,
        y: 120,
        width: 160,
        height: 120,
        src: objectUrl,
        visible: true
      }
    ]);
    setSelectedId(id);
  }

  function duplicateLayer() {
    if (!activeLayer) return;
    const id = `layer-${Date.now()}`;
    setLayersWithHistory((current) => {
      const layer = current.find((item) => item.id === activeLayer.id);
      if (!layer) return current;
      const { x, y } = layerBox(layer);
      return [...current, { ...layer, id, left: x + 20, top: y + 20, x: x + 20, y: y + 20, locked: false, selectable: true }];
    });
    setSelectedId(id);
  }

  function replaceSelectedImageLayer(file: File) {
    if (!activeLayer || activeLayer.type !== "image" || !activeLayer.id) {
      uploadImageLayer(file);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    updateLayer(activeLayer.id, (layer) => ({ ...layer, src: objectUrl, placeholder: false }));
  }

  function deleteLayer() {
    if (!activeLayer || activeLayer.id === "bg") return;
    setLayersWithHistory((current) => current.filter((layer) => layer.id !== activeLayer.id));
    setSelectedId(null);
  }

  function moveLayer(direction: "forward" | "backward") {
    if (!activeLayer) return;
    setLayersWithHistory((current) => {
      const index = current.findIndex((layer) => layer.id === activeLayer.id);
      if (index < 0) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      if (direction === "forward") {
        next.splice(Math.min(next.length, index + 1), 0, item);
      } else {
        next.splice(Math.max(0, index - 1), 0, item);
      }
      return next;
    });
  }

  function toggleTextStyle(property: "fontWeight" | "fontStyle" | "underline") {
    if (!activeLayer || activeLayer.type !== "text") return;
    updateLayer(activeLayer.id ?? "", (layer) => {
      if (property === "fontWeight") {
        return { ...layer, fontWeight: layer.fontWeight === "bold" ? "normal" : "bold" };
      }
      if (property === "fontStyle") {
        return { ...layer, fontStyle: layer.fontStyle === "italic" ? "normal" : "italic" };
      }
      return { ...layer, underline: !((layer as TemplateCanvasObject & { underline?: boolean }).underline) } as TemplateCanvasObject;
    });
  }

  function alignText(textAlign: "left" | "center" | "right") {
    if (!activeLayer || activeLayer.type !== "text") return;
    updateLayer(activeLayer.id ?? "", (layer) => ({ ...layer, textAlign }));
  }

  function toggleLockLayer() {
    if (!activeLayer) return;
    updateLayer(activeLayer.id ?? "", (layer) => ({ ...layer, locked: !layer.locked, selectable: layer.locked ? true : layer.selectable }));
  }

  function toggleVisibleLayer(id: string) {
    updateLayer(id, (layer) => ({ ...layer, visible: layer.visible === false }));
  }

  function openTextEditor(layer: TemplateCanvasObject) {
    if (layer.type !== "text") return;
    selectLayer(layer);
    setSelectedText(typeof layer.text === "string" ? layer.text : "");
    setActivePanel("text");
    window.setTimeout(() => {
      textEditorRef.current?.focus();
      textEditorRef.current?.select();
    }, 0);
  }

  function applyColor(color: string) {
    setSelectedFill(color);
    if (activeLayer?.type === "text") {
      updateActive({ fill: color });
    }
  }

  function setOpacity(value: number) {
    updateActive({ opacity: Math.max(0, Math.min(1, value / 100)) });
  }

  function setActiveBoxValue(property: "x" | "y" | "w" | "h", value: number) {
    if (!activeLayer) return;
    const box = layerBox(activeLayer);
    const next = {
      x: property === "x" ? value : box.x,
      y: property === "y" ? value : box.y,
      w: property === "w" ? Math.max(MIN_LAYER_SIZE, value) : box.w,
      h: property === "h" ? Math.max(MIN_LAYER_SIZE, value) : box.h
    };
    updateActive({ left: next.x, top: next.y, width: next.w, height: next.h, x: next.x, y: next.y, w: next.w, h: next.h });
  }

  function setActiveRotation(value: number) {
    updateActive({ rotation: normalizeAngle(value), angle: normalizeAngle(value) });
  }

  function handleCanvasWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    event.stopPropagation();
    changeZoomFromWheel(event.deltaY);
  }

  function renderSelectionControls(layer: TemplateCanvasObject) {
    if (selectedId !== layer.id) return null;
    const { x, y, w, h } = layerBox(layer);
    const textWidth = layer.type === "text"
      ? Math.max(80, String(layer.text ?? "").split("\n").reduce((max, line) => Math.max(max, line.length), 0) * (layer.fontSize ?? 18) * 0.55)
      : w;
    const safeW = Math.max(MIN_LAYER_SIZE, w || textWidth);
    const safeH = Math.max(MIN_LAYER_SIZE, h || (layer.type === "text" ? estimateTextHeight(layer) : h));
    const locked = isLockedObject(layer);
    const centerX = x + safeW / 2;
    const rotateAbove = y > 36;
    const rotateY = rotateAbove ? y - 30 : y + safeH + 30;
    const rotateLineY = rotateAbove ? y : y + safeH;
    const handles: Array<{ id: TransformHandle; x: number; y: number }> = [
      { id: "nw", x, y },
      { id: "n", x: centerX, y },
      { id: "ne", x: x + safeW, y },
      { id: "e", x: x + safeW, y: y + safeH / 2 },
      { id: "se", x: x + safeW, y: y + safeH },
      { id: "s", x: centerX, y: y + safeH },
      { id: "sw", x, y: y + safeH },
      { id: "w", x, y: y + safeH / 2 }
    ];

    return (
      <g data-selection-overlay="true">
        <rect
          x={x - 2}
          y={y - 2}
          width={safeW + 4}
          height={safeH + 4}
          fill="none"
          stroke={locked ? "#94a3b8" : "#8b3dff"}
          strokeDasharray="5,4"
          strokeWidth={2}
          pointerEvents="none"
        />
        {locked ? null : (
          <>
            <line x1={centerX} y1={rotateLineY} x2={centerX} y2={rotateAbove ? rotateY + 7 : rotateY - 7} stroke="#8b3dff" strokeWidth={2} pointerEvents="none" />
            <circle
              cx={centerX}
              cy={rotateY}
              r={7}
              fill="#ffffff"
              stroke="#8b3dff"
              strokeWidth={2}
              style={{ cursor: "grab" }}
              onPointerDown={(event) => handleRotatePointerDown(layer, event)}
            />
            {handles.map((handle) => (
              <rect
                key={handle.id}
                x={handle.x - 5}
                y={handle.y - 5}
                width={10}
                height={10}
                fill="#ffffff"
                stroke="#8b3dff"
                strokeWidth={2}
                style={{ cursor: handleCursor(handle.id) }}
                onPointerDown={(event) => handleResizePointerDown(layer, handle.id, event)}
              />
            ))}
          </>
        )}
      </g>
    );
  }

  function renderLayer(layer: TemplateCanvasObject) {
    if (layer.visible === false) return null;
    const key = layer.id ?? `${layer.type}-${layer.x ?? 0}-${layer.y ?? 0}`;
    const { x, y, w, h } = layerBox(layer);
    const angle = layerRotation(layer);
    const transform = angle ? `rotate(${angle} ${x + w / 2} ${y + h / 2})` : undefined;
    const selectionControls = renderSelectionControls(layer);

    if (layer.type === "rect") {
      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <rect x={x} y={y} width={w} height={h} fill={layer.fill ?? "transparent"} stroke={layer.stroke} strokeWidth={layer.strokeWidth ?? 0} opacity={layer.opacity ?? 1} rx={layer.rx ?? 0} ry={layer.ry ?? 0} />
          {selectionControls}
        </g>
      );
    }

    if (layer.type === "ellipse" || layer.type === "circle") {
      const cx = x + w / 2;
      const cy = y + h / 2;
      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill={layer.fill ?? "transparent"} stroke={layer.stroke} strokeWidth={layer.strokeWidth ?? 0} opacity={layer.opacity ?? 1} />
          {selectionControls}
        </g>
      );
    }

    if (layer.type === "line") {
      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <line x1={x} y1={y} x2={x + w} y2={y + h} stroke={layer.stroke ?? layer.fill ?? "#111111"} strokeLinecap="round" strokeWidth={layer.strokeWidth ?? 2} opacity={layer.opacity ?? 1} />
          {selectionControls}
        </g>
      );
    }

    if (layer.type === "shape") {
      const kind = layer.shapeKind ?? "rectangle";
      const stroke = layer.stroke ?? (layer.fill === "none" ? "#111111" : undefined);
      const strokeWidth = layer.strokeWidth ?? 2;
      const common = {
        fill: layer.fill ?? "#ffffff",
        stroke,
        strokeWidth,
        opacity: layer.opacity ?? 1
      };

      if (kind === "rectangle" || kind === "square") {
        return (
          <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
            <rect x={x} y={y} width={w} height={h} {...common} />
            {selectionControls}
          </g>
        );
      }

      if (kind === "rounded-rectangle") {
        return (
          <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
            <rect x={x} y={y} width={w} height={h} rx={Math.min(w, h) * 0.16} ry={Math.min(w, h) * 0.16} {...common} />
            {selectionControls}
          </g>
        );
      }

      if (kind === "circle" || kind === "oval") {
        return (
          <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
            <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} {...common} />
            {selectionControls}
          </g>
        );
      }

      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <path d={shapePath(kind, x, y, w, h)} fill={common.fill} stroke={common.stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth={common.strokeWidth} opacity={common.opacity} />
          {selectionControls}
        </g>
      );
    }

    if (layer.type === "image" && layer.src) {
      const clipId = layer.clipShape === "ellipse" ? `clip-${layer.id}` : undefined;

      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <image href={layer.src} x={x} y={y} width={w} height={h} opacity={layer.opacity ?? 1} clipPath={clipId ? `url(#${clipId})` : undefined} preserveAspectRatio={layer.clipShape === "rect" ? "xMidYMid meet" : "xMidYMid slice"} />
          {selectionControls}
        </g>
      );
    }

    if (layer.type === "image") {
      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <rect x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.35)" stroke="#94a3b8" strokeDasharray="8 8" strokeWidth="2" />
          <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#64748b">
            Image
          </text>
          {selectionControls}
        </g>
      );
    }

    const lines = String(layer.text ?? "").split("\n");
    const fontSize = layer.fontSize ?? 18;
    const textHitWidth = Math.max(w, 80, String(layer.text ?? "").split("\n").reduce((max, line) => Math.max(max, line.length), 0) * fontSize * 0.55);
    const textHitHeight = Math.max(h, estimateTextHeight(layer));
    return (
      <g
        key={key}
        transform={transform}
        style={{ cursor: isLockedObject(layer) ? "default" : "move" }}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          openTextEditor(layer);
        }}
        onPointerDown={(event) => handlePointerDown(layer, event)}
      >
        <rect
          x={x}
          y={y}
          width={textHitWidth}
          height={textHitHeight}
          fill="transparent"
          pointerEvents="all"
        />
        <text
          fill={layer.fill ?? "#111111"}
          fontFamily={layer.fontFamily ?? "Inter, Arial, sans-serif"}
          fontSize={fontSize}
          fontWeight={layer.fontWeight}
          fontStyle={layer.fontStyle}
          letterSpacing={layer.letterSpacing}
          opacity={layer.opacity ?? 1}
          textAnchor={textAnchor(layer.textAlign)}
          x={textX(layer)}
          y={y + fontSize}
        >
          {lines.map((line, lineIndex) => (
            <tspan key={lineIndex} x={textX(layer)} dy={lineIndex === 0 ? 0 : fontSize * 1.2}>
              {line}
            </tspan>
          ))}
        </text>
        {selectionControls}
      </g>
    );
  }

  const activeLayerName = activeLayer?.name ?? activeLayer?.id ?? "No selection";
  const activeLayerType = activeLayer?.type ?? "canvas";
  const canEditText = activeLayer?.type === "text";
  const canEditShape = Boolean(activeLayer && ["rect", "ellipse", "circle", "line", "shape"].includes(String(activeLayer.type)));
  const canEditImage = activeLayer?.type === "image";
  const activeOpacity = Math.round((activeLayer?.opacity ?? 1) * 100);
  const activeBox = activeLayer ? layerBox(activeLayer) : null;
  const activeRotation = activeLayer ? Math.round(layerRotation(activeLayer)) : 0;
  const scaledWidth = Math.max(240, (layout.width * zoom) / 100);
  const scaledHeight = Math.max(240, (layout.height * zoom) / 100);

  return (
    <div ref={editorRootRef} className="flex h-[calc(100dvh-9.5rem)] flex-col overflow-hidden bg-[#f0f1f5] text-ink lg:h-[calc(100dvh-6.25rem)]">
      <div className="flex min-h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white px-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[#8b3dff] text-sm font-black text-white">PN</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{activeLayerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {headerActions}
          <IconButton disabled={!canUndo} icon="undo" label="Undo" onClick={undoLayerChange} />
          <IconButton disabled={!activeLayer} icon="duplicate" label="Duplicate" onClick={duplicateLayer} />
          <IconButton disabled={!activeLayer} icon={activeLayer?.locked ? "unlock" : "lock"} label={activeLayer?.locked ? "Unlock" : "Lock"} onClick={toggleLockLayer} />
          <IconButton disabled={!activeLayer || activeLayer?.id === "bg"} icon="delete" label="Delete" onClick={deleteLayer} />
        </div>
      </div>

      <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-2 border-b border-black/10 bg-white px-3 py-2">
        <select
          className="h-9 min-w-36 border border-transparent bg-white px-2 text-sm shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist disabled:opacity-40"
          disabled={!canEditText}
          onChange={(event) => {
            setSelectedFontFamily(event.target.value);
            updateActive({ fontFamily: event.target.value });
          }}
          value={selectedFontFamily}
        >
          <option value="Inter">Inter</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Serif</option>
          <option value="Brush Script MT">Handwriting</option>
          <option value="Courier New">Mono</option>
        </select>
        <input
          className="h-9 w-20 border border-transparent bg-white px-2 text-sm shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist disabled:opacity-40"
          disabled={!canEditText}
          min="8"
          max="140"
          onChange={(event) => {
            const value = Number(event.target.value);
            setSelectedFontSize(value);
            updateActive({ fontSize: value });
          }}
          type="number"
          value={selectedFontSize}
        />
        <button className="h-9 w-9 border border-transparent bg-white text-sm font-black shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist disabled:opacity-40" disabled={!canEditText} onClick={() => toggleTextStyle("fontWeight")} type="button">B</button>
        <button className="h-9 w-9 border border-transparent bg-white text-sm font-black italic shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist disabled:opacity-40" disabled={!canEditText} onClick={() => toggleTextStyle("fontStyle")} type="button">I</button>
        <button className="h-9 w-9 border border-transparent bg-white text-sm font-black underline shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist disabled:opacity-40" disabled={!canEditText} onClick={() => toggleTextStyle("underline")} type="button">U</button>
        <div className="flex border border-transparent bg-white shadow-[0_1px_3px_rgba(15,23,42,0.10)]">
          <button className="h-9 w-9 bg-white text-xs font-bold transition hover:bg-mist disabled:opacity-40" disabled={!canEditText} onClick={() => alignText("left")} type="button">L</button>
          <button className="h-9 w-9 border-x border-black/10 bg-white text-xs font-bold transition hover:bg-mist disabled:opacity-40" disabled={!canEditText} onClick={() => alignText("center")} type="button">C</button>
          <button className="h-9 w-9 bg-white text-xs font-bold transition hover:bg-mist disabled:opacity-40" disabled={!canEditText} onClick={() => alignText("right")} type="button">R</button>
        </div>
        <label className="flex h-9 items-center gap-2 border border-transparent bg-white px-2 text-xs font-bold text-graphite shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist">
          Fill
          <input
            className="h-5 w-8 border border-black/10"
            disabled={!activeLayer}
            onChange={(event) => {
              setSelectedFill(event.target.value);
              updateActive({ fill: event.target.value });
            }}
            type="color"
            value={selectedFill}
          />
        </label>
        <label className="flex h-9 items-center gap-2 border border-transparent bg-white px-2 text-xs font-bold text-graphite shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist">
          Stroke
          <input
            className="h-5 w-8 border border-black/10"
            disabled={!activeLayer}
            onChange={(event) => {
              setSelectedStroke(event.target.value);
              updateActive({ stroke: event.target.value, strokeWidth: 2 });
            }}
            type="color"
            value={selectedStroke}
          />
        </label>
        <label className="flex h-9 items-center gap-2 border border-transparent bg-white px-2 text-xs font-bold text-graphite shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist">
          Opacity
          <input className="w-24" disabled={!activeLayer} max="100" min="0" onChange={(event) => setOpacity(Number(event.target.value))} type="range" value={activeOpacity} />
        </label>
        {(["x", "y", "w", "h"] as const).map((property) => (
          <label className="flex h-9 items-center gap-1 border border-transparent bg-white px-2 text-xs font-bold uppercase text-graphite shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist" key={property}>
            {property}
            <input
              className="h-7 w-16 border border-black/10 px-1 text-sm font-semibold text-ink disabled:bg-mist"
              disabled={!activeLayer}
              min={property === "w" || property === "h" ? MIN_LAYER_SIZE : undefined}
              onChange={(event) => setActiveBoxValue(property, Number(event.target.value))}
              type="number"
              value={Math.round(activeBox?.[property] ?? 0)}
            />
          </label>
        ))}
        <label className="flex h-9 items-center gap-1 border border-transparent bg-white px-2 text-xs font-bold text-graphite shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist">
          Rot
          <input
            className="h-7 w-16 border border-black/10 px-1 text-sm font-semibold text-ink disabled:bg-mist"
            disabled={!activeLayer}
            max="360"
            min="0"
            onChange={(event) => setActiveRotation(Number(event.target.value))}
            type="number"
            value={activeRotation}
          />
        </label>
        <div className="flex h-9 items-center border border-transparent bg-white shadow-[0_1px_3px_rgba(15,23,42,0.10)] transition hover:bg-mist">
          <button className="h-9 w-9 border-r border-black/10 text-sm font-bold" onClick={() => changeZoom(-ZOOM_STEP)} title="Zoom out (Ctrl -)" type="button">-</button>
          <select
            className="h-9 w-24 bg-white px-2 text-xs font-bold text-ink outline-none"
            onChange={(event) => {
              if (event.target.value === "fit") {
                zoomToFit();
              } else {
                setZoom(clampZoom(Number(event.target.value)));
              }
            }}
            title="Zoom"
            value={[25, 50, 75, 100, 125, 150, 200, 300].includes(zoom) ? String(zoom) : "custom"}
          >
            <option value="custom">{zoom}%</option>
            <option value="fit">Fit</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
            <option value="125">125%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
            <option value="300">300%</option>
          </select>
          <button className="h-9 w-9 border-l border-black/10 text-sm font-bold" onClick={() => changeZoom(ZOOM_STEP)} title="Zoom in (Ctrl +)" type="button">+</button>
        </div>
        <IconButton disabled={!activeLayer} icon="forward" label="Bring forward" onClick={() => moveLayer("forward")} />
        <IconButton disabled={!activeLayer} icon="backward" label="Send backward" onClick={() => moveLayer("backward")} />
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[4.5rem_17rem_minmax(0,1fr)]">
        <nav className="flex gap-px border-r border-black/10 bg-[#111827] p-1 text-white lg:flex-col">
          {[
            ["layers", "Layers", "layers"],
            ["text", "Text", "text"],
            ["design", "Design", "design"],
            ["uploads", "Uploads", "upload"],
            ["elements", "Elements", "elements"]
          ].map(([id, label, icon]) => (
            <button
              aria-label={label}
              className={[
                "flex min-h-16 flex-1 items-center justify-center border px-2 transition lg:flex-none",
                activePanel === id
                  ? "border-white/25 bg-[#8b3dff] text-white shadow-sm"
                  : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white"
              ].join(" ")}
              key={id}
              onClick={() => setActivePanel(id as typeof activePanel)}
              title={label}
              type="button"
            >
              <EditorIcon className="h-6 w-6" name={icon as EditorIconName} />
            </button>
          ))}
        </nav>

        <aside className="min-h-0 overflow-hidden border-r border-black/10 bg-white">
          <div className="border-b border-black/10 p-4">
            <p className="text-sm font-black text-ink">{activePanel === "design" ? "Design tools" : activePanel === "text" ? "Text" : activePanel === "uploads" ? "Uploads" : activePanel === "elements" ? "Elements" : "Layers"}</p>
            <p className="mt-1 text-xs text-graphite">{activeLayer ? `${activeLayerType} selected` : "Select an item on the artboard"}</p>
          </div>

          {activePanel === "design" ? (
            <div className="grid gap-3 p-4">
              <div className="grid grid-cols-4 gap-2">
                <IconButton className="h-11 w-full bg-[#8b3dff] text-white hover:bg-[#7a35e3]" icon="text" label="Add text" onClick={addTextLayer} />
                {SHAPE_LIBRARY.slice(0, 3).map((shape) => (
                  <button
                    aria-label={`Add ${shape.label}`}
                    className="grid h-11 place-items-center border border-black/10 bg-white text-ink transition hover:border-[#8b3dff] hover:bg-[#f4efff]"
                    key={shape.kind}
                    onClick={() => addShapeLayer(shape)}
                    title={shape.label}
                    type="button"
                  >
                    <ShapeGlyph shape={shape} />
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2 border-t border-black/10 pt-4">
                {["#111827", "#8b3dff", "#2563eb", "#0f766e", "#ea580c", "#dc2626", "#f59e0b", "#ffffff", "#f8fafc", "#000000"].map((color) => (
                  <button
                    aria-label={`Use ${color}`}
                    className="h-8 border border-black/10"
                    key={color}
                    onClick={() => {
                      setSelectedFill(color);
                      updateActive({ fill: color });
                    }}
                    style={{ backgroundColor: color }}
                    type="button"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {activePanel === "text" ? (
            <div className="grid gap-4 p-4">
              <IconButton className="h-11 w-full bg-[#8b3dff] text-white hover:bg-[#7a35e3]" icon="text" label="Add text box" onClick={addTextLayer} />
              <label className="grid gap-2 text-xs font-bold text-graphite">
                Content
                <textarea
                  ref={textEditorRef}
                  className="min-h-32 border border-black/10 px-3 py-2 text-sm font-medium text-ink disabled:bg-mist"
                  disabled={!canEditText}
                  onChange={(event) => {
                    setSelectedText(event.target.value);
                    updateActive({ text: event.target.value });
                  }}
                  value={selectedText}
                />
              </label>
              <label className="grid gap-2 text-xs font-bold text-graphite">
                Letter spacing
                <input
                  className="h-10 border border-black/10 px-2 text-sm disabled:bg-mist"
                  disabled={!canEditText}
                  max="12"
                  min="0"
                  onChange={(event) => updateActive({ letterSpacing: Number(event.target.value) })}
                  type="number"
                  value={Number(activeLayer?.letterSpacing ?? 0)}
                />
              </label>
            </div>
          ) : null}

          {activePanel === "uploads" ? (
            <div className="grid gap-4 p-4">
              <label className="grid min-h-32 cursor-pointer place-items-center border border-dashed border-black/25 bg-mist px-4 text-center text-sm font-bold text-ink">
                {canEditImage ? "Replace selected image" : "Upload image"}
                <input accept="image/*" className="sr-only" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) replaceSelectedImageLayer(file);
                  event.target.value = "";
                }} type="file" />
              </label>
              <p className="text-xs leading-5 text-graphite">Select an image frame to replace it, or upload with no selection to add a new image layer.</p>
            </div>
          ) : null}

          {activePanel === "elements" ? (
            <div className="grid gap-3 p-4">
              <div className="grid grid-cols-3 gap-2">
                {SHAPE_LIBRARY.map((shape) => (
                  <button
                    aria-label={`Add ${shape.label}`}
                    className="grid h-16 cursor-grab place-items-center border border-black/10 bg-white text-ink transition hover:border-[#8b3dff] hover:bg-[#f4efff] active:cursor-grabbing"
                    draggable
                    key={shape.kind}
                    onClick={() => addShapeLayer(shape)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("application/printnepal-shape", shape.kind);
                      event.dataTransfer.effectAllowed = "copy";
                    }}
                    title={shape.label}
                    type="button"
                  >
                    <ShapeGlyph shape={shape} />
                  </button>
                ))}
              </div>
              <label className="grid gap-2 border-t border-black/10 pt-4 text-xs font-bold text-graphite">
                Corner radius
                <input
                  className="h-10 border border-black/10 px-2 text-sm disabled:bg-mist"
                  disabled={!canEditShape}
                  max="80"
                  min="0"
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setSelectedRadius(value);
                    updateActive({ rx: value, ry: value });
                  }}
                  type="number"
                  value={selectedRadius}
                />
              </label>
            </div>
          ) : null}

          {activePanel === "layers" ? (
            <div className="max-h-[34rem] overflow-y-auto p-3">
              {layers.map((layer, index) => {
                const id = layer.id ?? `layer-${index}`;
                return (
                  <div className={["mb-2 grid grid-cols-[1fr_auto] items-center gap-2 border px-3 py-2", selectedId === id ? "border-[#8b3dff] bg-[#f4efff]" : "border-black/10 bg-white"].join(" ")} key={id}>
                    <button className="min-w-0 text-left" onClick={() => selectLayerById(id)} type="button">
                      <span className="block truncate text-sm font-bold text-ink">{layer.name ?? id}</span>
                      <span className="text-xs text-graphite">{layer.type ?? "layer"}</span>
                    </button>
                    <button
                      aria-label={layer.visible === false ? "Show layer" : "Hide layer"}
                      className="grid h-8 w-8 place-items-center border border-black/10 bg-white text-ink"
                      onClick={() => toggleVisibleLayer(id)}
                      title={layer.visible === false ? "Show layer" : "Hide layer"}
                      type="button"
                    >
                      <EditorIcon name={layer.visible === false ? "eyeOff" : "eye"} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}
        </aside>

        <main className="grid min-h-0 grid-rows-[minmax(0,1fr)_3.25rem] bg-[#edf0f5]">
          <div
            ref={canvasViewportRef}
            className="flex min-h-0 items-center justify-center overflow-auto p-8"
            onWheel={handleCanvasWheel}
          >
            <div
              className="bg-white shadow-[0_8px_32px_rgba(15,23,42,0.18)]"
              style={{ width: scaledWidth, height: scaledHeight }}
            >
              <svg
                ref={svgRef}
                preserveAspectRatio="xMidYMid meet"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block"
                }}
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                onPointerMove={handlePointerMove}
                onPointerUp={(event) => {
                  stopInteraction();
                  releasePointerCapture(event);
                }}
                onPointerCancel={(event) => {
                  stopInteraction();
                  releasePointerCapture(event);
                }}
                onPointerLeave={(event) => {
                  if (interactionRef.current) {
                    stopInteraction();
                    releasePointerCapture(event);
                  }
                }}
                onPointerDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setSelectedId(null);
                  }
                }}
                onDragOver={(event) => {
                  if (event.dataTransfer.types.includes("application/printnepal-shape")) {
                    event.preventDefault();
                  }
                }}
                onDrop={handleShapeDrop}
              >
                <defs>
                  {clipLayers.map((layer) => {
                    const { x, y, w, h } = layerBox(layer);
                    return (
                      <clipPath id={`clip-${layer.id}`} key={layer.id}>
                        <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} />
                      </clipPath>
                    );
                  })}
                </defs>
                <rect fill={layout.background} x="0" y="0" width={layout.width} height={layout.height} />
                {renderLayers.map((layer) => renderLayer(layer))}
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-black/10 bg-white px-4">
            <div className="text-xs font-bold text-graphite">{activeLayer ? `${activeLayerType}: ${activeLayerName}` : "Canvas"}</div>
            <div className="flex items-center gap-3">
              <button className="h-8 border border-black/10 bg-white px-3 text-xs font-bold" onClick={zoomToFit} title="Fit to view (Ctrl 1)" type="button">Fit</button>
              <button className="h-8 border border-black/10 bg-white px-3 text-xs font-bold" onClick={() => setZoom(100)} title="Actual size (Ctrl 0)" type="button">100%</button>
              <button className="h-8 w-8 border border-black/10 bg-white text-sm font-bold" onClick={() => changeZoom(-ZOOM_STEP)} type="button">-</button>
              <input className="w-40" max={ZOOM_MAX} min={ZOOM_MIN} onChange={(event) => setZoom(clampZoom(Number(event.target.value)))} type="range" value={zoom} />
              <button className="h-8 w-8 border border-black/10 bg-white text-sm font-bold" onClick={() => changeZoom(ZOOM_STEP)} type="button">+</button>
              <span className="w-12 text-right text-xs font-bold text-graphite">{zoom}%</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});
