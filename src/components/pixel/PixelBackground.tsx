"use client";

import { PixelSprite } from "./PixelSprite";

// Far skyline — faint, cool-toned ruined city silhouette.
const SKYLINE_FAR: string[] = [
  "                                        ",
  "        B     B        B                ",
  "   B    B  B  B    B    B   B       B    ",
  "   B  B B  B  BB   B  B B   B   B   B    ",
  "B  B  B B  BB BB B B  B BB  BB  B B BB  B",
  "B  BB B BB BB BB B BB B BB  BB BB B BB BB",
  "BB BB BBBB BB BBBBBBB BBBB BBB BB BBBB BB",
  "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
];

// Near buildings — darker, taller, closer; lit windows as accent.
const SKYLINE_NEAR: string[] = [
  "   D        D   D             D         ",
  "   D   DD   D   D    DD       D    DD    ",
  "DD D   DD   DwD DD   DD  DD   DwD  DD  DD",
  "DD D   DwD  DD  DwD  DwD DD   DD   DwD DD",
  "DDwD   DD   DD  DD   DD  DwD  DD   DD  DD",
  "DD D   DD   DwD DD   DD  DD   DwD  DD  DD",
  "DDwDD DDD  DDD DDDD DDD DDDD DDD DDDD DDD",
  "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
  "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
];

const FAR_PALETTE = { B: "#2a3448", w: "#3a4a66" };
const NEAR_PALETTE = { D: "#14101c", w: "#e8b06a" };

/**
 * Layered anime pixel-art battle backdrop: dark foggy ruined city.
 * Sky gradient → far skyline → drifting fog → near buildings → ground.
 */
export function PixelBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient with cold/warm atmospheric glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 420px at 72% 14%, rgba(70,90,140,0.4), transparent 62%)," +
            "radial-gradient(800px 500px at 18% 95%, rgba(90,30,60,0.35), transparent 60%)," +
            "linear-gradient(180deg, #0c1222 0%, #0a0e1a 45%, #070a12 72%, #05070c 100%)",
        }}
      />

      {/* Far skyline — stretched across the upper third */}
      <div className="absolute inset-x-0 top-[14%] flex justify-center opacity-70">
        <PixelSprite
          rows={SKYLINE_FAR}
          palette={FAR_PALETTE}
          scale={6}
          className="pixelated w-full"
          style={{ width: "100%", filter: "blur(0.5px)" }}
        />
      </div>

      {/* Drifting fog band behind the near buildings */}
      <div className="fog-layer absolute inset-x-0 top-[26%] h-40 bg-gradient-to-b from-slate-300/12 to-transparent blur-2xl" />

      {/* Near buildings — anchored lower, warm lit windows */}
      <div className="absolute inset-x-0 top-[22%] flex justify-center opacity-90">
        <PixelSprite
          rows={SKYLINE_NEAR}
          palette={NEAR_PALETTE}
          scale={8}
          className="pixelated"
          style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }}
        />
      </div>

      {/* Ground plane — wet asphalt with a faint horizon line */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            "linear-gradient(180deg, #0a0c14 0%, #0c0f18 40%, #070910 100%)",
          boxShadow: "inset 0 24px 40px rgba(0,0,0,0.7)",
        }}
      />
      {/* horizon fog line */}
      <div className="fog-layer absolute inset-x-0 top-[56%] h-24 bg-gradient-to-b from-slate-400/15 to-transparent blur-xl" />

      {/* Pixel scanlines + grid for the techno-quantum vibe */}
      <div className="scanlines absolute inset-0 opacity-40" />
      <div className="grid-overlay absolute inset-0 opacity-20" />

      {/* Floating ambient embers / data motes */}
      {[
        { l: "18%", t: "40%", d: "0s" },
        { l: "34%", t: "30%", d: "0.6s" },
        { l: "52%", t: "48%", d: "1.2s" },
        { l: "66%", t: "34%", d: "0.3s" },
        { l: "80%", t: "44%", d: "0.9s" },
        { l: "44%", t: "22%", d: "1.5s" },
      ].map((p, i) => (
        <span
          key={i}
          className="twinkle absolute h-[3px] w-[3px] rounded-full bg-slate-200/70"
          style={{ left: p.l, top: p.t, animationDelay: p.d }}
        />
      ))}
    </div>
  );
}
