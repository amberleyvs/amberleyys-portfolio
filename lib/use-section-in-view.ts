"use client";

import { useEffect, useState } from "react";

export function useSectionInView(ids: string[], enabled: boolean): string | null {
  const [inView, setInView] = useState<string | null>(enabled ? ids[0] : null);
  const key = ids.join(" ");

  useEffect(() => {
    if (!enabled) return;
    const sectionIds = key.split(" ");
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sectionIds[sectionIds.length - 1];
      }
      setInView(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [key, enabled]);

  return enabled ? inView : null;
}
