"use client";

import { useEffect, useRef } from "react";

type Props = { src: string; poster?: string; className?: string };

export function LoopingVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => void video.play()?.catch(() => {});
    if (!("IntersectionObserver" in window)) {
      play();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : video.pause()));
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
