"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { train, type TrainSpot } from "@/lib/content";
import styles from "./TrainScene.module.css";

const WINDOW_X = [43, 195, 347, 499, 651, 803, 955, 1107];
const WINDOW_Y = 46;
const WINDOW_W = 130;
const WINDOW_H = 80;
const WINDOW_RADIUS = 8;
const CAR_RADIUS = 20;
const WHEEL_X = [150, 194, 618, 662, 1086, 1130];
const PLATFORM_Y = 296;
const ROOF_Y = 20;
const SCALE = { window: 0.76, roof: 0.78, platform: 0.9, lifted: 0.95 };
const LIFT = 56;
const CLIP_DELAY = 480;
const ARRIVAL = 2600;

type Zone = TrainSpot["zone"] | "drag";

type Cat = {
  zone: Zone;
  window: number | null;
  x: number;
  y: number;
  scale: number;
  clipped: boolean;
  home: TrainSpot;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function position(spot: TrainSpot): Pick<Cat, "zone" | "window" | "x" | "y" | "scale"> {
  if (spot.zone === "window") {
    const x = WINDOW_X[spot.window] + WINDOW_W / 2;
    return { zone: "window", window: spot.window, x, y: WINDOW_Y + WINDOW_H + 38 * SCALE.window + 2, scale: SCALE.window };
  }
  const y = spot.zone === "roof" ? ROOF_Y : PLATFORM_Y;
  return { zone: spot.zone, window: null, x: clamp(spot.x, 60, 1220), y, scale: SCALE[spot.zone] };
}

function startingCats(): Cat[] {
  return train.cats.map(({ start }) => ({ ...position(start), clipped: start.zone === "window", home: start }));
}

function describe(cat: Cat): string {
  if (cat.zone === "window" && cat.window !== null) return `in window ${cat.window + 1}`;
  if (cat.zone === "roof") return "on the roof";
  return "on the platform";
}

export function TrainScene() {
  const [cats, setCats] = useState(startingCats);
  const [order, setOrder] = useState(() => train.cats.map((_, i) => i));
  const [dragging, setDragging] = useState<number | null>(null);
  const [dropWindow, setDropWindow] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [missing, setMissing] = useState<boolean[]>(() => train.cats.map(() => false));
  const [message, setMessage] = useState("");
  const [inView, setInView] = useState(false);
  const [arriving, setArriving] = useState(true);

  const svgRef = useRef<SVGSVGElement>(null);
  const trainRef = useRef<SVGGElement>(null);
  const wobbleRefs = useRef<(SVGGElement | null)[]>([]);
  const timers = useRef<number[]>([]);
  const reducedMotion = useRef(false);
  const drag = useRef<{
    cat: number;
    pointerId: number;
    toScene: DOMMatrix;
    startX: number;
    startY: number;
    moved: boolean;
    frame: number;
    latest: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    reducedMotion.current = query.matches;
    const onChange = (event: MediaQueryListEvent) => (reducedMotion.current = event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    train.cats.forEach((cat, i) => {
      const image = new Image();
      image.onerror = () => setMissing((current) => current.map((value, j) => (j === i ? true : value)));
      image.src = cat.file;
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (!("IntersectionObserver" in window)) {
      queueMicrotask(() => setInView(true));
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setTimeout(() => setArriving(false), ARRIVAL + 100);
    return () => window.clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onTouch = (event: TouchEvent) => {
      if (drag.current || (event.target as Element).closest?.("[data-cat]")) event.preventDefault();
    };
    svg.addEventListener("touchstart", onTouch, { passive: false });
    svg.addEventListener("touchmove", onTouch, { passive: false });
    return () => {
      svg.removeEventListener("touchstart", onTouch);
      svg.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const updateCat = (index: number, patch: Partial<Cat>) =>
    setCats((current) => current.map((cat, i) => (i === index ? { ...cat, ...patch } : cat)));

  const isTaken = (slot: number, except: number) =>
    cats.some((cat, i) => i !== except && cat.zone === "window" && cat.window === slot);

  const moveTo = (index: number, spot: TrainSpot) => {
    const animate = !reducedMotion.current;
    updateCat(index, { ...position(spot), clipped: spot.zone === "window" && !animate, home: spot });
    if (spot.zone === "window" && animate) {
      const timer = window.setTimeout(() => {
        setCats((current) =>
          current.map((cat, i) =>
            i === index && cat.zone === "window" && cat.window === spot.window ? { ...cat, clipped: true } : cat,
          ),
        );
      }, CLIP_DELAY);
      timers.current.push(timer);
    }
    const name = train.cats[index].name;
    setMessage(
      spot.zone === "window" ? `${name} is in window ${spot.window + 1}.` : `${name} is on the ${spot.zone}.`,
    );
    if (spot.zone === "window") bump();
  };

  const wiggle = (index: number) => {
    if (reducedMotion.current) return;
    wobbleRefs.current[index]?.animate?.(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(-9deg)", offset: 0.25 },
        { transform: "rotate(8deg)", offset: 0.55 },
        { transform: "rotate(-4deg)", offset: 0.8 },
        { transform: "rotate(0deg)" },
      ],
      { duration: 550, easing: "ease-in-out" },
    );
  };

  const bump = () => {
    if (reducedMotion.current) return;
    trainRef.current?.animate?.(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-3px)", offset: 0.3 },
        { transform: "translateY(2px)", offset: 0.6 },
        { transform: "translateY(0)" },
      ],
      { duration: 500, easing: "ease-in-out" },
    );
  };

  const sceneMatrix = () => svgRef.current?.getScreenCTM()?.inverse() ?? new DOMMatrix();

  const toScene = (event: PointerEvent, matrix: DOMMatrix = sceneMatrix()) => {
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
    return { x: point.x, y: point.y };
  };

  const windowAt = (point: { x: number; y: number }, except: number) => {
    if (point.y < 30 || point.y > 150) return null;
    let best: number | null = null;
    let bestDistance = 80;
    WINDOW_X.forEach((x, i) => {
      const distance = Math.abs(point.x - (x + WINDOW_W / 2));
      if (distance < bestDistance && !isTaken(i, except)) {
        best = i;
        bestDistance = distance;
      }
    });
    return best;
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    const node = (event.target as Element).closest<SVGElement>("[data-cat]");
    if (!node) return;
    const index = Number(node.dataset.cat);
    event.preventDefault();
    const matrix = sceneMatrix();
    const point = toScene(event, matrix);
    drag.current = {
      cat: index,
      pointerId: event.pointerId,
      toScene: matrix,
      startX: point.x,
      startY: point.y,
      moved: false,
      frame: 0,
      latest: point,
    };
    setDragging(index);
    setOrder((current) => [...current.filter((i) => i !== index), index]);
    updateCat(index, { zone: "drag", window: null, clipped: false, x: point.x, y: point.y + LIFT, scale: SCALE.lifted });
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const current = drag.current;
    if (!current || event.pointerId !== current.pointerId) return;
    const point = toScene(event, current.toScene);
    if (Math.abs(point.x - current.startX) + Math.abs(point.y - current.startY) > 6) current.moved = true;
    current.latest = point;
    if (current.frame) return;
    current.frame = window.requestAnimationFrame(() => {
      current.frame = 0;
      const { x, y } = current.latest;
      updateCat(current.cat, { x: clamp(x, 20, 1260), y: clamp(y + LIFT, -60, 330) });
      setDropWindow(windowAt(current.latest, current.cat));
    });
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const current = drag.current;
    if (!current || event.pointerId !== current.pointerId) return;
    window.cancelAnimationFrame(current.frame);
    drag.current = null;
    setDragging(null);
    setDropWindow(null);
    const index = current.cat;

    if (!current.moved) {
      const home = cats[index].home;
      const backTo: TrainSpot =
        home.zone === "window" && isTaken(home.window, index)
          ? { zone: "platform", x: WINDOW_X[home.window] + WINDOW_W / 2 }
          : home;
      moveTo(index, backTo);
      wiggle(index);
      return;
    }

    const point = toScene(event, current.toScene);
    const slot = windowAt(point, index);
    if (slot !== null) moveTo(index, { zone: "window", window: slot });
    else if (point.y < 28) moveTo(index, { zone: "roof", x: point.x });
    else moveTo(index, { zone: "platform", x: point.x });
  };

  const onKeyDown = (index: number) => (event: KeyboardEvent<SVGGElement>) => {
    const cat = cats[index];
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      wiggle(index);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveTo(index, { zone: "roof", x: cat.x });
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveTo(index, { zone: "platform", x: cat.x });
      return;
    }
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();

    const step = event.key === "ArrowRight" ? 1 : -1;
    let from: number;
    if (cat.zone === "window" && cat.window !== null) {
      from = cat.window;
    } else {
      from = WINDOW_X.filter((x) => x + WINDOW_W / 2 < cat.x).length - 1;
      if (step < 0) from += 1;
    }
    let next = from + step;
    while (next >= 0 && next < WINDOW_X.length && isTaken(next, index)) next += step;
    if (next >= 0 && next < WINDOW_X.length) moveTo(index, { zone: "window", window: next });
  };

  const focusedWindow = focused !== null && cats[focused].zone === "window" ? cats[focused].window : null;
  const highlighted = dropWindow ?? focusedWindow;

  return (
    <div className={`${styles.scene} ${inView ? styles.rolling : ""}`}>
      <div className={styles.scroller}>
        <svg
          ref={svgRef}
          className={styles.svg}
          viewBox="0 -90 1280 400"
          role="group"
          aria-label="A subway train with cats you can move around"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <defs>
            <clipPath id="train-car">
              <rect x={10} y={20} width={1260} height={172} rx={CAR_RADIUS} />
            </clipPath>
            {WINDOW_X.map((x, i) => (
              <clipPath key={x} id={`train-window-${i}`}>
                <rect x={x - 6} y={-90} width={WINDOW_W + 12} height={WINDOW_Y + WINDOW_H + 90} />
              </clipPath>
            ))}
          </defs>

          <g aria-hidden="true">
            <rect className={styles.platform} x={0} y={240} width={1280} height={70} />
            <line className={styles.ink} x1={0} y1={240} x2={1280} y2={240} strokeWidth={6} />
            <g className={arriving ? styles.arrive : undefined}>
              <g ref={trainRef}>
                <rect className={styles.car} x={10} y={20} width={1260} height={172} rx={CAR_RADIUS} />
                <g clipPath="url(#train-car)">
                  <rect className={styles.stripe} x={10} y={28} width={1260} height={10} />
                  <rect className={styles.underframe} x={10} y={176} width={1260} height={16} />
                </g>
                <rect className={styles.carOutline} x={10} y={20} width={1260} height={172} rx={CAR_RADIUS} strokeWidth={3} />
                {WINDOW_X.map((x, i) => (
                  <rect
                    key={x}
                    className={styles.glass}
                    data-window={i}
                    x={x}
                    y={WINDOW_Y}
                    width={WINDOW_W}
                    height={WINDOW_H}
                    rx={WINDOW_RADIUS}
                  />
                ))}
                {WHEEL_X.map((x) => (
                  <g key={x}>
                    <circle className={styles.wheel} cx={x} cy={206} r={16} />
                    <circle className={styles.hub} cx={x} cy={206} r={5} />
                  </g>
                ))}
              </g>
            </g>
          </g>

          <g>
            {order.map((index) => {
              const cat = cats[index];
              const { name, file, start } = train.cats[index];
              const ridesIn = arriving && start.zone !== "platform";
              return (
                <g
                  key={name}
                  className={ridesIn ? styles.arrive : undefined}
                  clipPath={cat.clipped && cat.window !== null ? `url(#train-window-${cat.window})` : undefined}
                >
                  <g
                    data-cat={index}
                    className={`${styles.cat} ${dragging === index ? styles.dragging : ""}`}
                    style={{ transform: `translate(${cat.x}px, ${cat.y}px) scale(${cat.scale})` }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${name} the cat, ${describe(cat)}. Drag, or use the arrow keys to move.`}
                    onKeyDown={onKeyDown(index)}
                    onFocus={() => setFocused(index)}
                    onBlur={() => setFocused(null)}
                  >
                    <g
                      ref={(node) => {
                        wobbleRefs.current[index] = node;
                      }}
                    >
                      <g transform="translate(-60 -136)">
                        {missing[index] ? (
                          <g className={styles.standIn}>
                            <rect x={12} y={44} width={100} height={92} strokeWidth={3} />
                            <text x={62} y={96} textAnchor="middle">
                              {name}
                            </text>
                          </g>
                        ) : (
                          <image href={file} x={0} y={10} width={130} height={135} />
                        )}
                        <g className={styles.focusRing}>
                          <rect x={-6} y={4} width={142} height={146} strokeWidth={8} />
                          <rect x={-6} y={4} width={142} height={146} strokeWidth={4} />
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              );
            })}
          </g>

          <g aria-hidden="true" pointerEvents="none" className={arriving ? styles.arrive : undefined}>
            {WINDOW_X.map((x) => (
              <g key={x}>
                <rect
                  className={styles.frame}
                  x={x}
                  y={WINDOW_Y}
                  width={WINDOW_W}
                  height={WINDOW_H}
                  rx={WINDOW_RADIUS}
                  strokeWidth={3}
                />
                <rect className={styles.sill} x={x - 5} y={WINDOW_Y + WINDOW_H} width={WINDOW_W + 10} height={8} strokeWidth={2.5} />
              </g>
            ))}
            {highlighted !== null && (
              <rect
                className={styles.highlight}
                x={WINDOW_X[highlighted] - 4}
                y={WINDOW_Y - 4}
                width={WINDOW_W + 8}
                height={WINDOW_H + 8}
                rx={WINDOW_RADIUS + 4}
                strokeWidth={5}
              />
            )}
          </g>
        </svg>
      </div>

      <p className={`container ${styles.caption}`} aria-hidden="true">
        {train.caption}
      </p>
      <p role="status" className="visually-hidden">
        {message}
      </p>
    </div>
  );
}
