import { Timeline } from "@/components/experience/Timeline";
import { DownloadIcon } from "@/components/ui/icons";
import { ShowMore } from "@/components/ui/ShowMore";
import { experience, site } from "@/lib/content";
import styles from "./Experience.module.css";

const VISIBLE_ROLES = 3;

export function Experience() {
  const { roles } = experience;

  return (
    <section className="container" aria-labelledby="experience-heading">
      <div className={styles.grid}>
        <div className="reveal">
          <p className={`label ${styles.kicker}`}>Career so far</p>
          <h2 id="experience-heading" className={styles.heading}>
            Experience
          </h2>
          <a className={`btn btn--dark ${styles.resume}`} href={site.links.resume} target="_blank" rel="noopener noreferrer">
            <DownloadIcon size={18} />
            Download resume
            <span className="visually-hidden"> (PDF, opens in a new tab)</span>
          </a>
        </div>

        <ShowMore total={roles.length} visible={VISIBLE_ROLES} controls="experience-timeline" buttonClassName={styles.more}>
          <Timeline id="experience-timeline" entries={roles} visibleCount={VISIBLE_ROLES} />
        </ShowMore>
      </div>
    </section>
  );
}
