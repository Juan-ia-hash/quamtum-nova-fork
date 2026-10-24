import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./intro.module.css";

export function IntroTitleScreen({ onStart, onReplay, reduced }: { onStart: () => void; onReplay: () => void; reduced: boolean }) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus({ preventScroll: true }); }, []);
  return <motion.section className={styles.titleScreen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .6 }} aria-labelledby="nova-title">
    <p className={styles.coverKicker}>El futuro no está escrito</p>
    <h1 id="nova-title" tabIndex={-1} ref={title} className={styles.gameTitle} translate="no"><span>QUANTUM</span> NOVA</h1>
    <p className={styles.coverSubtitle}>LA REBELIÓN DEL MULTIVERSO</p>
    <div className={styles.coverActions}>
      <button className={styles.primary} onClick={onStart}>INICIAR AVENTURA <span aria-hidden="true">↗</span></button>
      <button className={styles.secondary} onClick={onReplay}>VOLVER A VER CINEMÁTICA</button>
    </div>
    <p className={styles.coverNote}>Infinitas posibilidades. Una decisión: resistir.</p>
  </motion.section>;
}
