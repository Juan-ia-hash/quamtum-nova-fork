"use client";

import { AnimatePresence } from "framer-motion";
import { useGame, ATTACK_SLOTS } from "@/game/store";
import { Card } from "./Card";

export function CardHand() {
  const hand = useGame((s) => s.hand);
  const phase = useGame((s) => s.phase);
  const queue = useGame((s) => s.queue);
  const selected = useGame((s) => s.selectedCardUid);
  const launching = useGame((s) => s.launching);
  const assignToSlot = useGame((s) => s.assignToSlot);
  const unqueue = useGame((s) => s.unqueue);
  const moveCard = useGame((s) => s.moveCard);

  const queuedUids = new Set(queue.map((q) => q.cardUid));
  const canAct = phase === "orders" && !launching;
  const slotsFull = queue.length >= ATTACK_SLOTS;

  const handleCardClick = (uid: string) => {
    if (!canAct) return;
    // clicking a card already in a slot releases it
    if (queuedUids.has(uid)) {
      unqueue(uid);
      return;
    }
    // otherwise drop it into the next free attack slot
    assignToSlot(uid);
  };

  return (
    <div className="relative">
      <div className="mb-2 text-center text-[10px] uppercase tracking-[0.25em] text-white/40">
        {slotsFull
          ? "Secuencia completa — lanzando ataque"
          : `Elige ${ATTACK_SLOTS - queue.length} carta(s) para llenar los slots de ataque`}
      </div>

      <div className="flex items-end justify-center gap-2 px-4">
        <AnimatePresence mode="popLayout">
          {hand.map((card, i) => (
            <div key={card.uid} className="relative">
              <Card
                card={card}
                selected={selected === card.uid}
                queued={queuedUids.has(card.uid)}
                onClick={() => handleCardClick(card.uid)}
              />
              {/* Manual move arrows (free reorder) */}
              {canAct && !queuedUids.has(card.uid) && (
                <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
                  <button
                    disabled={i === 0}
                    onClick={() => moveCard(i, i - 1)}
                    className="rounded bg-black/60 px-1.5 text-[10px] text-white/70 disabled:opacity-20"
                    title="Mover izquierda"
                  >
                    ◀
                  </button>
                  <button
                    disabled={i === hand.length - 1}
                    onClick={() => moveCard(i, i + 1)}
                    className="rounded bg-black/60 px-1.5 text-[10px] text-white/70 disabled:opacity-20"
                    title="Mover derecha"
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
