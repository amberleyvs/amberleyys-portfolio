"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import styles from "./ShowMore.module.css";

type Props = {
  total: number;
  visible: number;
  controls: string;
  buttonClassName?: string;
  children: ReactNode;
};

export function ShowMore({ total, visible, controls, buttonClassName, children }: Props) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toggled = useRef(false);
  const hiddenCount = total - visible;

  useEffect(() => {
    if (!toggled.current) return;
    if (expanded) {
      containerRef.current?.querySelector<HTMLElement>("[data-first-extra]")?.focus();
    } else {
      buttonRef.current?.scrollIntoView?.({ block: "nearest" });
    }
  }, [expanded]);

  if (hiddenCount <= 0) return <>{children}</>;

  return (
    <div ref={containerRef} className={expanded ? styles.expanded : styles.collapsed}>
      {children}
      <button
        ref={buttonRef}
        type="button"
        className={`text-link ${styles.toggle} ${buttonClassName ?? ""}`}
        aria-expanded={expanded}
        aria-controls={controls}
        onClick={() => {
          toggled.current = true;
          setExpanded((current) => !current);
        }}
      >
        {expanded ? "See less" : "See more"}
        {!expanded && <span className="visually-hidden">: {hiddenCount} more</span>}
        <ChevronDownIcon size={18} className={`${styles.chevron} ${expanded ? styles.up : ""}`} />
      </button>
    </div>
  );
}
