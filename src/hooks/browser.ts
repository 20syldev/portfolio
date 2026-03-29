"use client";

import { useEffect, useRef, useState } from "react";

export interface BrowserStats {
    apiLatency: number | null;
    pageLoadTime: number | null;
    ttfb: number | null;
    fps: number | null;
    domNodes: number | null;
    jsHeapMB: number | null;
}

const tickMs = 2_000;
const latencyMs = 10_000;

/**
 * Collects live browser performance metrics and refreshes them in real-time.
 *
 * @returns Browser stats and loading state
 */
export function useBrowserStats(): { browserStats: BrowserStats | null; loading: boolean } {
    const [browserStats, setBrowserStats] = useState<BrowserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const fpsRef = useRef<number | null>(null);

    // FPS counter via requestAnimationFrame
    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let rafId: number;

        function tick(now: number) {
            frameCount++;
            const delta = now - lastTime;
            if (delta >= 1000) {
                fpsRef.current = Math.round((frameCount * 1000) / delta);
                frameCount = 0;
                lastTime = now;
            }
            rafId = requestAnimationFrame(tick);
        }

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    useEffect(() => {
        let latencyTimer: ReturnType<typeof setInterval>;
        let tickTimer: ReturnType<typeof setInterval>;

        async function measureLatency(): Promise<number | null> {
            try {
                const start = performance.now();
                await fetch("https://api.sylvain.sh/health", {
                    cache: "no-store",
                });
                return Math.round(performance.now() - start);
            } catch {
                return null;
            }
        }

        function getNavTiming(): { pageLoadTime: number | null; ttfb: number | null } {
            const nav = performance.getEntriesByType("navigation")[0] as
                | PerformanceNavigationTiming
                | undefined;
            if (!nav) return { pageLoadTime: null, ttfb: null };
            return {
                pageLoadTime:
                    nav.loadEventEnd > 0 ? Math.round(nav.loadEventEnd - nav.startTime) : null,
                ttfb:
                    nav.responseStart > 0 ? Math.round(nav.responseStart - nav.requestStart) : null,
            };
        }

        function getDomNodes(): number {
            return document.querySelectorAll("*").length;
        }

        function getJsHeapMB(): number | null {
            const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
            return mem ? Math.round((mem.usedJSHeapSize / 1024 / 1024) * 10) / 10 : null;
        }

        function snapshot(apiLatency: number | null): BrowserStats {
            const { pageLoadTime, ttfb } = getNavTiming();
            return {
                apiLatency,
                pageLoadTime,
                ttfb,
                fps: fpsRef.current,
                domNodes: getDomNodes(),
                jsHeapMB: getJsHeapMB(),
            };
        }

        async function init() {
            const latency = await measureLatency();
            setBrowserStats(snapshot(latency));
            setLoading(false);

            // Refresh fast-changing metrics every 2s
            tickTimer = setInterval(() => {
                setBrowserStats((prev) =>
                    prev
                        ? {
                              ...prev,
                              fps: fpsRef.current,
                              domNodes: getDomNodes(),
                              jsHeapMB: getJsHeapMB(),
                          }
                        : prev
                );
            }, tickMs);

            // Re-measure API latency every 10s
            latencyTimer = setInterval(async () => {
                const lat = await measureLatency();
                setBrowserStats((prev) => (prev ? { ...prev, apiLatency: lat } : prev));
            }, latencyMs);
        }

        if (document.readyState === "complete") {
            init();
        } else {
            window.addEventListener("load", () => setTimeout(init, 100), { once: true });
        }

        return () => {
            clearInterval(tickTimer);
            clearInterval(latencyTimer);
        };
    }, []);

    return { browserStats, loading };
}