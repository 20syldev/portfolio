"use client";

import { type RefObject, useEffect } from "react";

interface SparkleOptions {
    interval?: number;
    jitter?: number;
    minCount?: number;
    maxCount?: number;
}

const defaults = {
    interval: 3000, // Base delay between bursts (ms)
    jitter: 800, // Random variation on delay (±ms)
    minCount: 2, // Min particles per burst
    maxCount: 4, // Max particles per burst
};

/**
 * Spawns periodic 4-pointed star sparkles around a circular element.
 * Pauses while `isDragging` is true.
 */
export function useSparkle(
    containerRef: RefObject<HTMLDivElement | null>,
    isDragging: RefObject<boolean>,
    options?: SparkleOptions
) {
    const interval = options?.interval ?? defaults.interval;
    const jitter = options?.jitter ?? defaults.jitter;
    const minCount = options?.minCount ?? defaults.minCount;
    const maxCount = options?.maxCount ?? defaults.maxCount;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let timerId: ReturnType<typeof setTimeout>;

        const rand = (min: number, max: number) => min + Math.random() * (max - min);

        const spawnParticle = (cx: number, cy: number, radius: number) => {
            const angle = Math.random() * Math.PI * 2;
            const r = radius + rand(-8, 8);
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;

            const driftDist = rand(14, 24);
            const dx = Math.cos(angle) * driftDist;
            const dy = Math.sin(angle) * driftDist;
            const size = rand(8, 18);
            const duration = rand(600, 1000);
            const rotation = rand(-30, 30);
            const delay = rand(0, 200);

            const span = document.createElement("span");
            span.className = "animate-sparkle";
            span.style.left = `${px}px`;
            span.style.top = `${py}px`;
            span.style.setProperty("--sparkle-dx", `${dx}px`);
            span.style.setProperty("--sparkle-dy", `${dy}px`);
            span.style.setProperty("--sparkle-size", `${size}px`);
            span.style.setProperty("--sparkle-rot", `${rotation}deg`);
            span.style.animationDuration = `${duration}ms`;
            span.style.animationDelay = `${delay}ms`;

            el.appendChild(span);
            span.addEventListener("animationend", () => span.remove(), {
                once: true,
            });
        };

        const burst = () => {
            if (!isDragging.current && el && !document.body.classList.contains("no-motion")) {
                const w = el.offsetWidth;
                const h = el.offsetHeight;
                const cx = w / 2;
                const cy = h / 2;
                const radius = Math.min(w, h) / 2;
                const count = Math.round(rand(minCount, maxCount));

                for (let i = 0; i < count; i++) {
                    spawnParticle(cx, cy, radius);
                }
            }

            schedule();
        };

        const schedule = () => {
            const delay = interval + rand(-jitter, jitter);
            timerId = setTimeout(burst, delay);
        };

        schedule();

        return () => {
            clearTimeout(timerId);
            el.querySelectorAll(".animate-sparkle").forEach((s) => s.remove());
        };
    }, [containerRef, isDragging, interval, jitter, minCount, maxCount]);
}