"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { DURATION } from "./story";

/** One clock for the camera, edits, subtitles and progress; no per-frame React renders. */
export function useCinematicTimeline(cover: boolean, onComplete: () => void) {
  const time = useMotionValue(0);
  const [second, setSecond] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const complete = useRef(onComplete);
  complete.current = onComplete;

  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(() => {
    if (cover || paused || hidden) return;
    let frame = 0;
    let previous = performance.now();
    let displayed = Math.floor(time.get());
    function tick(now: number) {
      // Count actual active time, so slow mobile frames cannot stretch the story.
      // Pausing or hiding the document resets `previous` through this effect.
      const next = Math.min(DURATION, time.get() + Math.max(0, (now - previous) / 1000));
      previous = now;
      time.set(next);
      const rounded = Math.floor(next);
      if (rounded !== displayed) { displayed = rounded; setSecond(rounded); }
      if (next >= DURATION) { complete.current(); return; }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cover, paused, hidden, time]);

  function restart() {
    time.set(0);
    setSecond(0);
    setPaused(false);
  }

  return { time, second, paused, stopped: paused || hidden, setPaused, restart };
}
