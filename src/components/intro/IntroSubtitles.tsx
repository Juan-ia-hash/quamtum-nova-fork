import { AnimatePresence, motion } from "framer-motion";
import { cues } from "./story";
import styles from "./intro.module.css";

export function IntroSubtitles({ second, reduced }: { second: number; reduced: boolean }) {
  const cue = cues.find(item => second >= item.start && second < item.end);
  return <div className={styles.subtitles} aria-live="polite" aria-atomic="true">
    <AnimatePresence mode="wait">
      {cue && <motion.div key={cue.start} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}>
        {"speaker" in cue && <span className={styles.speaker}>{cue.speaker}</span>}
        <p>{cue.text}</p>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
