"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/game/store";

export function ResultOverlay() {
  const phase = useGame((s) => s.phase);
  const reset = useGame((s) => s.resetGame);
  const turn = useGame((s) => s.turn);
  const totalDamage = useGame((s) => s.totalDamage);

  const show = phase === "victory" || phase === "defeat";
  const win = phase === "victory";

  // Fake-but-coherent progression numbers for the summary panel.
  const xpGain = Math.min(3900, 1600 + totalDamage % 2000);

  return (
    <AnimatePresence>
      {show && (win ? (
        <VictoryScreen
          key="victory"
          turn={turn}
          xp={xpGain}
          onContinue={() => reset()}
        />
      ) : (
        <DefeatScreen key="defeat" onContinue={() => reset()} />
      ))}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Victory — gacha-style result screen (reference layout)
// ---------------------------------------------------------------------------
function VictoryScreen({
  turn,
  xp,
  onContinue,
}: {
  turn: number;
  xp: number;
  onContinue: () => void;
}) {
  const xpMax = 3900;
  const xpPct = Math.min(100, (xp / xpMax) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 overflow-hidden"
    >
      {/* Dark cinematic backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 600px at 30% 40%, rgba(40,55,90,0.5), transparent 60%)," +
            "radial-gradient(900px 500px at 80% 20%, rgba(90,70,30,0.28), transparent 60%)," +
            "linear-gradient(120deg, #05070c 0%, #0a0e18 50%, #0c0f1a 100%)",
        }}
      />
      {/* faint city silhouette near the floor */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 opacity-30 grid-overlay" />
      <div className="absolute inset-0 scanlines opacity-30" />

      {/* Hero portrait — slides in from the left */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
        className="absolute bottom-0 left-0 top-0 flex items-end"
      >
        <div className="relative h-[92%]">
          <img
            src="/hero-victory.jpg"
            alt="Héroe victorioso"
            className="pixelated h-full w-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 40px rgba(78,168,255,0.35))",
              // blend the checkerboard-free character against the dark bg
              mixBlendMode: "screen",
            }}
          />
          {/* fade the right edge into the backdrop */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 55%, rgba(5,7,12,0.0) 70%, rgba(5,7,12,0.6) 100%)",
            }}
          />
        </div>
      </motion.div>

      {/* Right-side result panel */}
      <div className="absolute right-[6%] top-1/2 w-[46%] max-w-xl -translate-y-1/2">
        {/* Ornament + VICTORY */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative mb-8 text-right"
        >
          <div className="mb-1 flex items-center justify-end gap-3 text-quantum-gold/70">
            <span className="text-2xl">△</span>
          </div>
          <h1
            className="font-display text-6xl font-bold uppercase tracking-[0.18em] text-white md:text-7xl"
            style={{ textShadow: "0 0 26px rgba(232,176,106,0.7), 0 2px 4px #000" }}
          >
            Victory
          </h1>
          <div className="mt-1 flex items-center justify-end gap-1 text-quantum-gold/60">
            <span>✦</span>
            <span className="h-px w-40 bg-gradient-to-l from-quantum-gold/70 to-transparent" />
          </div>
        </motion.div>

        {/* Mission line */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-quantum-gold/50 bg-black/40">
              <span className="font-display text-[11px] text-quantum-gold">
                SP<span className="text-lg">{Math.min(6, turn)}</span>
                <span className="text-white/40">/6</span>
              </span>
            </div>
            <div>
              <div className="font-display text-2xl text-white">Juego Limpio</div>
            </div>
          </div>
          <div className="mt-3 h-px w-full bg-gradient-to-r from-quantum-gold/50 via-white/20 to-transparent" />
          <p className="mt-3 text-sm tracking-wide text-white/70">
            Derrota a todos los enemigos.
            <span className="ml-2 text-quantum-gold">✦</span>
          </p>
        </motion.div>

        {/* XP / Level bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-10 flex items-center gap-3"
        >
          <span className="font-display text-sm text-white/80">Lv 22</span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-black/60 border border-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ delay: 0.7, duration: 0.9, ease: "easeOut" }}
              style={{ boxShadow: "0 0 10px rgba(255,120,40,0.7)" }}
            />
          </div>
          <span className="text-[11px] text-white/50">
            {xp.toLocaleString()}/{xpMax.toLocaleString()}
          </span>
        </motion.div>

        {/* Continue */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="ml-auto block rounded-full border border-quantum-gold/70 bg-quantum-gold/15 px-8 py-2.5 font-display uppercase tracking-widest text-quantum-gold transition hover:bg-quantum-gold/25"
        >
          Continuar ▸
        </motion.button>
      </div>

      {/* Character quote (bottom-left) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-[6%] flex items-center gap-2 text-white/80"
      >
        <span className="text-quantum-gold">▸</span>
        <span className="font-display italic tracking-wide">
          ¿Eso es todo lo que tienes?
        </span>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Defeat — kept simple
// ---------------------------------------------------------------------------
function DefeatScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="text-center"
      >
        <div
          className="font-display text-6xl tracking-widest text-red-400"
          style={{ textShadow: "0 0 30px #ef4444" }}
        >
          DECOHERENCIA TOTAL
        </div>
        <p className="mt-2 text-sm text-white/60">
          El entorno colapsó la función de onda del equipo.
        </p>
        <button
          onClick={onContinue}
          className="mt-6 rounded-full border border-red-400/60 bg-red-500/10 px-6 py-2 font-display text-red-300 transition hover:bg-red-500/20"
        >
          ↻ Reinicializar Simulación
        </button>
      </motion.div>
    </motion.div>
  );
}
