import type { TemplateEditorValue } from "./TemplateEditor";
import { resolveTemplateLayout } from "@/lib/templates/layout";

type PreviewObject = {
  type?: string;
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
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  radius?: number;
  rx?: number;
  ry?: number;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: string;
  textAlign?: "left" | "center" | "right";
  letterSpacing?: number;
  angle?: number;
  rotation?: number;
  visible?: boolean;
  clipShape?: "ellipse" | "rect";
  placeholder?: boolean;
};

function estimateTextHeight(object: PreviewObject) {
  const fontSize = object.fontSize ?? 18;
  const lines = String(object.text ?? "").split("\n").length || 1;
  return Math.ceil(lines * fontSize * 1.45 + 8);
}

export function TemplateLayerPreview({ template, isPreviewMode = true }: { template: TemplateEditorValue; isPreviewMode?: boolean }) {
  const layout = resolveTemplateLayout(template);
  const width = layout.width;
  const height = layout.height;
  const objects = layout.objects as PreviewObject[];

  const clipPaths = objects
    .filter((object) => object.visible !== false && object.type === "image" && object.clipShape === "ellipse" && object.src)
    .map((object, index) => {
      const x = object.left ?? object.x ?? 0;
      const y = object.top ?? object.y ?? 0;
      const objectWidth = object.width ?? object.w ?? 0;
      const objectHeight = object.height ?? object.h ?? 0;
      const cx = x + objectWidth / 2;
      const cy = y + objectHeight / 2;
      const rx = objectWidth / 2;
      const ry = objectHeight / 2;
      return {
        id: object.id ?? `layer-${index}`,
        cx,
        cy,
        rx,
        ry
      };
    });

  function textAnchor(align?: string) {
    if (align === "center") return "middle";
    if (align === "right") return "end";
    return "start";
  }

  function textX(object: PreviewObject) {
    const left = object.left ?? 0;
    if (object.textAlign === "center") return left + (object.width ?? 0) / 2;
    if (object.textAlign === "right") return left + (object.width ?? 0);
    return left;
  }

  function transformFor(object: PreviewObject) {
    const angle = object.angle ?? object.rotation ?? 0;
    if (!angle) return undefined;
    return `rotate(${angle} ${object.left ?? object.x ?? 0} ${object.top ?? object.y ?? 0})`;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-mist p-3">
      <svg
        aria-label="Template preview"
        className="h-full max-h-full w-full max-w-full overflow-visible drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={`${layout.minX} ${layout.minY} ${width} ${height}`}
      >
        <defs>
          {clipPaths.map((clipPath) => (
            <clipPath id={`clip-${clipPath.id}`} key={clipPath.id}>
              <ellipse cx={clipPath.cx} cy={clipPath.cy} rx={clipPath.rx} ry={clipPath.ry} />
            </clipPath>
          ))}
        </defs>
        <rect fill={layout.background} height={height} rx="0" width={width} x={layout.minX} y={layout.minY} />
        {objects.filter((object) => object.visible !== false).map((object, index) => {
            if (object.type === "rect") {
              return (
                <rect
                  key={index}
                  fill={object.fill ?? "transparent"}
                  height={object.height ?? object.h ?? 0}
                  rx={object.rx ?? 0}
                  ry={object.ry ?? object.rx ?? 0}
                  stroke={object.stroke}
                  strokeWidth={object.strokeWidth ?? 0}
                  opacity={object.opacity ?? 1}
                  transform={transformFor(object)}
                  width={object.width ?? object.w ?? 0}
                  x={object.left ?? object.x ?? 0}
                  y={object.top ?? object.y ?? 0}
                />
              );
            }

            if (object.type === "circle" || object.type === "ellipse") {
              const x = object.left ?? object.x ?? 0;
              const y = object.top ?? object.y ?? 0;
              const width = object.width ?? object.w ?? ((object.radius ?? 40) * 2);
              const height = object.height ?? object.h ?? ((object.radius ?? 40) * 2);
              return (
                <ellipse
                  key={index}
                  cx={x + width / 2}
                  cy={y + height / 2}
                  fill={object.fill ?? "transparent"}
                  opacity={object.opacity ?? 1}
                  stroke={object.stroke}
                  strokeWidth={object.strokeWidth ?? 0}
                  rx={width / 2}
                  ry={height / 2}
                  transform={transformFor(object)}
                />
              );
            }

            if (object.type === "line") {
              return (
                <line
                  key={index}
                  stroke={object.stroke ?? object.fill ?? "#111111"}
                  strokeLinecap="round"
                  strokeWidth={object.strokeWidth ?? 2}
                  opacity={object.opacity ?? 1}
                  transform={transformFor(object)}
                  x1={object.left ?? object.x ?? 0}
                  x2={(object.left ?? object.x ?? 0) + (object.width ?? object.w ?? 120)}
                  y1={object.top ?? object.y ?? 0}
                  y2={(object.top ?? object.y ?? 0) + (object.height ?? object.h ?? 0)}
                />
              );
            }

            if (object.type === "image" && object.src) {
              const clipId = object.clipShape === "ellipse" ? `clip-${object.id ?? `layer-${index}`}` : undefined;
              return (
                <image
                  key={index}
                  height={object.height ?? object.h ?? 120}
                  href={object.src}
                  preserveAspectRatio={object.clipShape === "rect" ? "xMidYMid meet" : "xMidYMid slice"}
                  opacity={object.opacity ?? 1}
                  clipPath={clipId ? `url(#${clipId})` : undefined}
                  transform={transformFor(object)}
                  width={object.width ?? object.w ?? 120}
                  x={object.left ?? object.x ?? 0}
                  y={object.top ?? object.y ?? 0}
                />
              );
            }

            if (object.type === "image") {
              return (
                <rect
                  key={index}
                  fill="rgba(255,255,255,0.35)"
                  height={object.height ?? object.h ?? 120}
                  stroke="#94a3b8"
                  strokeDasharray="8 8"
                  strokeWidth="2"
                  width={object.width ?? object.w ?? 120}
                  x={object.left ?? object.x ?? 0}
                  y={object.top ?? object.y ?? 0}
                />
              );
            }

            const lines = String(object.text ?? "").split("\n");
            const textHeight = object.height ?? estimateTextHeight(object);
            return (
              <g key={index} transform={transformFor(object)}>
                {!isPreviewMode ? (
                  <rect
                    fill="transparent"
                    height={textHeight}
                    stroke="rgba(124,58,237,0.18)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    width={object.width ?? object.w ?? 0}
                    x={object.left ?? object.x ?? 0}
                    y={object.top ?? object.y ?? 0}
                  />
                ) : null}
                <text
                  fill={object.fill ?? "#111111"}
                  fontFamily={object.fontFamily ?? "Inter, Arial, sans-serif"}
                  fontSize={object.fontSize ?? 18}
                  fontWeight={object.fontWeight}
                  fontStyle={object.fontStyle}
                  letterSpacing={object.letterSpacing}
                  opacity={object.opacity ?? 1}
                  textAnchor={textAnchor(object.textAlign)}
                  x={textX(object)}
                  y={(object.top ?? object.y ?? 0) + (object.fontSize ?? 18)}
                >
                  {lines.map((line, lineIndex) => (
                    <tspan
                      key={lineIndex}
                      dy={lineIndex === 0 ? 0 : (object.fontSize ?? 18) * 1.2}
                      x={textX(object)}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
}
