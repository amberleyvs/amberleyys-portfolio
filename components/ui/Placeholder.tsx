import type { CSSProperties } from "react";
import styles from "./Placeholder.module.css";

type Props = {
  label: string;
  aspectRatio?: string;
  className?: string;
};

export function Placeholder({ label, aspectRatio, className }: Props) {
  const style: CSSProperties | undefined = aspectRatio ? { aspectRatio } : undefined;

  return (
    <div className={`${styles.placeholder} ${className ?? ""}`} style={style} aria-hidden="true">
      [{label}]
    </div>
  );
}
