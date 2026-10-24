"use client";

import { motion } from "framer-motion";
import { ARCHITECTURE_META } from "@/game/affinity";
import type { Enemy } from "@/game/types";
import { PixelSprite } from "./pixel/PixelSprite";
import { SPRITE_ENEMY } from "./pixel/spriteData";

export function EnemyUnit({ enemy }: { enemy: Enemy }) {
  const meta = ARCHITECTURE_META[enemy.architecture];
  const hpPct = (enemy.hp / enemy.maxHp) * 100;
  const shieldPct = Math.min(100, (enemy.shield / enemy.maxHp) * 100);
  const state = enemy.spriteState;

  const anim = (() => {
    switch (state) {
      case "attack-physical":
        return { x: [0, -70, -10], transition: { duration: 0.7 } };
      case "hit":
        return { x: [0, 16, 0], filter: ["none", "brightness(2)", "none"], transition: { duration: 0.3 } };
      case "dead":
        return { opacity: 0.15, scale: 0.9, filter: "grayscale(1)" };
      default:
        return {};
    }
  })();

  return (
    <div className="relative flex flex-col items-center">
      {/* Enemy HP header */}
      <div className="mb-2 w-72">
        <div className="flex items-end justify-between">
          <span className="font-display text-xs uppercase tracking-wider text-red-300/90">
            {enemy.name}
          </span>
          <span className="text-[10px] text-white/50">
            {enemy.hp.toLocaleString()} / {enemy.maxHp.toLocaleString()}
          </span>
        </div>
        <div className="relative mt-1 h-2 w-full overflow-hidden rounded-sm border border-red-500/30 bg-black/60">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-400"
            style={{ width: `${hpPct}%`, boxShadow: "0 0 8px #ef4444" }}
          />
        </div>
        {enemy.shield > 0 && (
          <div className="relative mt-0.5 h-1 w-full overflow-hidden rounded-sm bg-black/60">
            <div
              className="absolute inset-y-0 left-0 bg-quantum-shield"
              style={{ width: `${shieldPct}%` }}
            />
          </div>
        )}
      </div>

      <motion.div
        className={`relative ${state === "idle" ? "animate-float" : ""}`}
        animate={anim}
      >
        {/* ominous backlight halo */}
        <div
          className="absolute left-1/2 top-1/2 -z-10 h-44 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(180,20,40,0.35), transparent 70%)" }}
        />
        <PixelSprite
          rows={SPRITE_ENEMY.rows}
          palette={SPRITE_ENEMY.palette}
          scale={6}
          className="pixelated drop-shadow-[0_8px_10px_rgba(0,0,0,0.7)]"
        />
        {/* glitch flicker over the core while idle */}
        {state === "idle" && (
          <div
            className="animate-glitch pointer-events-none absolute left-1/2 top-[42%] h-6 w-6 -translate-x-1/2 rounded-full opacity-60 blur-[1px]"
            style={{ background: meta.color }}
          />
        )}
      </motion.div>

      {/* Architecture tag */}
      <div
        className="mt-2 rounded px-2 py-0.5 text-[10px] font-display"
        style={{ color: meta.color, border: `1px solid ${meta.color}55` }}
      >
        {meta.glyph} {meta.label}
      </div>
    </div>
  );
}
