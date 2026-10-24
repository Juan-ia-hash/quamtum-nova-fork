"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useGame } from "@/game/store";
import { CharacterSprite } from "./CharacterSprite";
import { FloatingBars } from "./FloatingBars";
import { CharacterHoverPanel } from "./CharacterHoverPanel";
import { EnemyUnit } from "./EnemyUnit";
import { AttackSlots } from "./AttackSlots";
import { PixelBackground } from "./pixel/PixelBackground";
import { FloatingNumbers } from "./FloatingNumbers";
import { TotalDamage } from "./TotalDamage";

export function Battlefield() {
  const characters = useGame((s) => s.characters);
  const enemy = useGame((s) => s.enemy);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Anime pixel-art battle backdrop (dark foggy ruined city) */}
      <PixelBackground />

      {/* Running TOTAL damage tally (upper-center, over the field) */}
      <div className="absolute left-[55%] top-[12%] z-30 -translate-x-1/2">
        <TotalDamage />
      </div>

      {/* Enemy (right / center) */}
      <div className="absolute right-[12%] top-[26%] z-10">
        <div className="relative">
          <EnemyUnit enemy={enemy} />
          {/* floating damage numbers over the enemy */}
          <FloatingNumbers targetId={enemy.id} />
        </div>
      </div>

      {/* Attack slots — translucent staging area between allies and enemy */}
      <div className="absolute bottom-[30%] left-1/2 z-20 -translate-x-1/2">
        <AttackSlots />
      </div>

      {/* Allies — bottom-left cluster, staggered like the references */}
      <div className="absolute bottom-[30%] left-[6%] z-10 flex items-end gap-10">
        {characters.map((ch, i) => (
          <div
            key={ch.id}
            className="relative flex flex-col items-center"
            style={{ transform: `translateY(${i % 2 === 0 ? 0 : 26}px)` }}
            onMouseEnter={() => setHovered(ch.id)}
            onMouseLeave={() => setHovered((h) => (h === ch.id ? null : h))}
          >
            {/* floating bars above head */}
            <div className="mb-1">
              <FloatingBars character={ch} />
            </div>

            <div className="relative">
              <CharacterSprite character={ch} />
              {/* floating damage / heal numbers over this ally */}
              <FloatingNumbers targetId={ch.id} />
            </div>

            {/* Hover panel */}
            <AnimatePresence>
              {hovered === ch.id && (
                <div className="absolute bottom-full left-1/2 z-40 mb-3 -translate-x-1/2">
                  <CharacterHoverPanel character={ch} />
                </div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
