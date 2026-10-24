"use client";

import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useCinematicTimeline } from "./CinematicTimeline";
import { useIntroAudio } from "./useIntroAudio";
import { SceneArt } from "./SceneArt";
import { PortalEffect } from "./PortalEffect";
import { IntroSubtitles } from "./IntroSubtitles";
import { IntroTitleScreen } from "./IntroTitleScreen";
import { cues, DURATION, shots, shotAt } from "./story";
import styles from "./intro.module.css";

const Art = memo(SceneArt);

function CameraShot({ index, time, reduced }: { index: number; time: MotionValue<number>; reduced: boolean }) {
  const shot = shots[index];
  const scale = useTransform(time, [shot.start, shot.end], reduced ? [1, 1] : shot.scale);
  const x = useTransform(time, [shot.start, shot.end], reduced ? ["0%", "0%"] : shot.x.map(value => `${value}%`));
  const y = useTransform(time, [shot.start, shot.end], reduced ? ["0%", "0%"] : shot.y.map(value => `${value}%`));
  return <motion.div className={styles.shot} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .45 }}>
    <motion.div className={styles.camera} style={{ scale, x, y }}><Art scene={index} /></motion.div>
  </motion.div>;
}

export function QuantumNovaIntro({ initialCover = false, onSeen, onStart }: { initialCover?: boolean; onSeen: () => void; onStart: () => void }) {
  const [cover, setCover] = useState(initialCover);
  const [transcript, setTranscript] = useState(false);
  const reduced = !!useReducedMotion();
  function finish() { onSeen(); setCover(true); }
  const timeline = useCinematicTimeline(cover, finish);
  const audio = useIntroAudio(timeline.stopped);
  const index = cover ? 6 : shotAt(timeline.second);
  const shot = shots[index];
  const progress = useTransform(timeline.time, [0, DURATION], [0, 1]);
  // Camera crosses a portal during the discovery and the final approach.
  const portalScale = useTransform(timeline.time, [0, 4, 5, 6.8, 7.3, 24, 25, 26, 27.5, DURATION], reduced ? [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] : [.8, .8, 1.1, 5, 5, .7, .7, 1.1, 3.5, 1]);
  const portalOpacity = useTransform(timeline.time, [0, 4, 5, 6.5, 7.3, 24, 25, 26, 27.5, DURATION], [0, 0, .6, .95, 0, 0, .3, .7, .25, .75]);

  function replay() { timeline.restart(); setCover(false); }

  return <main className={styles.intro} data-paused={timeline.stopped} data-cover={cover} data-shot={index} style={{ "--accent": shot.color } as CSSProperties} aria-label="Quantum Nova: introducción cinematográfica">
    <div className={styles.nebula} aria-hidden="true" />
    <div className={styles.stars} aria-hidden="true">{Array.from({ length: 40 }, (_, i) => <i key={i} style={{ left: `${(i * 73 + 11) % 100}%`, top: `${(i * 37 + 3) % 100}%`, animationDelay: `${-(i % 9)}s` }} />)}</div>
    <div className={styles.farStars} aria-hidden="true" />
    <div className={styles.stage} aria-hidden="true">
      <AnimatePresence>{!cover && <CameraShot key={index} index={index} time={timeline.time} reduced={reduced} />}</AnimatePresence>
      <motion.div className={styles.portalTravel} style={cover ? { opacity: .8, scale: 1 } : { opacity: portalOpacity, scale: portalScale }}><PortalEffect cover={cover} /></motion.div>
      <div className={styles.vignette} />
    </div>
    <header className={styles.header}>
      <span className={styles.wordmark} translate="no"><span aria-hidden="true">◈</span> QUANTUM NOVA</span>
      <div className={styles.headerControls}>
        <button className={styles.sound} onClick={audio.toggle} aria-pressed={audio.enabled} disabled={audio.unavailable}>{audio.unavailable ? "Sonido no disponible" : audio.enabled ? "Sonido: activado" : "Sonido: silenciado"}</button>
        {!cover && <button className={styles.skip} onClick={finish}>SALTAR INTRODUCCIÓN <span aria-hidden="true">↗</span></button>}
      </div>
    </header>
    {!cover && <>
      <div className={styles.shotLabel}><span>Archivo del multiverso</span><h1 className={styles.chapterTitle}>{shot.name}</h1></div>
      <AnimatePresence>
        {index === 3 && timeline.second >= shots[3].start + 2 && <motion.div className={styles.doctrine} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>UN UNIVERSO.<br />UNA REALIDAD.<br /><strong>UN DESTINO.</strong></motion.div>}
        {index === 4 && timeline.second >= shots[4].start + 1 && <motion.div className={styles.anomaly} initial={{ opacity: 0, scale: reduced ? 1 : .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><strong>SUPERADOX</strong><span>SUPERADOX DETECTADA.</span><span>ELIMINACIÓN AUTORIZADA.</span><small>Fenómeno ficticio de la historia del juego.</small></motion.div>}
      </AnimatePresence>
      <IntroSubtitles second={timeline.second} reduced={reduced} />
    </>}
    {cover && <IntroTitleScreen onStart={onStart} onReplay={replay} reduced={reduced} />}
    <footer className={styles.footer}>
      {!cover ? <>
        <button className={styles.secondary} aria-pressed={timeline.paused} onClick={() => timeline.setPaused(value => !value)}>{timeline.paused ? "REANUDAR" : "PAUSAR"}</button>
        <div className={styles.progress} role="progressbar" aria-label="Tiempo de la cinemática" aria-valuemin={0} aria-valuemax={DURATION} aria-valuenow={timeline.second}><motion.div style={{ scaleX: progress }} /></div>
        <span className={styles.time}>{String(Math.floor(timeline.second / 60)).padStart(2, "0")}:{String(timeline.second % 60).padStart(2, "0")} / 00:{DURATION}</span>
      </> : <span className={styles.coverFooter}>Una historia original del multiverso</span>}
      <button className={styles.transcriptToggle} onClick={() => { setTranscript(true); if (!cover) timeline.setPaused(true); }}>Leer historia</button>
    </footer>
    {transcript && <StoryTranscript onClose={() => setTranscript(false)} />}
  </main>;
}

function StoryTranscript({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); active?.focus(); };
  }, []);
  return <dialog ref={dialog} className={styles.transcript} onCancel={onClose} aria-labelledby="transcript-title">
    <button className={styles.secondary} onClick={onClose}>Cerrar historia</button>
    <h2 id="transcript-title">La Rebelión del Multiverso</h2>
    {cues.map(cue => <p key={cue.start}>{cue.text}</p>)}
    <p>Superadox es un fenómeno ficticio del universo narrativo de Quantum Nova.</p>
  </dialog>;
}
