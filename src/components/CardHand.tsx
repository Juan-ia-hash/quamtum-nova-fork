"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useGame, ATTACK_SLOTS } from "@/game/store";
import { CARD_DEF_BY_ID } from "@/game/content";
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
  const dropCardOn = useGame((s) => s.dropCardOn);

  const [dragUid, setDragUid] = useState<string | null>(null);
  const [overUid, setOverUid] = useState<string | null>(null);

  const queuedUids = new Set(queue.map((q) => q.cardUid));
  const canAct = phase === "orders" && !launching;
  const slotsFull = queue.length >= ATTACK_SLOTS;

  const handleCardClick = (uid: string) => {
    if (!canAct) return;
    if (queuedUids.has(uid)) {
      unqueue(uid);
      return;
    }
    assignToSlot(uid);
  };

  // Would dropping `dragUid` onto `targetUid` trigger a fusion? (for highlight)
  const wouldFuse = (targetUid: string) => {
    if (!dragUid || dragUid === targetUid) return false;
    const a = hand.find((c) => c.uid === dragUid);
    const b = hand.find((c) => c.uid === targetUid);
    if (!a || !b) return false;
    const def = CARD_DEF_BY_ID[a.defId];
    return (
      a.defId === b.defId && a.level === b.level && a.level < 3 && !def?.ultimate
    );
  };

  return (
    <div className="relative">
      <div className="mb-2 text-center text-[10px] uppercase tracking-[0.25em] text-white/40">
        {slotsFull
          ? "Secuencia completa — lanzando ataque"
          : `Arrastra para reordenar o fusionar · clic para enviar al slot (${queue.length}/${ATTACK_SLOTS})`}
      </div>

      <div className="flex items-end justify-center gap-2 px-4">
        <AnimatePresence mode="popLayout">
          {hand.map((card, i) => {
            const isQueued = queuedUids.has(card.uid);
            const draggable = canAct && !isQueued;
            const fuseHint = overUid === card.uid && wouldFuse(card.uid);
            const reorderHint =
              overUid === card.uid && dragUid && !wouldFuse(card.uid);

            return (
              <div
                key={card.uid}
                className="relative"
                draggable={draggable}
                onDragStart={(e) => {
                  if (!draggable) return;
                  setDragUid(card.uid);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", card.uid);
                }}
                onDragEnd={() => {
                  setDragUid(null);
                  setOverUid(null);
                }}
                onDragOver={(e) => {
                  if (!canAct || isQueued || !dragUid) return;
                  e.preventDefault();
                  if (overUid !== card.uid) setOverUid(card.uid);
                }}
                onDragLeave={() => {
                  setOverUid((u) => (u === card.uid ? null : u));
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const src = dragUid ?? e.dataTransfer.getData("text/plain");
                  if (src && src !== card.uid) dropCardOn(src, card.uid);
                  setDragUid(null);
                  setOverUid(null);
                }}
              >
                {/* Drop highlight ring */}
                {(fuseHint || reorderHint) && (
                  <div
                    className="pointer-events-none absolute -inset-1 z-50 rounded-xl border-2"
                    style={{
                      borderColor: fuseHint ? "#ffd24a" : "#8fcaff",
                      boxShadow: `0 0 16px ${fuseHint ? "#ffd24a" : "#8fcaff"}`,
                    }}
                  >
                    {fuseHint && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-quantum-moxie px-1.5 text-[9px] font-bold text-black">
                        FUSIÓN ↑Lv
                      </span>
                    )}
                  </div>
                )}

                <div className={dragUid === card.uid ? "opacity-40" : ""}>
                  <Card
                    card={card}
                    selected={selected === card.uid}
                    queued={isQueued}
                    onClick={() => handleCardClick(card.uid)}
                  />
                </div>

                {/* Manual move arrows (free reorder, fallback to drag) */}
                {canAct && !isQueued && (
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
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
