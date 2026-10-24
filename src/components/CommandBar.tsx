"use client";

import { motion } from "framer-motion";
import { useGame, ATTACK_SLOTS } from "@/game/store";

/** Noise meter and the manual early-launch trigger (Spec §4). */
export function CommandBar() {
  const noise = useGame((s) => s.noise);
  const phase = useGame((s) => s.phase);
  const queue = useGame((s) => s.queue);
  const launching = useGame((s) => s.launching);
  const run = useGame((s) => s.runMeasurement);

  // The attack auto-launches when the 3 slots fill; this button lets the
  // player launch early with fewer than 3 cards staged.
  const canMeasure = phase === "orders" && queue.length > 0 && !launching;
  const busy =
    launching || phase === "measurement" || phase === "enemy" || phase === "end";

  return (
    <div className="flex items-center gap-4">
      {/* Noise meter */}
      <div className="panel-glass rounded-md px-3 py-2">
        <div className="text-[9px] uppercase tracking-widest text-white/40">
          Ruido (Noise)
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="relative h-2 w-24 overflow-hidden rounded-full bg-black/60">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-fuchsia-400"
              style={{ width: `${Math.min(100, noise * 8)}%` }}
            />
          </div>
          <span className="font-display text-sm text-fuchsia-300">{noise}</span>
        </div>
      </div>

      {/* Measure / End turn */}
      <motion.button
        whileHover={canMeasure ? { scale: 1.05 } : {}}
        whileTap={canMeasure ? { scale: 0.96 } : {}}
        disabled={!canMeasure}
        onClick={() => run()}
        className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 font-display text-xs ${
          canMeasure
            ? "border-quantum-gold text-quantum-gold"
            : "border-white/15 text-white/25"
        }`}
        style={{
          boxShadow: canMeasure ? "0 0 22px rgba(232,176,106,0.6)" : "none",
        }}
      >
        {busy ? (
          <span className="animate-pulse">···</span>
        ) : (
          <div className="text-center leading-tight">
            <div className="text-lg">✓</div>
            <div className="text-[8px] uppercase">Lanzar</div>
          </div>
        )}
        {canMeasure && (
          <span className="absolute -right-2 -top-1 flex h-5 min-w-[28px] items-center justify-center rounded-full bg-quantum-gold px-1 text-[10px] font-bold text-black">
            {queue.length}/{ATTACK_SLOTS}
          </span>
        )}
      </motion.button>
    </div>
  );
}
