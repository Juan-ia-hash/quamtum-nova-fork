"use client";

import { motion } from "framer-motion";
import type { Character } from "@/game/types";
import { ARCHITECTURE_META } from "@/game/affinity";
import { PixelSprite } from "./pixel/PixelSprite";
import {
  SPRITE_CHAR_01,
  SPRITE_CHAR_02,
  SPRITE_CHAR_03,
  type PixelArt,
} from "./pixel/spriteData";

const SPRITE_BY_ID: Record<string, PixelArt> = {
  char_01: SPRITE_CHAR_01,
  char_02: SPRITE_CHAR_02,
  char_03: SPRITE_CHAR_03,
};

/**
 * Anime pixel-art ally sprite. The body is drawn as crisp pixel art (see
 * spriteData) and reacts to the combat rhythm through `spriteState`:
 * idle breathing, physical dash, logical float, ultimate pose, hit, death.
 */
export function CharacterSprite({ character }: { character: Character }) {
  const meta = ARCHITECTURE_META[character.architecture];
  const state = character.spriteState;
  const art = SPRITE_BY_ID[character.id] ?? SPRITE_CHAR_01;

  const bodyAnim = (() => {
    switch (state) {
      case "attack-physical":
        return { x: [0, 90, 10], rotate: [0, -6, 0], transition: { duration: 0.7 } };
      case "attack-logical":
        return { y: [0, -24, -10], transition: { duration: 0.75 } };
      case "ultimate":
        return { scale: [1, 1.15, 1.08], y: [0, -30, -14], transition: { duration: 1.2 } };
      case "hit":
        return { x: [0, -14, 0], transition: { duration: 0.3 } };
      case "dead":
        return { opacity: 0.25, y: 20, rotate: -8, filter: "grayscale(1)" };
      default:
        return {};
    }
  })();

  const idleClass = state === "idle" ? "pixel-bob" : "";

  return (
    <div className="relative flex flex-col items-center" style={{ width: 96 }}>
      {/* Aura / affinity glow ring at the feet (reference: energy pool) */}
      <div
        className="absolute left-1/2 bottom-2 h-7 w-24 -translate-x-1/2 rounded-[50%] blur-md"
        style={{
          background: `radial-gradient(ellipse, ${meta.color}88, transparent 70%)`,
          opacity: state === "dead" ? 0.1 : 0.8,
        }}
      />
      {/* rising sparkles under the feet when idle/casting */}
      {state !== "dead" && (
        <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2">
          <span
            className="twinkle absolute -left-6 bottom-0 text-[8px]"
            style={{ color: meta.color }}
          >
            ✦
          </span>
          <span
            className="twinkle absolute left-5 bottom-1 text-[7px]"
            style={{ color: meta.color, animationDelay: "0.8s" }}
          >
            ✧
          </span>
        </div>
      )}

      <motion.div
        className={`relative ${idleClass}`}
        animate={bodyAnim}
        style={{ transformOrigin: "bottom center" }}
      >
        <PixelSprite
          rows={art.rows}
          palette={art.palette}
          scale={4}
          className="pixelated drop-shadow-[0_6px_6px_rgba(0,0,0,0.6)]"
        />

        {/* Physical impact: pixel slash sparks */}
        {state === "attack-physical" && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute right-0 top-1/3 h-[3px] w-20 bg-white" />
            <div className="absolute right-2 top-1/2 h-[3px] w-12" style={{ background: meta.color }} />
          </motion.div>
        )}

        {/* Logical: holographic ring gesture */}
        {state === "attack-logical" && (
          <motion.div
            className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 1.3], rotate: 180 }}
            transition={{ duration: 0.75 }}
          >
            <div
              className="h-16 w-16 rounded-full border-2"
              style={{ borderColor: meta.color, boxShadow: `0 0 16px ${meta.color}` }}
            />
          </motion.div>
        )}

        {/* Ultimate: radiant burst behind the sprite */}
        {state === "ultimate" && (
          <motion.div
            className="pointer-events-none absolute inset-0 -z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0.3], scale: [0.5, 1.6, 1.3] }}
            transition={{ duration: 1.2 }}
            style={{
              background: `radial-gradient(circle, ${meta.color}aa, transparent 65%)`,
            }}
          />
        )}
      </motion.div>

      {/* name tag */}
      <div className="mt-1 font-display text-[10px] uppercase tracking-widest text-white/70">
        {character.name}
      </div>
    </div>
  );
}
