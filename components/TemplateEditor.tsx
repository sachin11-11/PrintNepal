"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type TemplateObject = {
  type: "rect" | "text" | "image" | "circle" | "line";
  field?: string;
  role?: "accent" | "placeholder" | "base";
  text?: string;
  src?: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rx?: number;
  ry?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  angle?: number;
  selectable?: boolean;
  locked?: boolean;
};

type ActiveLayerState = {
  left: number;
  top: number;
  width: number;
  height: number;
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
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

export type TemplateEditorValue = {
  width?: number;
  height?: number;
  background?: string;
  accent?: string;
  objects?: TemplateObject[];
};

export type TemplateEditorHandle = {
  exportPng: () => string;
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

export const TemplateEditor = forwardRef<TemplateEditorHandle, TemplateEditorProps>(function TemplateEditor(
  { template, values = {}, fields = [], category, baseImageUrl },
  ref
) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasViewportRef = useRef<HTMLDivElement | null>(null);
  const fabricCanvasRef = useRef<any>(null);
  const fabricRef = useRef<any>(null);
  const [selectedFill, setSelectedFill] = useState("#111111");
  const [selectedStroke, setSelectedStroke] = useState("#111111");
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedFontFamily, setSelectedFontFamily] = useState("Inter");
  const [selectedText, setSelectedText] = useState("");
  const [selectedRadius, setSelectedRadius] = useState(0);
  const [isCanvasLoading, setIsCanvasLoading] = useState(true);
  const [canvasError, setCanvasError] = useState("");
  const [canvasSize, setCanvasSize] = useState({
    width: template.width ?? 640,
    height: template.height ?? 400
  });
  const [activeLayer, setActiveLayer] = useState<ActiveLayerState | null>(null);

  useImperativeHandle(ref, () => ({
    exportPng() {
      return fabricCanvasRef.current?.toDataURL({ format: "png", multiplier: 2 }) ?? "";
    },
    exportJson() {
      return fabricCanvasRef.current?.toJSON(["field", "role", "locked", "textAlign"]);
    },
    updateField(field, value) {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      canvas.getObjects().forEach((object: any) => {
        if (field === "color") {
          if (object.role === "accent") {
            object.set("fill", value);
          }
        } else if (object.field === field && typeof object.set === "function") {
          if (typeof object.text === "string") {
            object.set("text", value);
          }
        }
      });
      canvas.requestRenderAll();
    },
    replaceImage(field, dataUrl) {
      const fabric = fabricRef.current;
      const canvas = fabricCanvasRef.current;
      if (!fabric || !canvas) return;
      const target = canvas.getObjects().find((object: any) => object.field === field);
      fabric.Image.fromURL(dataUrl).then((image: any) => {
        const width = Number(target?.width ?? 150);
        const height = Number(target?.height ?? 150);
        image.set({
          field,
          role: "placeholder",
          left: target?.left ?? 420,
          top: target?.top ?? 120,
          scaleX: (width / image.width) || 1,
          scaleY: (height / image.height) || 1
        });
        if (target) canvas.remove(target);
        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.requestRenderAll();
      });
    }
  }));

  function fieldLabel(field: string) {
    return field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function isImageField(field: string) {
    return field === "photo" || field === "logo";
  }

  function fieldText(field: string) {
    return values[field] || fieldLabel(field);
  }

  function isStudentIdTemplate() {
    return (category ?? "").toLowerCase().includes("student") || fields.includes("student_name");
  }

  function isLockedObject(object: any) {
    return Boolean(object?.locked || object?.lockMovementX || object?.lockMovementY || object?.selectable === false);
  }

  function fitCanvasToViewport(canvas: any, designWidth = template.width ?? 640, designHeight = template.height ?? 400) {
    const viewport = canvasViewportRef.current;
    if (!canvas || !viewport) return;

    const padding = 32;
    const width = Math.max(280, viewport.clientWidth - padding);
    const height = Math.max(360, viewport.clientHeight - padding);
    const scale = Math.min(width / designWidth, height / designHeight);
    const offsetX = Math.round((width - designWidth * scale) / 2);
    const offsetY = Math.round((height - designHeight * scale) / 2);

    canvas.setDimensions({ width, height });
    canvas.setViewportTransform([scale, 0, 0, scale, offsetX, offsetY]);
    canvas.calcOffset?.();
    canvas.requestRenderAll?.();
  }

  function studentIdObjects(): TemplateObject[] {
    const useRealBase = Boolean(baseImageUrl);

    if (useRealBase) {
      return [];
    }

    const accent = values.color || template.accent || "#1d4ed8";
    const fallbackBase: TemplateObject[] = [
      { type: "rect", role: "accent", left: 0, top: 0, width: 640, height: 400, fill: "#f8fafc", selectable: false },
      { type: "rect", role: "accent", left: 0, top: 0, width: 640, height: 110, fill: accent, selectable: false },
      { type: "rect", role: "accent", left: 0, top: 364, width: 640, height: 36, fill: accent, selectable: false },
      { type: "text", text: "STUDENT ID CARD", left: 34, top: 70, width: 260, fontSize: 16, fontWeight: "bold", fill: "#dbeafe" }
    ];

    return [
      ...fallbackBase,
      { type: "text", field: "school_name", text: fieldText("school_name"), left: 32, top: 26, width: 430, fontSize: 28, fontWeight: "bold", fill: "#ffffff" },
      { type: "rect", field: "photo", role: "placeholder", left: 438, top: 132, width: 142, height: 156, fill: "rgba(229,231,235,0.78)" },
      { type: "text", text: "PHOTO", left: 485, top: 198, width: 80, fontSize: 14, fontWeight: "bold", fill: "#64748b" },
      { type: "text", field: "student_name", text: fieldText("student_name"), left: 34, top: 140, width: 360, fontSize: 34, fontWeight: "bold", fill: "#111827" },
      { type: "text", field: "class_department", text: fieldText("class_department"), left: 36, top: 194, width: 340, fontSize: 19, fill: "#334155" },
      { type: "text", field: "roll_number", text: `Roll: ${fieldText("roll_number")}`, left: 36, top: 236, width: 280, fontSize: 18, fill: "#475569" },
      { type: "text", field: "phone", text: `Phone: ${fieldText("phone")}`, left: 36, top: 266, width: 280, fontSize: 18, fill: "#475569" },
      { type: "text", field: "blood_group", text: `Blood: ${fieldText("blood_group")}`, left: 336, top: 318, width: 160, fontSize: 18, fontWeight: "bold", fill: "#991b1b" },
      { type: "text", field: "expiry_date", text: `Valid till: ${fieldText("expiry_date")}`, left: 36, top: 318, width: 260, fontSize: 16, fill: "#475569" },
      { type: "text", field: "address", text: fieldText("address"), left: 34, top: 370, width: 540, fontSize: 14, fill: useRealBase ? "#111827" : "#ffffff" }
    ];
  }

  function canvasObjects() {
    if (isStudentIdTemplate() && !(template.objects?.length)) {
      return studentIdObjects();
    }

    const objects = [...(template.objects ?? [])];
    const existingFields = new Set(objects.map((object) => object.field).filter(Boolean));
    const textFields = fields.filter((field) => !isImageField(field) && field !== "color" && !existingFields.has(field));
    const imageFields = fields.filter((field) => isImageField(field) && !existingFields.has(field));

    textFields.forEach((field, index) => {
      objects.push({
        type: "text",
        field,
        text: fieldLabel(field),
        left: 32,
        top: 132 + index * 34,
        width: 340,
        fontSize: index === 0 ? 28 : 18,
        fontWeight: index === 0 ? "bold" : "normal",
        fill: "#111111"
      });
    });

    imageFields.forEach((field, index) => {
      objects.push({
        type: "image",
        field,
        left: 430,
        top: 126 + index * 172,
        width: 150,
        height: 150,
        fill: "#e5e7eb"
      });
    });

    return objects;
  }

  useEffect(() => {
    let disposed = false;

    async function setupCanvas() {
      setIsCanvasLoading(true);
      setCanvasError("");

      let fabric: typeof import("fabric");

      try {
        fabric = await import("fabric");
      } catch {
        setCanvasError("Could not load the design editor.");
        setIsCanvasLoading(false);
        return;
      }

      if (disposed || !canvasElementRef.current) return;

      fabricRef.current = fabric;
      Object.assign(fabric.Object.prototype, {
        borderColor: "#7c3aed",
        cornerColor: "#7c3aed",
        cornerStrokeColor: "#ffffff",
        cornerStyle: "circle",
        cornerSize: 10,
        transparentCorners: false,
        padding: 6,
        borderScaleFactor: 1
      });
      const width = template.width ?? 640;
      const height = template.height ?? 400;
      setCanvasSize({ width, height });
      const canvas = new fabric.Canvas(canvasElementRef.current, {
        width,
        height,
        backgroundColor: template.background ?? "#ffffff"
      });
      const styledCanvas = canvas as any;
      styledCanvas.selectionColor = "rgba(124, 58, 237, 0.10)";
      styledCanvas.selectionBorderColor = "#7c3aed";
      styledCanvas.selectionLineWidth = 2;
      styledCanvas.cornerColor = "#7c3aed";
      styledCanvas.cornerStrokeColor = "#ffffff";
      styledCanvas.cornerStyle = "circle";
      styledCanvas.cornerSize = 10;
      styledCanvas.transparentCorners = false;
      styledCanvas.padding = 6;
      fabricCanvasRef.current = canvas;
      fitCanvasToViewport(canvas, width, height);

      function syncSelection() {
        const active = canvas.getActiveObject() as any;
        if (!active) {
          setActiveLayer(null);
          return;
        }
        setSelectedFill(typeof active.fill === "string" ? active.fill : "#111111");
        setSelectedStroke(typeof active.stroke === "string" ? active.stroke : "#111111");
        setSelectedFontSize(active.fontSize || 24);
        setSelectedFontFamily(active.fontFamily || "Inter");
        setSelectedText(typeof active.text === "string" ? active.text : "");
        setSelectedRadius(active.rx || 0);
        const bounds = active.getBoundingRect(true, true);
        setActiveLayer({
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
          locked: isLockedObject(active),
          isText: active.type === "textbox" || active.type === "i-text"
        });
      }

      canvas.on("selection:created", syncSelection);
      canvas.on("selection:updated", syncSelection);
      canvas.on("selection:cleared", () => setActiveLayer(null));
      canvas.on("object:modified", syncSelection);
      canvas.on("object:moving", syncSelection);
      canvas.on("object:scaling", syncSelection);
      canvas.on("object:rotating", syncSelection);

      canvas.on("mouse:dblclick", (event: any) => {
        const target = event?.target as any;
        if (target?.type === "textbox" || target?.type === "i-text") {
          canvas.setActiveObject(target);
          target.enterEditing();
          target.selectAll();
          canvas.requestRenderAll();
        }
      });

      async function addBaseImage() {
        if (!baseImageUrl) return;

        try {
          const image = await fabric.Image.fromURL(baseImageUrl, { crossOrigin: "anonymous" });
          if (disposed) return;

          const maxCanvasWidth = 640;
          const canvasWidth = maxCanvasWidth;
          const canvasHeight = Math.round(maxCanvasWidth * (image.height / image.width));
          canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
          setCanvasSize({ width: canvasWidth, height: canvasHeight });
          const scale = Math.min(canvasWidth / image.width, canvasHeight / image.height);
          image.set({
            role: "base",
            left: (canvasWidth - image.width * scale) / 2,
            top: (canvasHeight - image.height * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false
          });
          canvas.add(image);
        } catch {
          // The generated editable layers still render if a remote thumbnail fails.
        }
      }

      function addObject(item: TemplateObject) {
        try {
          if (item.type === "rect") {
            const rect = new fabric.Rect({
              left: item.left,
              top: item.top,
              width: item.width ?? 0,
              height: item.height ?? 0,
              fill: item.fill ?? "transparent",
              stroke: item.stroke,
              strokeWidth: item.strokeWidth,
              rx: item.rx,
              ry: item.ry,
              selectable: item.selectable,
              evented: item.selectable !== false,
              lockMovementX: item.locked,
              lockMovementY: item.locked,
              lockScalingX: item.locked,
              lockScalingY: item.locked,
              lockRotation: item.locked,
              angle: item.angle,
              hasControls: true,
              hasBorders: true
            });
            rect.set("field", item.field);
            rect.set("role", item.role);
            canvas.add(rect);
            return;
          }

          if (item.type === "line") {
            const line = new fabric.Line([item.left, item.top, item.left + (item.width ?? 160), item.top + (item.height ?? 0)], {
              stroke: item.stroke ?? item.fill ?? "#111111",
              strokeWidth: item.strokeWidth ?? 2,
              selectable: item.selectable,
              evented: item.selectable !== false,
              lockMovementX: item.locked,
              lockMovementY: item.locked,
              lockScalingX: item.locked,
              lockScalingY: item.locked,
              lockRotation: item.locked,
              angle: item.angle,
              hasControls: true,
              hasBorders: true
            });
            line.set("field", item.field);
            line.set("role", item.role);
            canvas.add(line);
            return;
          }

          if (item.type === "circle") {
            const circle = new fabric.Circle({
              left: item.left,
              top: item.top,
              radius: item.radius ?? 20,
              fill: item.fill ?? "transparent",
              stroke: item.stroke,
              strokeWidth: item.strokeWidth,
              selectable: item.selectable,
              evented: item.selectable !== false,
              lockMovementX: item.locked,
              lockMovementY: item.locked,
              lockScalingX: item.locked,
              lockScalingY: item.locked,
              lockRotation: item.locked,
              angle: item.angle,
              hasControls: true,
              hasBorders: true
            });
            circle.set("field", item.field);
            circle.set("role", item.role);
            canvas.add(circle);
            return;
          }

          if (item.type === "text") {
            const text = values[item.field ?? ""] ?? item.text ?? "";
            const object = new fabric.Textbox(text, {
              left: item.left,
              top: item.top,
              width: item.width ?? 360,
              height: item.height,
              fill: item.fill ?? "#111111",
              stroke: item.stroke,
              strokeWidth: item.strokeWidth,
              fontSize: item.fontSize ?? 18,
              fontWeight: item.fontWeight,
              fontFamily: item.fontFamily ?? "Inter, Arial, sans-serif",
              textAlign: item.textAlign,
              angle: item.angle,
              selectable: item.selectable,
              evented: item.selectable !== false,
              lockMovementX: item.locked,
              lockMovementY: item.locked,
              lockScalingX: item.locked,
              lockScalingY: item.locked,
              lockRotation: item.locked,
              splitByGrapheme: true
            });
            object.set("field", item.field);
            object.set("role", item.role);
            canvas.add(object);
            return;
          }

          if (item.type === "image") {
            const placeholder = new fabric.Rect({
              left: item.left,
              top: item.top,
              width: item.width ?? 150,
              height: item.height ?? 150,
              fill: item.src ? "#e5e7eb" : "rgba(255,255,255,0.35)",
              stroke: item.src ? undefined : "#94a3b8",
              strokeWidth: item.src ? 0 : 1,
              strokeDashArray: item.src ? undefined : [6, 6],
              angle: item.angle,
              selectable: item.selectable,
              evented: item.selectable !== false,
              lockMovementX: item.locked,
              lockMovementY: item.locked,
              lockScalingX: item.locked,
              lockScalingY: item.locked,
              lockRotation: item.locked,
              hasControls: true,
              hasBorders: true
            });
            placeholder.set("field", item.field);
            placeholder.set("role", "placeholder");
            canvas.add(placeholder);

            if (item.src && (item.src.startsWith("data:") || item.src.startsWith("blob:"))) {
              fabric.Image.fromURL(item.src).then((image: any) => {
                if (disposed) return;
                image.set({
                  field: item.field,
                  role: "placeholder",
                  left: item.left,
                  top: item.top,
                  angle: item.angle,
                  selectable: item.selectable,
                  scaleX: ((item.width ?? 150) / image.width) || 1,
                  scaleY: ((item.height ?? 150) / image.height) || 1
                });
                canvas.remove(placeholder);
                canvas.add(image);
                canvas.requestRenderAll();
              }).catch(() => undefined);
            }
            return;
          }

          throw new Error(`Unsupported template layer type: ${String((item as any).type)}`);
        } catch (error) {
          console.warn("Template layer fallback", item, error);

          if (item.type === "text") {
            const fallbackText = new fabric.Textbox(values[item.field ?? ""] ?? item.text ?? "", {
              left: item.left,
              top: item.top,
              width: item.width ?? 260,
              fill: item.fill ?? "#111111",
              fontSize: item.fontSize ?? 18,
              fontFamily: item.fontFamily ?? "Inter, Arial, sans-serif",
              fontWeight: item.fontWeight
            });
            fallbackText.set("field", item.field);
            fallbackText.set("role", item.role);
            canvas.add(fallbackText);
            return;
          }

          if (item.type === "rect" || item.type === "circle" || item.type === "line" || item.type === "image") {
            const fallbackRect = new fabric.Rect({
              left: item.left,
              top: item.top,
              width: item.width ?? (item.type === "circle" ? (item.radius ?? 20) * 2 : 120),
              height: item.height ?? (item.type === "circle" ? (item.radius ?? 20) * 2 : 60),
              fill: item.fill ?? "rgba(255,255,255,0.18)",
              stroke: item.stroke,
              strokeWidth: item.strokeWidth ?? 1,
              selectable: true
            });
            fallbackRect.set("field", item.field);
            fallbackRect.set("role", item.role);
            canvas.add(fallbackRect);
            return;
          }
        }
      }

      let skippedLayers = 0;
      const skippedLayerDetails: string[] = [];

      try {
        await addBaseImage();
      } catch {
        skippedLayers += 1;
      }

      for (const item of canvasObjects()) {
        try {
          addObject(item);
        } catch (error) {
          skippedLayers += 1;
          skippedLayerDetails.push(`${item.type}${item.field ? `:${item.field}` : ""}`);
          console.warn("Template layer failed to load", item, error);
        }
      }

      for (const item of canvasObjects()) {
        if (item.type === "image" && item.src && !item.src.startsWith("data:") && !item.src.startsWith("blob:")) {
          fabric.Image.fromURL(item.src, { crossOrigin: "anonymous" }).then((image: any) => {
            if (disposed) return;
            const target = canvas.getObjects().find((object: any) => object.field === item.field && object.role === "placeholder");
            image.set({
              field: item.field,
              role: "placeholder",
              left: item.left,
              top: item.top,
              angle: item.angle,
              selectable: item.selectable,
              scaleX: ((item.width ?? 150) / image.width) || 1,
              scaleY: ((item.height ?? 150) / image.height) || 1
            });
            if (target) canvas.remove(target);
            canvas.add(image);
            canvas.requestRenderAll();
          }).catch(() => undefined);
        }
      }

      canvas.requestRenderAll();
      if (skippedLayers > 0) {
        setCanvasError(
          `${skippedLayers} template layer${skippedLayers === 1 ? "" : "s"} could not be loaded: ${skippedLayerDetails.join(", ")}`
        );
      }
      setIsCanvasLoading(false);
    }

    setupCanvas();

    return () => {
      disposed = true;
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
      setIsCanvasLoading(false);
    };
    // template is intentionally the reset boundary for the Fabric canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, fields.join("|"), category, baseImageUrl]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    for (const [field, value] of Object.entries(values)) {
      canvas.getObjects().forEach((object: any) => {
        if (object.field === field) {
          if (field === "color") {
            if (object.role === "accent") object.set("fill", value);
          } else if (typeof object.text === "string") {
            object.set("text", ["roll_number", "phone", "blood_group", "expiry_date"].includes(field) ? object.text.split(":")[0] + ": " + value : value);
          }
        }
      });
    }

    canvas.requestRenderAll();
  }, [values]);

  useEffect(() => {
    const viewport = canvasViewportRef.current;
    if (!viewport) return;

    const resize = () => {
      fitCanvasToViewport(
        fabricCanvasRef.current,
        template.width ?? 640,
        template.height ?? 400
      );
    };

      resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    window.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [canvasSize.height, canvasSize.width]);

  function applyColor(color: string) {
    setSelectedFill(color);
    const activeObject = fabricCanvasRef.current?.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      fabricCanvasRef.current.requestRenderAll();
    }
  }

  function updateActive(properties: Record<string, unknown>) {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject) return;
    activeObject.set(properties);
    canvas.requestRenderAll();
  }

  function addTextLayer() {
    const fabric = fabricRef.current;
    const canvas = fabricCanvasRef.current;
    if (!fabric || !canvas) return;
    const object = new fabric.Textbox("New text", {
      left: 80,
      top: 80,
      width: 220,
      fontSize: 24,
      fontFamily: selectedFontFamily,
      fill: selectedFill
    });
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
  }

  function addRectangleLayer() {
    const fabric = fabricRef.current;
    const canvas = fabricCanvasRef.current;
    if (!fabric || !canvas) return;
    const object = new fabric.Rect({
      left: 90,
      top: 110,
      width: 180,
      height: 90,
      fill: "#ffffff",
      stroke: selectedStroke,
      strokeWidth: 2,
      rx: selectedRadius,
      ry: selectedRadius
    });
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
  }

  function addCircleLayer() {
    const fabric = fabricRef.current;
    const canvas = fabricCanvasRef.current;
    if (!fabric || !canvas) return;
    const object = new fabric.Circle({
      left: 120,
      top: 120,
      radius: 55,
      fill: "#ffffff",
      stroke: selectedStroke,
      strokeWidth: 2
    });
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
  }

  function addLineLayer() {
    const fabric = fabricRef.current;
    const canvas = fabricCanvasRef.current;
    if (!fabric || !canvas) return;
    const object = new fabric.Line([90, 140, 260, 140], {
      stroke: selectedStroke,
      strokeWidth: 3
    });
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
  }

  function duplicateLayer() {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject) return;
    activeObject.clone().then((clone: any) => {
      clone.set({ left: activeObject.left + 20, top: activeObject.top + 20 });
      canvas.add(clone);
      canvas.setActiveObject(clone);
      canvas.requestRenderAll();
    });
  }

  function deleteLayer() {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject || activeObject.role === "base") return;
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  function moveLayer(direction: "forward" | "backward") {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject || activeObject.role === "base") return;
    if (direction === "forward") {
      canvas.bringObjectForward(activeObject);
    } else {
      canvas.sendObjectBackwards(activeObject);
      const base = canvas.getObjects().find((object: any) => object.role === "base");
      if (base) canvas.sendObjectToBack(base);
    }
    canvas.requestRenderAll();
  }

  function toggleTextStyle(property: "fontWeight" | "fontStyle" | "underline") {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject() as any;
    if (!canvas || !activeObject) return;
    if (property === "fontWeight") {
      activeObject.set("fontWeight", activeObject.fontWeight === "bold" ? "normal" : "bold");
    }
    if (property === "fontStyle") {
      activeObject.set("fontStyle", activeObject.fontStyle === "italic" ? "normal" : "italic");
    }
    if (property === "underline") {
      activeObject.set("underline", !activeObject.underline);
    }
    canvas.requestRenderAll();
  }

  function alignText(textAlign: "left" | "center" | "right") {
    updateActive({ textAlign });
  }

  function toggleLockLayer() {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject() as any;
    if (!canvas || !activeObject || activeObject.role === "base") return;
    const locked = !isLockedObject(activeObject);
    activeObject.set({
      locked,
      selectable: true,
      evented: true,
      lockMovementX: locked,
      lockMovementY: locked,
      lockScalingX: locked,
      lockScalingY: locked,
      lockRotation: locked
    });
    fitCanvasToViewport(canvas);
    canvas.requestRenderAll();
    const bounds = activeObject.getBoundingRect(true, true);
    setActiveLayer({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      locked,
      isText: activeObject.type === "textbox" || activeObject.type === "i-text"
    });
  }

  function openTextEditor() {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject() as any;
    if (!canvas || !activeObject) return;
    if (activeObject.type === "textbox" || activeObject.type === "i-text") {
      activeObject.enterEditing();
      activeObject.selectAll();
      canvas.requestRenderAll();
    }
  }

  const floatingToolbarStyle = activeLayer
    ? {
        left: Math.max(16, activeLayer.left),
        top: Math.max(16, activeLayer.top - 52)
      }
    : null;

  function uploadImageLayer(file: File) {
    const fabric = fabricRef.current;
    const canvas = fabricCanvasRef.current;
    if (!fabric || !canvas) return;
    const objectUrl = URL.createObjectURL(file);
    fabric.Image.fromURL(objectUrl).then((image: any) => {
      image.set({
        left: 120,
        top: 120,
        scaleX: 160 / image.width,
        scaleY: 120 / image.height
      });
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.requestRenderAll();
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
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
            <input className="min-h-9 rounded-md border border-black/10 px-2 text-sm text-ink" onChange={(event) => {
              setSelectedText(event.target.value);
              updateActive({ text: event.target.value });
            }} value={selectedText} />
          </label>
          <label className="grid gap-1 text-xs font-medium text-graphite">
            Font
            <select className="min-h-9 rounded-md border border-black/10 px-2 text-sm text-ink" onChange={(event) => {
              setSelectedFontFamily(event.target.value);
              updateActive({ fontFamily: event.target.value });
            }} value={selectedFontFamily}>
              <option value="Inter">Inter</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Serif</option>
              <option value="Brush Script MT">Handwriting</option>
              <option value="Courier New">Mono</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs font-medium text-graphite">
            Font size
            <input className="min-h-9 rounded-md border border-black/10 px-2 text-sm text-ink" min="8" max="96" onChange={(event) => {
              const value = Number(event.target.value);
              setSelectedFontSize(value);
              updateActive({ fontSize: value });
            }} type="number" value={selectedFontSize} />
          </label>
          <label className="grid gap-1 text-xs font-medium text-graphite">
            Border radius
            <input className="min-h-9 rounded-md border border-black/10 px-2 text-sm text-ink" min="0" max="80" onChange={(event) => {
              const value = Number(event.target.value);
              setSelectedRadius(value);
              updateActive({ rx: value, ry: value });
            }} type="number" value={selectedRadius} />
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="grid gap-1 text-xs font-medium text-graphite">
              Text
              <input className="h-9 w-full rounded-md border border-black/10" onChange={(event) => applyColor(event.target.value)} type="color" value={selectedFill} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-graphite">
              Fill
              <input className="h-9 w-full rounded-md border border-black/10" onChange={(event) => {
                setSelectedFill(event.target.value);
                updateActive({ fill: event.target.value });
              }} type="color" value={selectedFill} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-graphite">
              Border
              <input className="h-9 w-full rounded-md border border-black/10" onChange={(event) => {
                setSelectedStroke(event.target.value);
                updateActive({ stroke: event.target.value, strokeWidth: 2 });
              }} type="color" value={selectedStroke} />
            </label>
          </div>
        </div>
      </aside>

      <div ref={canvasViewportRef} className="relative z-0 flex min-h-[42rem] justify-center overflow-auto rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm">
        {isCanvasLoading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-sm text-graphite">
            Loading template...
          </div>
        ) : null}
        {canvasError ? (
          <div className="absolute left-4 top-4 z-10 max-w-sm rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            {canvasError}
          </div>
        ) : null}
        {activeLayer && floatingToolbarStyle ? (
          <div className="pointer-events-auto absolute z-20 flex items-center gap-1 rounded-xl border border-violet-200 bg-white p-1 shadow-lg" style={floatingToolbarStyle}>
            <MiniActionButton label="Duplicate" onClick={duplicateLayer}>⧉</MiniActionButton>
            <MiniActionButton label={activeLayer.locked ? "Unlock" : "Lock"} onClick={toggleLockLayer}>{activeLayer.locked ? "U" : "L"}</MiniActionButton>
            <MiniActionButton label="Bring forward" onClick={() => moveLayer("forward")}>⇧</MiniActionButton>
            <MiniActionButton label="Send backward" onClick={() => moveLayer("backward")}>⇩</MiniActionButton>
            {activeLayer.isText ? <MiniActionButton label="Edit text" onClick={openTextEditor}>T</MiniActionButton> : null}
            <MiniActionButton label="Delete" onClick={deleteLayer}>×</MiniActionButton>
          </div>
        ) : null}
        <div className="flex w-full justify-center">
          <canvas ref={canvasElementRef} />
        </div>
      </div>
    </div>
  );
});

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
