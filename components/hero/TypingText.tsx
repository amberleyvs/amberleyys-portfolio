"use client";

import { useEffect, useState } from "react";
import styles from "./TypingText.module.css";

const START_DELAY = 500;
const CHAR_DELAY = 35;
const PAUSE_AFTER = /[,.!?]/;
const PAUSE_DELAY = 220;

type Props = { text: string; className?: string };

export function TypingText({ text, className }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let shown = reduced ? text.length : 0;
    let timer = window.setTimeout(
      function tick() {
        setCount(shown);
        if (shown >= text.length) return;
        shown += 1;
        timer = window.setTimeout(tick, PAUSE_AFTER.test(text[shown - 1]) ? PAUSE_DELAY : CHAR_DELAY);
      },
      reduced ? 0 : START_DELAY,
    );
    return () => window.clearTimeout(timer);
  }, [text]);

  const typed = count === null ? text : text.slice(0, count);
  const rest = count === null ? "" : text.slice(count);
  const state = count === null ? "waiting" : count < text.length ? "typing" : "done";

  return (
    <p className={className}>
      <span className="visually-hidden">{text}</span>
      <span className={styles.typing} data-state={state} aria-hidden="true">
        {typed}
        <span className={styles.caret} />
        <span className={styles.rest}>{rest}</span>
      </span>
    </p>
  );
}
