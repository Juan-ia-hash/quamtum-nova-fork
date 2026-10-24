"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/game/store";

/**
 * Cumulative "TOTAL" damage tally shown during the measurement phase, echoing
 * the big running counter in the reference battle screenshot.
 */
export function TotalDamage() {
  const total = useGame((s) => s.totalDamage);
  const phase = useGame((s) => s.phase);
  const show = total > 0 && (phase === "measurement" || phase === "enemy");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="total"
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          className="pointer-events-none select-none text-center"
        >
          <div className="text-[10px] font-display uppercase tracking-[0.35em] text-quantum-gold/80">
            Total
          </div>
          <motion.div
            key={total}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="font-display text-4xl font-bold text-white"
            style={{ textShadow: "0 0 14px rgba(255,180,80,0.8), 0 2px 3px rgba(0,0,0,0.9)" }}
          >
            {total.toLocaleString()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
