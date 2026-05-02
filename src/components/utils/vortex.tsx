"use client";

import { ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

let cachedCollapseElements: HTMLElement[] | null = null;

/**
 * Collects visible elements for staggered animation.
 * Goes deep into the DOM to get individual visual blocks.
 */
function getVisibleElements(): HTMLElement[] {
    const container = document.querySelector(".snap-container");
    if (!container) return [];

    const els: HTMLElement[] = [];

    // Fixed overlays
    container.querySelectorAll<HTMLElement>(":scope > :not(.snap-tabs)").forEach((el) => {
        els.push(el);
    });

    // Content inside the currently visible section
    container.querySelectorAll<HTMLElement>(".snap-section").forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.querySelectorAll<HTMLElement>(":scope > *").forEach((child) => {
                if (child.children.length > 0 && child.children.length <= 10) {
                    Array.from(child.children).forEach((c) => els.push(c as HTMLElement));
                } else {
                    els.push(child);
                }
            });
        }
    });

    // Fixed/absolute elements outside snap-container
    document.body.querySelectorAll<HTMLElement>(":scope > *").forEach((el) => {
        if (el === container || el.tagName === "SCRIPT" || el.tagName === "NEXT-ROUTE-ANNOUNCER")
            return;
        const style = getComputedStyle(el);
        if (style.position === "fixed" || style.position === "absolute") {
            if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                els.push(el);
            }
        }
    });

    return els;
}

/**
 * Hole animation: container sucks toward singularity while elements fade out staggered.
 * The container transform-origin creates the visible epicenter — everything converges there.
 * Per-element opacity stagger adds visual rhythm on top.
 */
export async function collapseHole(targetRect: DOMRect): Promise<void> {
    const container = document.querySelector(".snap-container") as HTMLElement;
    if (!container) return;

    document.body.classList.add("hole-active");

    const cx = targetRect.left + targetRect.width / 2;
    const cy = targetRect.top + targetRect.height / 2;

    // Phase 1
    const elements = getVisibleElements();
    cachedCollapseElements = elements;
    const withDist = elements.map((el) => {
        const r = el.getBoundingClientRect();
        const ex = r.left + r.width / 2;
        const ey = r.top + r.height / 2;
        const dist = Math.sqrt((ex - cx) ** 2 + (ey - cy) ** 2);
        const originX = cx - r.left;
        const originY = cy - r.top;
        return { el, dist, originX, originY };
    });
    withDist.sort((a, b) => a.dist - b.dist);

    const maxDist = Math.max(...withDist.map((w) => w.dist), 1);
    const elementAnims: Animation[] = [];

    withDist.forEach(({ el, dist, originX, originY }) => {
        const delay = (dist / maxDist) * 1500;

        el.style.transformOrigin = `${originX}px ${originY}px`;

        const dir = dist % 2 < 1 ? 1 : -1;
        const anim = el.animate(
            [
                { opacity: 1, transform: "scale(1) rotate(0deg)", offset: 0 },
                { opacity: 0.9, transform: `scale(1.02) rotate(${dir * 2}deg)`, offset: 0.12 },
                { opacity: 0.5, transform: `scale(0.5) rotate(${dir * 8}deg)`, offset: 0.55 },
                { opacity: 0, transform: `scale(0) rotate(${dir * 15}deg)`, offset: 1 },
            ],
            {
                duration: 700,
                delay,
                easing: "ease-in",
                fill: "forwards",
            }
        );
        elementAnims.push(anim);
    });

    // Phase 2
    container.style.transformOrigin = `${cx}px ${cy}px`;
    const containerAnim = container.animate(
        [
            { transform: "scale(1) rotate(0deg)", offset: 0 },
            { transform: "scale(0.5) rotate(4deg)", offset: 0.4 },
            { transform: "scale(0) rotate(10deg)", offset: 1 },
        ],
        {
            duration: 800,
            delay: 1800,
            easing: "ease-in",
            fill: "forwards",
        }
    );

    try {
        await containerAnim.finished;
    } finally {
        elementAnims.forEach((a) => a.cancel());
    }
}

/**
 * Reset all hole state and pop elements back in with stagger.
 */
function reset() {
    document.body.classList.remove("hole-active");

    const container = document.querySelector(".snap-container") as HTMLElement;
    if (!container) return;

    container.getAnimations().forEach((a) => a.cancel());
    container.style.transform = "";
    container.style.opacity = "";
    container.style.transformOrigin = "";

    const elements = cachedCollapseElements ?? getVisibleElements();
    cachedCollapseElements = null;
    elements.forEach((el) => {
        el.getAnimations().forEach((a) => a.cancel());
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transformOrigin = "";
    });

    elements.forEach((el, i) => {
        const anim = el.animate(
            [
                { opacity: 0, transform: "scale(0.8)", offset: 0 },
                { opacity: 1, transform: "scale(1.04)", offset: 0.7 },
                { opacity: 1, transform: "scale(1)", offset: 1 },
            ],
            {
                duration: 350,
                delay: i * 50,
                easing: "ease-out",
                fill: "both",
            }
        );
        const cleanup = () => {
            anim.cancel();
            el.style.transform = "";
            el.style.opacity = "";
        };
        anim.finished.then(cleanup).catch(cleanup);
    });

    const maxDuration = elements.length * 50 + 450;
    setTimeout(() => {
        elements.forEach((el) => {
            el.getAnimations().forEach((a) => a.cancel());
            el.style.transform = "";
            el.style.opacity = "";
            el.style.transformOrigin = "";
        });
    }, maxDuration);
}

