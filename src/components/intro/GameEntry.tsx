"use client";

import { useEffect, useState } from "react";
import { BattleScreen } from "@/components/BattleScreen";
import { QuantumNovaIntro } from "./QuantumNovaIntro";
import { STORAGE_KEY } from "./story";
import styles from "./intro.module.css";

export function GameEntry() {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [entered, setEntered] = useState(false);
  const [initialCover, setInitialCover] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(STORAGE_KEY) === "seen"; } catch { /* Storage may be disabled. */ }
    setInitialCover(seen);
    setReady(true);
  }, []);

  function markSeen() {
    try { localStorage.setItem(STORAGE_KEY, "seen"); } catch { /* The game still works without persistence. */ }
  }

  function enterGame() {
    markSeen();
    setEntered(true);
    setShowIntro(false);
  }

  if (!ready) return <div className={styles.loading} role="status">Conectando con el multiverso…</div>;

  return (
    <>
      {entered && <div hidden={showIntro}><BattleScreen /></div>}
      {showIntro ? <QuantumNovaIntro initialCover={initialCover} onSeen={markSeen} onStart={enterGame} /> : (
        <button className={styles.replay} onClick={() => { setInitialCover(false); setShowIntro(true); }}>◈ Ver cinemática</button>
      )}
    </>
  );
}
