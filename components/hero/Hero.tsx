import { TrainScene } from "@/components/hero/TrainScene";
import { TypingText } from "@/components/hero/TypingText";
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";
import { site } from "@/lib/content";
import styles from "./Hero.module.css";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Hero() {
  return (
    <section id="home" aria-label="Introduction">
      <div className={`container ${styles.grid}`}>
        <div>
          <h1 className={styles.title}>{site.name}</h1>
          <TypingText className={styles.lead} text={site.tagline} />
          <div className={styles.actions}>
            <a className="btn btn--primary" href="#work">
              See my work
              <ArrowIcon />
            </a>
            <ul role="list" className={styles.contact} aria-label="Contact">
              <li>
                <a className={styles.icon} href={site.links.linkedin} aria-label="LinkedIn (opens in a new tab)" {...newTab}>
                  <LinkedInIcon size={28} />
                </a>
              </li>
              <li>
                <a className={styles.icon} href={`mailto:${site.email}`} aria-label={`Email ${site.email}`}>
                  <MailIcon size={32} />
                </a>
              </li>
              <li>
                <a className={styles.icon} href={site.links.github} aria-label="GitHub (opens in a new tab)" {...newTab}>
                  <GitHubIcon size={28} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <figure className={styles.frame}>
          <Photo className={styles.photo} sizes="296px" />
        </figure>
      </div>

      <TrainScene />
    </section>
  );
}
