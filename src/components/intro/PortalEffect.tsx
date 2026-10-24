import styles from "./intro.module.css";

export function PortalEffect({ cover = false }: { cover?: boolean }) {
  return <div className={`${styles.portal} ${cover ? styles.coverPortal : ""}`} aria-hidden="true">
    <div className={styles.portalMist} />
    <div className={styles.portalRing} />
    <div className={styles.portalRing} />
    <div className={styles.portalRing} />
    <div className={styles.portalCore} />
  </div>;
}
