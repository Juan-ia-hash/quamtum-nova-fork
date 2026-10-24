"use client";

import { ARCHITECTURE_META } from "@/game/affinity";
import type { Character } from "@/game/types";

/**
 * Floating HP / Coherence-Shield / Moxie meters that hover above a sprite,
 * matching the reference battle HUD.
 */
export function FloatingBars({ character }: { character: Character }) {
  const meta = ARCHITECTURE_META[character.architecture];
  const hpPct = (character.hp / character.maxHp) * 100;
  const shieldPct = Math.min(100, (character.shield / character.maxHp) * 100);

  return (
    <div className="w-32 select-none">
      <div className="flex items-center gap-1 mb-0.5">
        <span
          className="text-[10px] font-display leading-none"
          style={{ color: meta.color }}
          title={meta.label}
        >
          {meta.glyph}
        </span>
        <span className="text-[9px] text-white/50 uppercase tracking-wider">
          {meta.short}
        </span>
      </div>

      {/* HP + shield track */}
      <div className="relative h-1.5 w-full rounded-full bg-black/60 overflow-hidden border border-white/10">
        <div
          className="absolute inset-y-0 left-0 bg-quantum-hp"
          style={{ width: `${hpPct}%`, boxShadow: "0 0 6px #7ee081" }}
        />
      </div>
      {character.shield > 0 && (
        <div className="relative mt-0.5 h-1 w-full rounded-full bg-black/60 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-quantum-shield"
            style={{ width: `${shieldPct}%`, boxShadow: "0 0 6px #8fcaff" }}
          />
        </div>
      )}

      {/* Quant spheres 0..5 — one fills per card the character uses.
          When all 5 are lit the Ultimate card becomes available. */}
      <div className="mt-1 flex items-center justify-center gap-1">
        {Array.from({ length: character.maxMoxie }).map((_, i) => {
          const filled = i < character.moxie;
          const full = character.moxie >= character.maxMoxie;
          const color = full ? "#ffd24a" : meta.color;
          return (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full border transition-all ${
                full ? "animate-pulse" : ""
              }`}
              style={{
                borderColor: filled ? color : "rgba(255,255,255,0.2)",
                background: filled
                  ? `radial-gradient(circle at 35% 30%, #ffffff, ${color} 70%)`
                  : "rgba(255,255,255,0.06)",
                boxShadow: filled ? `0 0 7px ${color}` : "none",
              }}
            />
          );
        })}
        {character.moxie >= character.maxMoxie && (
          <span className="ml-0.5 text-[8px] font-display uppercase tracking-wide text-quantum-moxie text-glow">
            ULT
          </span>
        )}
      </div>
    </div>
  );
}
