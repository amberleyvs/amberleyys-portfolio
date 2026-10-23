import type { TimelineEntry } from "@/lib/content";
import styles from "./Timeline.module.css";

export function formatDates(entry: Pick<TimelineEntry, "start" | "end">): string {
  return entry.end ? `${entry.start} to ${entry.end}` : `${entry.start} - Present`;
}

type Props = {
  entries: TimelineEntry[];
  id?: string;
  visibleCount?: number;
};

export function Timeline({ entries, id, visibleCount = entries.length }: Props) {
  return (
    <ol id={id} role="list" className={`reveal-group ${styles.timeline}`}>
      {entries.map((entry, index) => (
        <li
          key={`${entry.title}-${entry.start}`}
          className={styles.entry}
          data-extra={index >= visibleCount || undefined}
          data-first-extra={index === visibleCount || undefined}
          tabIndex={index === visibleCount ? -1 : undefined}
        >
          <span className={`${styles.marker} ${index === 0 ? styles.markerLatest : ""}`} aria-hidden="true" />
          <p className={styles.dates}>{formatDates(entry)}</p>
          <h3 className={styles.title}>{entry.title}</h3>
          <p className={styles.org}>{entry.org}</p>
          {entry.points.length > 0 && (
            <ul className={styles.points}>
              {entry.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
