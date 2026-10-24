"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/game/store";

const KIND_STYLE: Record<
  string,
  { color: string; shadow: string; prefix: string; scale: number }
> = {
  damage: { color: "#ffe9b0", shadow: "0 0 10px rgba(255,160,40,0.9)", prefix: "", scale: 1 },
  crit: { color: "#ff5a3c", shadow: "0 0 14px rgba(255,60,40,0.95)", prefix: "", scale: 1.35 },
  heal: { color: "#7cf29a", shadow: "0 0 10px rgba(80,240,120,0.9)", prefix: "+", scale: 1 },
  "enemy-damage": { color: "#ff8f9a", shadow: "0 0 10px rgba(255,60,80,0.9)", prefix: "", scale: 1 },
};

/**
 * Floating combat numbers (damage / crit / heal) that pop over a given unit
 * and drift upward before fading, mirroring the reference battle HUD.
 */
export function FloatingNumbers({ targetId }: { targetId: string }) {
  const floaters = useGame((s) => s.floaters.filter((f) => f.targetId === targetId));

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-start justify-center">
      <AnimatePresence>
        {floaters.map((f, idx) => {
          const st = KIND_STYLE[f.kind] ?? KIND_STYLE.damage;
          // slight horizontal scatter so stacked hits don't overlap exactly
          const dx = ((f.id % 5) - 2) * 16;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], y: -64, scale: st.scale }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut", times: [0, 0.15, 0.7, 1] }}
              className="absolute top-0 font-display font-bold"
              style={{
                left: `calc(50% + ${dx}px)`,
                transform: "translateX(-50%)",
                color: st.color,
                textShadow: `${st.shadow}, 0 2px 2px rgba(0,0,0,0.8)`,
                fontSize: f.kind === "crit" ? 34 : 24,
                marginTop: idx * 2,
              }}
            >
              {f.kind === "crit" && (
                <span className="mr-1 align-top text-[11px]">CRÍT</span>
              )}
              {st.prefix}
              {f.amount.toLocaleString()}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
