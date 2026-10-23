import Image from "next/image";
import { NotionIcon } from "@/components/ui/icons";
import { LoopingVideo } from "@/components/ui/LoopingVideo";
import { Placeholder } from "@/components/ui/Placeholder";
import { offTheClock, type OffTheClockItem } from "@/lib/content";
import styles from "./OffTheClock.module.css";

function ItemMedia({ item }: { item: OffTheClockItem }) {
  const { media } = item;
  if (!media) return <Placeholder className={styles.placeholder} label={`${item.title} photo or video`} />;
  if (media.type === "video") return <LoopingVideo className={styles.image} src={media.src} poster={media.poster} />;
  return <Image className={styles.image} src={media.src} alt={media.alt} fill sizes="(max-width: 640px) 112px, (max-width: 1023px) 50vw, 300px" />;
}

export function OffTheClock() {
  return (
    <section id="off-the-clock" className={styles.section} aria-labelledby="off-the-clock-heading">
      <div className={styles.band}>
        <div className={`reveal ${styles.bandInner}`}>
          <h2 id="off-the-clock-heading" className={styles.heading}>
            Off the clock
          </h2>
          <p className={styles.intro}>{offTheClock.intro}</p>
        </div>
      </div>
      <div className={styles.platform} aria-hidden="true" />

      <ul role="list" className={`container reveal-group ${styles.list}`}>
        {offTheClock.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.media}>
              <ItemMedia item={item} />
            </div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.line}>{item.line}</p>
            {item.link && (
              <a
                className={`text-link ${styles.link}`}
                href={item.link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.link.label} on Notion (opens in a new tab)`}
              >
                <NotionIcon size={20} />
                {item.link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