/**
 * Blob that grows from the singularity to fill the screen.
 * Color is the opposite of the current theme for maximum contrast.
 * Starts small, morphs shape while expanding, becomes the ResultScreen background.
 */
export function Vortex({
    cx,
    cy,
    theme,
    onExpanded,
}: {
    cx: number;
    cy: number;
    theme: string;
    onExpanded?: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const maxDist = Math.max(
            Math.hypot(cx, cy),
            Math.hypot(window.innerWidth - cx, cy),
            Math.hypot(cx, window.innerHeight - cy),
            Math.hypot(window.innerWidth - cx, window.innerHeight - cy)
        );
        const finalScale = (maxDist * 2) / 120;

        const anims: Animation[] = [];

        anims.push(
            el.animate(
                [
                    { transform: "translate(-50%, -50%) scale(0)", offset: 0 },
                    { transform: "translate(-50%, -50%) scale(0.8)", offset: 0.3 },
                    { transform: `translate(-50%, -50%) scale(${finalScale})`, offset: 1 },
                ],
                { duration: 2600, easing: "ease-in", fill: "forwards" }
            )
        );

        anims.push(
            el.animate(
                [
                    { borderRadius: "40% 60% 65% 35% / 55% 40% 60% 45%" },
                    { borderRadius: "55% 45% 38% 62% / 42% 58% 48% 52%" },
                    { borderRadius: "48% 52% 58% 42% / 62% 35% 65% 38%" },
                    { borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%" },
                ],
                { duration: 2600, easing: "ease-in-out", fill: "forwards" }
            )
        );

        anims[0].finished.then(() => onExpanded?.()).catch(() => {});

        return () => anims.forEach((a) => a.cancel());
    }, [cx, cy, onExpanded]);

    const bg = theme === "dark" ? "white" : "black";

    return createPortal(
        <div
            ref={ref}
            style={{
                position: "fixed",
                left: cx,
                top: cy,
                width: 120,
                height: 120,
                transform: "translate(-50%, -50%) scale(0)",
                borderRadius: "40% 60% 65% 35% / 55% 40% 60% 45%",
                background: bg,
                zIndex: 99,
                pointerEvents: "none",
            }}
        />,
        document.body
    );
}

/**
 * Full-screen result overlay shown after the hole animation.
 * Transparent during animation, then bg appears. 3s wait → "Bravo" → 2s → ThumbsUp.
 * Click to reverse the hole and fade out overlay.
 * Rendered via portal outside snap-container.
 */
export function Result({ theme, onReset }: { theme: string; onReset: () => void }) {
    const [phase, setPhase] = useState<"anim" | "wait" | "show" | "done" | "closing">("anim");
    const resettingRef = useRef(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    const bg = theme === "dark" ? "white" : "black";
    const fg = theme === "dark" ? "black" : "white";

    useEffect(() => {
        const t0 = setTimeout(() => setPhase("wait"), 2400);
        const t1 = setTimeout(() => setPhase("show"), 4500);
        const t2 = setTimeout(() => setPhase("done"), 6500);
        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    const handleClick = useCallback(() => {
        if (phase !== "show" && phase !== "done") return;
        if (resettingRef.current) return;
        resettingRef.current = true;
        setPhase("closing");

        const overlay = overlayRef.current;
        if (overlay) {
            overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 600,
                easing: "ease-out",
                fill: "forwards",
            });
        }

        onReset();
        reset();
    }, [onReset, phase]);

    const thumbWrapRef = useRef<HTMLDivElement>(null);
    const thumbIconRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (phase !== "done") return;
        const wrap = thumbWrapRef.current;
        const icon = thumbIconRef.current;
        if (!wrap || !icon) return;

        wrap.animate(
            [
                { maxWidth: "0px", marginLeft: "0px", opacity: 0 },
                { maxWidth: "2rem", marginLeft: "1rem", opacity: 1 },
            ],
            { duration: 400, easing: "ease-out", fill: "forwards" }
        );

        icon.animate(
            [
                { transform: "scale(0)", offset: 0 },
                { transform: "scale(1.12)", offset: 0.5 },
                { transform: "scale(0.95)", offset: 0.75 },
                { transform: "scale(1)", offset: 1 },
            ],
            { duration: 600, easing: "ease-out", fill: "forwards" }
        );
    }, [phase]);

    const showBg = phase !== "anim" && phase !== "closing";
    const clickable = phase === "show" || phase === "done";

    return createPortal(
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-500"
            style={{
                cursor: clickable ? "pointer" : "default",
                backgroundColor: showBg ? bg : undefined,
                color: fg,
            }}
            onClick={handleClick}
        >
            {(phase === "show" || phase === "done") && (
                <div className="flex items-center animate-fade-in" style={{ gap: 0 }}>
                    <p className="text-xl font-medium">Bravo</p>
                    <div
                        ref={thumbWrapRef}
                        className="overflow-hidden"
                        style={{ maxWidth: 0, opacity: 0 }}
                    >
                        <ThumbsUp
                            ref={thumbIconRef}
                            className="h-5 w-5"
                            style={{ transform: "scale(0)" }}
                            strokeWidth={2}
                        />
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
}