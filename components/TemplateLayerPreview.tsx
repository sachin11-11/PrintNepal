import type { TemplateEditorValue } from "./TemplateEditor";

type PreviewObject = {
  type?: string;
  text?: string;
  src?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  rx?: number;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  angle?: number;
};

export function TemplateLayerPreview({ template }: { template: TemplateEditorValue }) {
  const width = template.width ?? 640;
  const height = template.height ?? 400;
  const objects = (template.objects ?? []) as PreviewObject[];

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
    if (!object.angle) return undefined;
    return `rotate(${object.angle} ${object.left ?? 0} ${object.top ?? 0})`;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-mist p-3">
      <svg
        aria-label="Template preview"
        className="h-full max-h-full w-full max-w-full overflow-visible drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <rect fill={template.background ?? "#ffffff"} height={height} rx="0" width={width} x="0" y="0" />
          {objects.map((object, index) => {
            if (object.type === "rect") {
              return (
                <rect
                  key={index}
                  fill={object.fill ?? "transparent"}
                  height={object.height ?? 0}
                  rx={object.rx ?? 0}
                  stroke={object.stroke}
                  strokeWidth={object.strokeWidth ?? 0}
                  transform={transformFor(object)}
                  width={object.width ?? 0}
                  x={object.left ?? 0}
                  y={object.top ?? 0}
                />
              );
            }

            if (object.type === "circle") {
              return (
                <circle
                  key={index}
                  cx={(object.left ?? 0) + (object.radius ?? 40)}
                  cy={(object.top ?? 0) + (object.radius ?? 40)}
                  fill={object.fill ?? "transparent"}
                  r={object.radius ?? 40}
                  stroke={object.stroke}
                  strokeWidth={object.strokeWidth ?? 0}
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
                  transform={transformFor(object)}
                  x1={object.left ?? 0}
                  x2={(object.left ?? 0) + (object.width ?? 120)}
                  y1={object.top ?? 0}
                  y2={(object.top ?? 0) + (object.height ?? 0)}
                />
              );
            }

            if (object.type === "image" && object.src) {
              return (
                <image
                  key={index}
                  height={object.height ?? 120}
                  href={object.src}
                  preserveAspectRatio="xMidYMid slice"
                  transform={transformFor(object)}
                  width={object.width ?? 120}
                  x={object.left ?? 0}
                  y={object.top ?? 0}
                />
              );
            }

            if (object.type === "image") {
              return (
                <rect
                  key={index}
                  fill="rgba(255,255,255,0.35)"
                  height={object.height ?? 120}
                  stroke="#94a3b8"
                  strokeDasharray="8 8"
                  strokeWidth="2"
                  width={object.width ?? 120}
                  x={object.left ?? 0}
                  y={object.top ?? 0}
                />
              );
            }

            const lines = String(object.text ?? "").split("\n");
            return (
              <text
                key={index}
                fill={object.fill ?? "#111111"}
                fontFamily={object.fontFamily ?? "Inter, Arial, sans-serif"}
                fontSize={object.fontSize ?? 18}
                fontWeight={object.fontWeight}
                textAnchor={textAnchor(object.textAlign)}
                transform={transformFor(object)}
                x={textX(object)}
                y={(object.top ?? 0) + (object.fontSize ?? 18)}
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
            );
          })}
      </svg>
    </div>
  );
}
