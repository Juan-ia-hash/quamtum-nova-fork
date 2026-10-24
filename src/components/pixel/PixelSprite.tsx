"use client";

import { useMemo } from "react";

/**
 * Renders pixel-art from a string matrix using a single element and a long
 * `box-shadow` list — the classic one-node pixel-art technique. Each character
 * in a row maps to a colour via `palette`; space (" ") or "." means
 * transparent. The sprite scales crisply (no blur) with `scale`.
 */
export function PixelSprite({
  rows,
  palette,
  scale = 4,
  className = "",
  style,
}: {
  rows: string[];
  palette: Record<string, string>;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { shadow, width, height } = useMemo(() => {
    const parts: string[] = [];
    const h = rows.length;
    const w = rows.reduce((m, r) => Math.max(m, r.length), 0);
    for (let y = 0; y < h; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === " " || ch === ".") continue;
        const color = palette[ch];
        if (!color) continue;
        parts.push(`${x * scale}px ${y * scale}px 0 0 ${color}`);
      }
    }
    return { shadow: parts.join(","), width: w * scale, height: h * scale };
  }, [rows, palette, scale]);

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height, ...style }}
      aria-hidden
    >
      {/* The single pixel element; box-shadow paints every lit cell. */}
      <div
        className="absolute left-0 top-0"
        style={{
          width: scale,
          height: scale,
          boxShadow: shadow,
          // keep the origin pixel itself transparent so (0,0) isn't doubled
          background: "transparent",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
