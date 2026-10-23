import { site } from "@/lib/content";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
