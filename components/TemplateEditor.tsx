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
      className="flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white text-sm font-semibold text-ink transition hover:border-black/25 hover:bg-mist"
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
  return field === "photo" || field === "logo";
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
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-[13px] font-semibold text-ink transition hover:border-violet-300 hover:bg-violet-50"
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

  function selectLayer(layer: TemplateCanvasObject) {
    if (!layer.id) return;
    setSelectedId(layer.id);
  }

  function isStudentIdTemplate() {
    return (category ?? "").toLowerCase().includes("student") || fields.includes("student_name");
  }

  function getRenderLayers() {
    const merged = layers.map((layer) => {
      if (layer.field && Object.prototype.hasOwnProperty.call(values, layer.field) && typeof layer.text === "string") {
        const nextText = values[layer.field];
        return {
          ...layer,
          text: ["roll_number", "phone", "blood_group", "expiry_date"].includes(layer.field) && layer.text.includes(":")
            ? `${layer.text.split(":")[0]}: ${nextText}`
            : nextText
        };
      }
      if (layer.field === "color" && layer.role === "accent" && values.color) {
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
          if (layer.field !== field || typeof layer.text !== "string") return layer;
          const nextText = ["roll_number", "phone", "blood_group", "expiry_date"].includes(field) && layer.text.includes(":")
            ? `${layer.text.split(":")[0]}: ${value}`
            : value;
          return { ...layer, text: nextText };
        })
      );
    },
    replaceImage(field, dataUrl) {
      setLayers((current) =>
        current.map((layer) => (layer.field === field && layer.type === "image" ? { ...layer, src: dataUrl, placeholder: false } : layer))
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
        stroke="#4A90E2"
        strokeDasharray="6,3"
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
            stroke="#4A90E2"
            strokeDasharray="6,3"
            strokeWidth={2}
            width={layer.width ?? layer.w ?? 0}
            x={x - 2}
            y={y - 2}
          />
        ) : null}
      </g>
    );
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="sticky top-4 z-20 self-start rounded-[1rem] border border-black/10 bg-white p-3 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-graphite">Tools</p>
        <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
          <ToolButton label="Add text" onClick={addTextLayer}>T</ToolButton>
          <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-black/10 bg-white text-sm text-ink transition hover:border-black/25 hover:bg-mist" title="Add image">
            Img
            <input accept="image/*" className="sr-only" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadImageLayer(file);
            }} type="file" />
          </label>
          <ToolButton label="Rectangle" onClick={addRectangleLayer}>▭</ToolButton>
          <ToolButton label="Circle" onClick={addCircleLayer}>○</ToolButton>
          <ToolButton label="Line" onClick={addLineLayer}>╱</ToolButton>
          <ToolButton label="Bold" onClick={() => toggleTextStyle("fontWeight")}>B</ToolButton>
          <ToolButton label="Italic" onClick={() => toggleTextStyle("fontStyle")}><span className="italic">I</span></ToolButton>
          <ToolButton label="Underline" onClick={() => toggleTextStyle("underline")}><span className="underline">U</span></ToolButton>
          <ToolButton label="Align left" onClick={() => alignText("left")}>L</ToolButton>
          <ToolButton label="Align center" onClick={() => alignText("center")}>C</ToolButton>
          <ToolButton label="Align right" onClick={() => alignText("right")}>R</ToolButton>
          <ToolButton label="Duplicate" onClick={duplicateLayer}>⧉</ToolButton>
          <ToolButton label="Delete" onClick={deleteLayer}>×</ToolButton>
          <ToolButton label="Bring forward" onClick={() => moveLayer("forward")}>↑</ToolButton>
          <ToolButton label="Send backward" onClick={() => moveLayer("backward")}>↓</ToolButton>
        </div>

        <div className="mt-4 grid gap-3 border-t border-black/10 pt-4">
          <label className="grid gap-1 text-xs font-medium text-graphite">
            Text
            <input
              className="min-h-9 rounded-md border border-black/10 px-2 text-sm text-ink"
              onChange={(event) => {
                setSelectedText(event.target.value);
                updateActive({ text: event.target.value });
              }}
              value={selectedText}
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-graphite">
            Font
            <select
              className="min-h-9 rounded-md border border-black/10 px-2 text-sm text-ink"
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
          </label>
          <label className="grid gap-1 text-xs font-medium text-graphite">
            Font size
            <input
              className="min-h-9 rounded-md border border-black/10 px-2 text-sm text-ink"
              min="8"
              max="96"
              onChange={(event) => {
                const value = Number(event.target.value);
                setSelectedFontSize(value);
                updateActive({ fontSize: value });
              }}
              type="number"
              value={selectedFontSize}
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-graphite">
            Border radius
            <input
              className="min-h-9 rounded-md border border-black/10 px-2 text-sm text-ink"
              min="0"
              max="80"
              onChange={(event) => {
                const value = Number(event.target.value);
                setSelectedRadius(value);
                updateActive({ rx: value, ry: value });
              }}
              type="number"
              value={selectedRadius}
            />
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="grid gap-1 text-xs font-medium text-graphite">
              Text
              <input className="h-9 w-full rounded-md border border-black/10" onChange={(event) => applyColor(event.target.value)} type="color" value={selectedFill} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-graphite">
              Fill
              <input
                className="h-9 w-full rounded-md border border-black/10"
                onChange={(event) => {
                  setSelectedFill(event.target.value);
                  updateActive({ fill: event.target.value });
                }}
                type="color"
                value={selectedFill}
              />
            </label>
            <label className="grid gap-1 text-xs font-medium text-graphite">
              Border
              <input
                className="h-9 w-full rounded-md border border-black/10"
                onChange={(event) => {
                  setSelectedStroke(event.target.value);
                  updateActive({ stroke: event.target.value, strokeWidth: 2 });
                }}
                type="color"
                value={selectedStroke}
              />
            </label>
          </div>
        </div>
      </aside>

      <div className="relative z-0 flex min-h-[42rem] items-start justify-center rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm">
        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-sm rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          SVG template editor
        </div>
        <div className="flex h-full w-full items-start justify-center pt-2">
          <svg
            ref={svgRef}
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
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
    </div>
  );
});
