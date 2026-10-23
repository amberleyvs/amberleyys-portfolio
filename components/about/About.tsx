import { PinIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";
import { site } from "@/lib/content";
import styles from "./About.module.css";

export function About() {
  const { paragraph, away } = site.about;

  return (
    <section id="about" className={styles.band} aria-labelledby="about-heading">
      <div className={`reveal ${styles.inner}`}>
        <figure className={styles.frame}>
          <span className={styles.tape} aria-hidden="true" />
          <div className={styles.paper}>
            <Photo className={styles.photo} sizes="276px" />
            {site.photo.caption && <figcaption className={styles.caption}>{site.photo.caption}</figcaption>}
          </div>
        </figure>

        <h2 id="about-heading" className={styles.heading}>
          A little about me
        </h2>

        <div className={styles.body}>
          <p className={styles.text}>{paragraph}</p>
          <p className={styles.text}>
            {away}
          </p>
          <ul role="list" className={styles.facts}>
            <li>
              <PinIcon size={22} />
              {site.city}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
