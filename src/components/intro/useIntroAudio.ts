"use client";

import { useEffect, useRef, useState } from "react";

/** Quiet original ambient tones. No downloads, autoplay, speech or third-party audio. */
export function useIntroAudio(stopped: boolean) {
  const context = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const mounted = useRef(true);
  const busy = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const active = context.current;
      context.current = null;
      if (active && active.state !== "closed") void active.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (context.current && gain.current) {
      gain.current.gain.setTargetAtTime(enabled && !stopped ? .025 : 0, context.current.currentTime, .15);
    }
  }, [enabled, stopped]);

  async function toggle() {
    if (busy.current) return;
    if (enabled) { setEnabled(false); return; }
    busy.current = true;
    try {
      if (!context.current) {
        const Audio = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Audio) throw new Error("Web Audio unavailable");
        const audio = new Audio();
        context.current = audio;
        const volume = audio.createGain();
        volume.gain.value = 0;
        volume.connect(audio.destination);
        gain.current = volume;
        [110, 164.81, 220.4].forEach(frequency => {
          const oscillator = audio.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          oscillator.connect(volume);
          oscillator.start();
        });
      }
      await context.current.resume();
      if (mounted.current) setEnabled(true);
    } catch {
      if (mounted.current) { setUnavailable(true); setEnabled(false); }
    } finally { busy.current = false; }
  }

  return { enabled, unavailable, toggle };
}
