import Image from "next/image";
import { site } from "@/lib/content";
import styles from "./Photo.module.css";

type PhotoProps = {
  sizes: string;
  className?: string;
};

export function Photo({ sizes, className }: PhotoProps) {
  const { src, alt, placeholder } = site.photo;

  return (
    <div className={`${styles.photo} ${className ?? ""}`}>
      {src ? (
        <Image className={styles.image} src={src} alt={alt} fill sizes={sizes} />
      ) : (
        <p className={styles.placeholder}>{placeholder}</p>
      )}
    </div>
  );
}
