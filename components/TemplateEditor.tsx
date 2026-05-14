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
};

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
  return Boolean(object.locked || object.selectable === false);
}

function normalizedLayers(template: TemplateEditorValue) {
  const layout = resolveTemplateLayout(template);
  return layout.objects.map((layer, index) => ({
    ...layer,
    id: layer.id ?? `layer-${index}`
  }));
}

function layerBox(layer: TemplateCanvasObject) {
  const x = layer.left ?? layer.x ?? 0;
  const y = layer.top ?? layer.y ?? 0;
  const w = layer.width ?? layer.w ?? 0;
  const h = layer.height ?? layer.h ?? 0;
  return { x, y, w, h };
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
  { template, values = {}, fields = [], category, baseImageUrl },
  ref
) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const layout = useMemo(() => resolveTemplateLayout(template), [template]);
  const [layers, setLayers] = useState<TemplateCanvasObject[]>(() => normalizedLayers(template));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFill, setSelectedFill] = useState("#111111");
  const [selectedStroke, setSelectedStroke] = useState("#111111");
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedFontFamily, setSelectedFontFamily] = useState("Inter");
  const [selectedText, setSelectedText] = useState("");
  const [selectedRadius, setSelectedRadius] = useState(0);
  const [activePanel, setActivePanel] = useState<"design" | "text" | "uploads" | "elements" | "layers">("design");
  const [zoom, setZoom] = useState(92);

  useEffect(() => {
    setLayers(normalizedLayers(template));
    setSelectedId(null);
  }, [template]);

  const activeLayer = useMemo(() => layers.find((layer) => layer.id === selectedId) ?? null, [layers, selectedId]);

  useEffect(() => {
    if (!activeLayer) return;
    setSelectedFill(typeof activeLayer.fill === "string" ? activeLayer.fill : "#111111");
    setSelectedStroke(typeof activeLayer.stroke === "string" ? activeLayer.stroke : "#111111");
    setSelectedFontSize(activeLayer.fontSize ?? 24);
    setSelectedFontFamily(activeLayer.fontFamily ?? "Inter");
    setSelectedText(typeof activeLayer.text === "string" ? activeLayer.text : "");
    setSelectedRadius(activeLayer.rx ?? 0);
  }, [activeLayer]);

  function updateLayer(id: string, updater: (layer: TemplateCanvasObject) => TemplateCanvasObject) {
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

  function pointerToSvgCoords(event: React.PointerEvent<SVGElement>) {
    const svgEl = svgRef.current;
    if (!svgEl) return { x: 0, y: 0 };
    const pt = svgEl.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const ctm = svgEl.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgCoords = pt.matrixTransform(ctm.inverse());
    return { x: svgCoords.x, y: svgCoords.y };
  }

  function handlePointerDown(layer: TemplateCanvasObject, event: React.PointerEvent<SVGElement>) {
    event.preventDefault();
    event.stopPropagation();
    selectLayer(layer);
    if (isLockedObject(layer) || !layer.id) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragPointerIdRef.current = event.pointerId;
    } catch {
      dragPointerIdRef.current = null;
    }
    const point = pointerToSvgCoords(event);
    const { x, y } = layerBox(layer);
    dragRef.current = {
      id: layer.id,
      offsetX: point.x - x,
      offsetY: point.y - y
    };
  }

  function handlePointerMove(event: React.PointerEvent<SVGElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const point = pointerToSvgCoords(event);
    updateLayer(drag.id, (layer) => {
      const next = { ...layer, left: point.x - drag.offsetX, top: point.y - drag.offsetY };
      return next;
    });
  }

  function stopDragging() {
    dragRef.current = null;
    dragPointerIdRef.current = null;
  }

  function releasePointerCapture(event: React.PointerEvent<SVGElement>) {
    const pointerId = dragPointerIdRef.current;
    if (pointerId === null) return;
    try {
      event.currentTarget.releasePointerCapture(pointerId);
    } catch {
      // Ignore capture release issues; the drag state is already reset.
    } finally {
      dragPointerIdRef.current = null;
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
      setLayers((current) =>
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
      setLayers((current) =>
        current.map((layer) => (layerField(layer) === field && layer.type === "image" ? { ...layer, src: dataUrl, placeholder: false } : layer))
      );
    }
  }));

  function addTextLayer() {
    const id = `layer-${Date.now()}`;
    setLayers((current) => [
      ...current,
      {
        id,
        type: "text",
        text: "New text",
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
    setSelectedId(id);
  }

  function addRectangleLayer() {
    const id = `layer-${Date.now()}`;
    setLayers((current) => [
      ...current,
      {
        id,
        type: "rect",
        x: 90,
        y: 110,
        width: 180,
        height: 90,
        fill: "#ffffff",
        stroke: selectedStroke,
        strokeWidth: 2,
        rx: selectedRadius,
        ry: selectedRadius,
        visible: true
      }
    ]);
    setSelectedId(id);
  }

  function addCircleLayer() {
    const id = `layer-${Date.now()}`;
    setLayers((current) => [
      ...current,
      {
        id,
        type: "ellipse",
        x: 120,
        y: 120,
        width: 110,
        height: 110,
        fill: "#ffffff",
        stroke: selectedStroke,
        strokeWidth: 2,
        visible: true
      }
    ]);
    setSelectedId(id);
  }

  function addLineLayer() {
    const id = `layer-${Date.now()}`;
    setLayers((current) => [
      ...current,
      {
        id,
        type: "line",
        x: 90,
        y: 140,
        width: 170,
        height: 0,
        stroke: selectedStroke,
        strokeWidth: 3,
        visible: true
      }
    ]);
    setSelectedId(id);
  }

  function uploadImageLayer(file: File) {
    const id = `layer-${Date.now()}`;
    const objectUrl = URL.createObjectURL(file);
    setLayers((current) => [
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
    setLayers((current) => {
      const layer = current.find((item) => item.id === activeLayer.id);
      if (!layer) return current;
      return [...current, { ...layer, id, left: (layer.left ?? 0) + 20, top: (layer.top ?? 0) + 20 }];
    });
    setSelectedId(id);
  }

  function deleteLayer() {
    if (!activeLayer || activeLayer.id === "bg") return;
    setLayers((current) => current.filter((layer) => layer.id !== activeLayer.id));
    setSelectedId(null);
  }

  function moveLayer(direction: "forward" | "backward") {
    if (!activeLayer) return;
    setLayers((current) => {
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
    updateLayer(activeLayer.id ?? "", (layer) => ({ ...layer, locked: !layer.locked }));
  }

  function toggleVisibleLayer(id: string) {
    updateLayer(id, (layer) => ({ ...layer, visible: layer.visible === false }));
  }

  function openTextEditor() {
    if (!activeLayer || activeLayer.type !== "text") return;
    if (typeof window === "undefined") return;
    const next = window.prompt("Edit text", activeLayer.text ?? "");
    if (next === null) return;
    updateLayer(activeLayer.id ?? "", (layer) => ({ ...layer, text: next }));
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

  function renderLayer(layer: TemplateCanvasObject) {
    if (layer.visible === false) return null;
    const key = layer.id ?? `${layer.type}-${layer.x ?? 0}-${layer.y ?? 0}`;
    const { x, y, w, h } = layerBox(layer);
    const angle = layer.rotation ?? layer.angle ?? 0;
    const transform = angle ? `rotate(${angle} ${x} ${y})` : undefined;

    const selectedOverlay = selectedId === layer.id ? (
      <rect
        data-selection-overlay="true"
        x={x - 2}
        y={y - 2}
        width={w + 4}
        height={h + 4}
        fill="none"
        stroke="#8b3dff"
        strokeDasharray="5,4"
        strokeWidth={2}
        pointerEvents="none"
      />
    ) : null;

    if (layer.type === "rect") {
      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <rect x={x} y={y} width={w} height={h} fill={layer.fill ?? "transparent"} stroke={layer.stroke} strokeWidth={layer.strokeWidth ?? 0} opacity={layer.opacity ?? 1} rx={layer.rx ?? 0} ry={layer.ry ?? 0} />
          {selectedOverlay}
        </g>
      );
    }

    if (layer.type === "ellipse" || layer.type === "circle") {
      const cx = x + w / 2;
      const cy = y + h / 2;
      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill={layer.fill ?? "transparent"} stroke={layer.stroke} strokeWidth={layer.strokeWidth ?? 0} opacity={layer.opacity ?? 1} />
          {selectedOverlay}
        </g>
      );
    }

    if (layer.type === "line") {
      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <line x1={x} y1={y} x2={x + w} y2={y + h} stroke={layer.stroke ?? layer.fill ?? "#111111"} strokeLinecap="round" strokeWidth={layer.strokeWidth ?? 2} opacity={layer.opacity ?? 1} />
          {selectedOverlay}
        </g>
      );
    }

    if (layer.type === "image" && layer.src) {
      const clipId = layer.clipShape === "ellipse" ? `clip-${layer.id}` : undefined;

      return (
        <g key={key} transform={transform} onPointerDown={(event) => handlePointerDown(layer, event)}>
          <image href={layer.src} x={x} y={y} width={w} height={h} opacity={layer.opacity ?? 1} clipPath={clipId ? `url(#${clipId})` : undefined} preserveAspectRatio={layer.clipShape === "rect" ? "xMidYMid meet" : "xMidYMid slice"} />
          {selectedOverlay}
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
          {selectedOverlay}
        </g>
      );
    }

    const lines = String(layer.text ?? "").split("\n");
    const fontSize = layer.fontSize ?? 18;
    return (
      <g
        key={key}
        transform={transform}
        onDoubleClick={openTextEditor}
        onPointerDown={(event) => handlePointerDown(layer, event)}
      >
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
        {selectedId === layer.id ? (
          <rect
            data-selection-overlay="true"
            fill="none"
            height={layer.height ?? estimateTextHeight(layer)}
            pointerEvents="none"
            stroke="#8b3dff"
            strokeDasharray="5,4"
            strokeWidth={2}
            width={layer.width ?? layer.w ?? 0}
            x={x - 2}
            y={y - 2}
          />
        ) : null}
      </g>
    );
  }

  const activeLayerName = activeLayer?.name ?? activeLayer?.id ?? "No selection";
  const activeLayerType = activeLayer?.type ?? "canvas";
  const canEditText = activeLayer?.type === "text";
  const canEditShape = Boolean(activeLayer && ["rect", "ellipse", "circle", "line"].includes(String(activeLayer.type)));
  const canEditImage = activeLayer?.type === "image";
  const activeOpacity = Math.round((activeLayer?.opacity ?? 1) * 100);
  const scaledWidth = Math.max(240, (layout.width * zoom) / 100);
  const scaledHeight = Math.max(240, (layout.height * zoom) / 100);

  return (
    <div className="min-h-[46rem] overflow-hidden border border-black/10 bg-[#f0f1f5] text-ink">
      <div className="flex min-h-14 items-center justify-between border-b border-black/10 bg-white px-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[#8b3dff] text-sm font-black text-white">PN</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{activeLayerName}</p>
            <p className="text-xs text-graphite">{layout.width} x {layout.height}px artboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 border border-black/10 bg-white px-3 text-sm font-semibold text-ink disabled:opacity-40" disabled={!activeLayer} onClick={duplicateLayer} type="button">Duplicate</button>
          <button className="h-9 border border-black/10 bg-white px-3 text-sm font-semibold text-ink disabled:opacity-40" disabled={!activeLayer} onClick={toggleLockLayer} type="button">
            {activeLayer?.locked ? "Unlock" : "Lock"}
          </button>
          <button className="h-9 border border-black/10 bg-white px-3 text-sm font-semibold text-ink disabled:opacity-40" disabled={!activeLayer || activeLayer?.id === "bg"} onClick={deleteLayer} type="button">Delete</button>
        </div>
      </div>

      <div className="flex min-h-12 flex-wrap items-center gap-2 border-b border-black/10 bg-white px-3 py-2">
        <select
          className="h-9 min-w-36 border border-black/10 bg-white px-2 text-sm disabled:opacity-40"
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
          className="h-9 w-20 border border-black/10 bg-white px-2 text-sm disabled:opacity-40"
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
        <button className="h-9 w-9 border border-black/10 bg-white text-sm font-black disabled:opacity-40" disabled={!canEditText} onClick={() => toggleTextStyle("fontWeight")} type="button">B</button>
        <button className="h-9 w-9 border border-black/10 bg-white text-sm font-black italic disabled:opacity-40" disabled={!canEditText} onClick={() => toggleTextStyle("fontStyle")} type="button">I</button>
        <button className="h-9 w-9 border border-black/10 bg-white text-sm font-black underline disabled:opacity-40" disabled={!canEditText} onClick={() => toggleTextStyle("underline")} type="button">U</button>
        <div className="flex border border-black/10">
          <button className="h-9 w-9 bg-white text-xs font-bold disabled:opacity-40" disabled={!canEditText} onClick={() => alignText("left")} type="button">L</button>
          <button className="h-9 w-9 border-x border-black/10 bg-white text-xs font-bold disabled:opacity-40" disabled={!canEditText} onClick={() => alignText("center")} type="button">C</button>
          <button className="h-9 w-9 bg-white text-xs font-bold disabled:opacity-40" disabled={!canEditText} onClick={() => alignText("right")} type="button">R</button>
        </div>
        <label className="flex h-9 items-center gap-2 border border-black/10 bg-white px-2 text-xs font-bold text-graphite">
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
        <label className="flex h-9 items-center gap-2 border border-black/10 bg-white px-2 text-xs font-bold text-graphite">
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
        <label className="flex h-9 items-center gap-2 border border-black/10 bg-white px-2 text-xs font-bold text-graphite">
          Opacity
          <input className="w-24" disabled={!activeLayer} max="100" min="0" onChange={(event) => setOpacity(Number(event.target.value))} type="range" value={activeOpacity} />
        </label>
        <button className="h-9 border border-black/10 bg-white px-3 text-sm font-semibold disabled:opacity-40" disabled={!activeLayer} onClick={() => moveLayer("forward")} type="button">Forward</button>
        <button className="h-9 border border-black/10 bg-white px-3 text-sm font-semibold disabled:opacity-40" disabled={!activeLayer} onClick={() => moveLayer("backward")} type="button">Backward</button>
      </div>

      <div className="grid min-h-[40rem] lg:grid-cols-[4.5rem_17rem_minmax(0,1fr)]">
        <nav className="flex border-r border-black/10 bg-[#111827] text-white lg:flex-col">
          {[
            ["design", "Design"],
            ["text", "Text"],
            ["uploads", "Uploads"],
            ["elements", "Elements"],
            ["layers", "Layers"]
          ].map(([id, label]) => (
            <button
              className={["flex min-h-16 flex-1 flex-col items-center justify-center gap-1 px-2 text-[11px] font-bold transition lg:flex-none", activePanel === id ? "bg-[#8b3dff] text-white" : "text-white/75 hover:bg-white/10 hover:text-white"].join(" ")}
              key={id}
              onClick={() => setActivePanel(id as typeof activePanel)}
              type="button"
            >
              <span className="text-lg">{label.slice(0, 1)}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <aside className="border-r border-black/10 bg-white">
          <div className="border-b border-black/10 p-4">
            <p className="text-sm font-black text-ink">{activePanel === "design" ? "Design tools" : activePanel === "text" ? "Text" : activePanel === "uploads" ? "Uploads" : activePanel === "elements" ? "Elements" : "Layers"}</p>
            <p className="mt-1 text-xs text-graphite">{activeLayer ? `${activeLayerType} selected` : "Select an item on the artboard"}</p>
          </div>

          {activePanel === "design" ? (
            <div className="grid gap-3 p-4">
              <button className="min-h-11 bg-[#8b3dff] px-4 text-sm font-bold text-white" onClick={addTextLayer} type="button">Add heading</button>
              <button className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold text-ink" onClick={addRectangleLayer} type="button">Add shape block</button>
              <button className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold text-ink" onClick={addCircleLayer} type="button">Add circle</button>
              <button className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold text-ink" onClick={addLineLayer} type="button">Add line</button>
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
              <button className="min-h-11 bg-[#8b3dff] px-4 text-sm font-bold text-white" onClick={addTextLayer} type="button">Add text box</button>
              <label className="grid gap-2 text-xs font-bold text-graphite">
                Content
                <textarea
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
                Upload image
                <input accept="image/*" className="sr-only" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) uploadImageLayer(file);
                }} type="file" />
              </label>
              <p className="text-xs leading-5 text-graphite">Uploaded images can be dragged on the artboard and reordered from the Layers panel.</p>
            </div>
          ) : null}

          {activePanel === "elements" ? (
            <div className="grid gap-3 p-4">
              <button className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold text-ink" onClick={addRectangleLayer} type="button">Rectangle</button>
              <button className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold text-ink" onClick={addCircleLayer} type="button">Circle</button>
              <button className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold text-ink" onClick={addLineLayer} type="button">Line</button>
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
                    <button className="h-8 w-8 border border-black/10 bg-white text-xs font-bold" onClick={() => toggleVisibleLayer(id)} type="button">
                      {layer.visible === false ? "Off" : "On"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}
        </aside>

        <main className="grid min-h-[40rem] grid-rows-[minmax(0,1fr)_3.25rem] bg-[#edf0f5]">
          <div className="flex min-h-0 items-center justify-center overflow-auto p-8">
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
                  stopDragging();
                  releasePointerCapture(event);
                }}
                onPointerCancel={(event) => {
                  stopDragging();
                  releasePointerCapture(event);
                }}
                onPointerLeave={(event) => {
                  if (dragRef.current) {
                    stopDragging();
                    releasePointerCapture(event);
                  }
                }}
                onPointerDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setSelectedId(null);
                  }
                }}
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
              <button className="h-8 w-8 border border-black/10 bg-white text-sm font-bold" onClick={() => setZoom((value) => Math.max(35, value - 10))} type="button">-</button>
              <input className="w-32" max="160" min="35" onChange={(event) => setZoom(Number(event.target.value))} type="range" value={zoom} />
              <button className="h-8 w-8 border border-black/10 bg-white text-sm font-bold" onClick={() => setZoom((value) => Math.min(160, value + 10))} type="button">+</button>
              <span className="w-12 text-right text-xs font-bold text-graphite">{zoom}%</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});
