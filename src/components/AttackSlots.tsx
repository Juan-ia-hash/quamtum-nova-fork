"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame, ATTACK_SLOTS } from "@/game/store";
import { CARD_DEF_BY_ID } from "@/game/content";

const TYPE_ACCENT = {
  Physical: { accent: "#f4b740", from: "rgba(124,45,18,0.55)", to: "rgba(180,83,9,0.55)" },
  Logical: { accent: "#8fcaff", from: "rgba(30,58,95,0.55)", to: "rgba(76,29,149,0.55)" },
} as const;

/**
 * Three translucent attack slots shown during the Orders phase. Each selected
 * card fills the next free slot; when all three are filled the store launches
 * the attack automatically. Clicking a filled slot releases its card.
 */
export function AttackSlots() {
  const phase = useGame((s) => s.phase);
  const queue = useGame((s) => s.queue);
  const hand = useGame((s) => s.hand);
  const launching = useGame((s) => s.launching);
  const unqueue = useGame((s) => s.unqueue);

  const visible = phase === "orders" || launching;
  if (!visible) return null;

  const filled = queue.length;

  return (
    <div className="pointer-events-none flex flex-col items-center gap-2">
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">
        Secuencia de Ataque {filled}/{ATTACK_SLOTS}
      </div>

      <div className="flex items-center gap-3">
        {Array.from({ length: ATTACK_SLOTS }).map((_, i) => {
          const cmd = queue[i];
          const card = cmd ? hand.find((c) => c.uid === cmd.cardUid) : undefined;
          const def = card ? CARD_DEF_BY_ID[card.defId] : undefined;
          const style = def ? TYPE_ACCENT[def.type] : null;

          return (
            <AnimatePresence mode="popLayout" key={i}>
              {def && card && style ? (
                <motion.button
                  key={`filled-${cmd!.cardUid}`}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 20 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  onClick={() => !launching && unqueue(cmd!.cardUid)}
                  className="pointer-events-auto relative flex h-28 w-20 flex-col items-center justify-center rounded-lg border-2 backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(160deg, ${style.from}, ${style.to})`,
                    borderColor: style.accent,
                    boxShadow: `0 0 18px ${style.accent}aa`,
                  }}
                  title={launching ? "Lanzando…" : "Clic para retirar del slot"}
                >
                  <div className="absolute left-1 top-1 flex gap-0.5">
                    {Array.from({ length: card.level }).map((_, s) => (
                      <span key={s} className="text-[9px] text-quantum-moxie text-glow">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-2xl" style={{ color: style.accent }}>
                    {def.type === "Physical" ? "⚔" : "✶"}
                  </span>
                  <span className="mt-1 line-clamp-2 px-1 text-center font-display text-[9px] leading-tight text-white">
                    {def.name}
                  </span>
                  <span
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-black"
                    style={{ background: style.accent }}
                  >
                    {i + 1}
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  key={`empty-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative flex h-28 w-20 items-center justify-center rounded-lg border-2 border-dashed"
                  style={{
                    borderColor: "rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <span className="font-display text-2xl text-white/20">{i + 1}</span>
                  {/* soft inner glow pulse for the next free slot */}
                  {i === filled && !launching && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{ boxShadow: "inset 0 0 20px rgba(232,176,106,0.4)" }}
                      animate={{ opacity: [0.3, 0.9, 0.3] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
}
