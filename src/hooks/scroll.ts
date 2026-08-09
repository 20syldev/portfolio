"use client";

import Lenis from "lenis";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import {
    Axis,
    clamp,
    currentTranslate,
    findTouch,
    findVerticalScroll,
    hasHorizontalScroll,
    isDiscreteWheel,
    ownsGesture,
    prefersNoMotion,
    rubberBand,
    settleDuration,
    tuning,
} from "@/lib/gesture";

interface ScrollState {
    currentTab: number;
    currentSection: number;
}

interface UseScrollOptions {
    totalTabs: number;
    sections?: number;
    threshold?: number;
    scrollDuration?: number;
    initialTab?: number;
}

// Who drives the gesture, latched once and never flipped mid gesture
type DragMode = "native" | "tab" | "section";

interface DragState {
    source: "touch" | "wheel";
    id: number; // Touch identifier, -1 for wheel
    target: Element | null; // Where the gesture started, for the scroll handoff
    startX: number;
    startY: number;
    axis: Axis | null;
    mode: DragMode | null;
    el: HTMLElement | null; // Element being translated
    lockDelta: number; // Travel already made when the axis locked (px)
    base: number; // Index the gesture started from
    count: number; // Number of indexes on the locked axis
    page: number; // Size of one page on the locked axis (px)
    startOffset: number; // Translation when the axis locked (px)
    delta: number; // Travel since the lock (px)
    offset: number; // Current damped translation (px)
    velocity: number; // Smoothed velocity on the locked axis (px/ms)
    lastTime: number;
    hasHorizontalScroll: boolean;
    moved: boolean; // True once the DOM moved, to swallow the synthetic click
}

/**
 * Hook for tab and section-based scroll navigation.
 * Touch and trackpad gestures follow the finger one to one, with rubber
 * band resistance at the edges; a notched mouse wheel and the keyboard
 * keep moving one page at a time.
 *
 * @param options - Scroll configuration options
 * @param options.totalTabs - Total number of navigable tabs
 * @param options.sections - Number of sections in the first tab (default: 1)
 * @param options.threshold - Minimum notched wheel delta to navigate (default: 50)
 * @param options.scrollDuration - Duration of programmatic scroll animation in ms (default: 600)
 * @param options.initialTab - Initial active tab index (default: 0)
 * @returns Scroll state, element refs and navigation methods
 */
export function useScroll({
    totalTabs,
    sections = 1,
    threshold = 50,
    scrollDuration = 600,
    initialTab = 0,
}: UseScrollOptions) {
    const getSectionsForTab = useCallback((tab: number) => (tab === 0 ? sections : 1), [sections]);
    const [state, setState] = useState<ScrollState>({
        currentTab: initialTab,
        currentSection: 0,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const tabsRef = useRef<HTMLDivElement>(null);
    const sectionsRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<DragState | null>(null);
    const frameRef = useRef<number | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clickGuardRef = useRef(Number.NEGATIVE_INFINITY);
    const isScrollingRef = useRef(false);
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const [initialStyles] = useState<{ tabs: CSSProperties; sections: CSSProperties }>(() => ({
        tabs: { transform: `translate3d(-${initialTab * 100}vw, 0, 0)` },
        sections: { transform: "translate3d(0, 0, 0)" },
    }));

    const applyBase = useCallback((tab: number, section: number) => {
        if (tabsRef.current) {
            tabsRef.current.style.transform = `translate3d(-${tab * 100}vw, 0, 0)`;
        }
        if (sectionsRef.current) {
            sectionsRef.current.style.transform = `translate3d(0, -${section * 100}dvh, 0)`;
        }
    }, []);

    const commit = useCallback(
        (tab: number, section: number, duration: number) => {
            const clampedTab = clamp(tab, 0, totalTabs - 1);
            const clampedSection = clamp(section, 0, getSectionsForTab(clampedTab) - 1);

            const ms = `${duration}ms`;
            if (tabsRef.current) tabsRef.current.style.transitionDuration = ms;
            if (sectionsRef.current) sectionsRef.current.style.transitionDuration = ms;

            containerRef.current?.classList.add("snap-moving");

            // Not from an effect, so the transition starts in the same tick
            applyBase(clampedTab, clampedSection);
            isScrollingRef.current = true;
            setState({ currentTab: clampedTab, currentSection: clampedSection });

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                scrollTimeoutRef.current = null;
                isScrollingRef.current = false;
                containerRef.current?.classList.remove("snap-moving");

                if (tabsRef.current) tabsRef.current.style.transitionDuration = "";
                if (sectionsRef.current) sectionsRef.current.style.transitionDuration = "";
            }, duration);
        },
        [totalTabs, getSectionsForTab, applyBase]
    );

    const scrollTo = useCallback(
        (tab: number, section: number) => {
            if (isScrollingRef.current) return;
            commit(tab, section, prefersNoMotion() ? 0 : scrollDuration);
        },
        [commit, scrollDuration]
    );

    const goToTab = useCallback(
        (tab: number) => {
            scrollTo(tab, 0);
        },
        [scrollTo]
    );

    const goToSection = useCallback(
        (section: number) => {
            scrollTo(stateRef.current.currentTab, section);
        },
        [scrollTo]
    );

    const nextSection = useCallback(() => {
        const { currentTab, currentSection } = stateRef.current;
        const maxSection = getSectionsForTab(currentTab) - 1;
        if (currentSection < maxSection) {
            scrollTo(currentTab, currentSection + 1);
        }
    }, [scrollTo, getSectionsForTab]);

    const prevSection = useCallback(() => {
        const { currentTab, currentSection } = stateRef.current;
        if (currentSection > 0) {
            scrollTo(currentTab, currentSection - 1);
        }
    }, [scrollTo]);

    const nextTab = useCallback(() => {
        const { currentTab } = stateRef.current;
        if (currentTab < totalTabs - 1) {
            scrollTo(currentTab + 1, 0);
        }
    }, [scrollTo, totalTabs]);

    const prevTab = useCallback(() => {
        const { currentTab } = stateRef.current;
        if (currentTab > 0) {
            scrollTo(currentTab - 1, 0);
        }
    }, [scrollTo]);

    const navRef = useRef({ commit, nextTab, prevTab, nextSection, prevSection });
    useEffect(() => {
        navRef.current = { commit, nextTab, prevTab, nextSection, prevSection };
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const cancelFrame = () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };

        const write = (drag: DragState) => {
            if (!drag.el) return;
            drag.el.style.transform =
                drag.axis === "x"
                    ? `translate3d(${drag.offset}px, 0, 0)`
                    : `translate3d(0, ${drag.offset}px, 0)`;
        };

        const flush = () => {
            frameRef.current = null;
            const drag = dragRef.current;
            if (drag) write(drag);
        };

        const schedule = () => {
            if (frameRef.current === null) frameRef.current = requestAnimationFrame(flush);
        };

        const isActive = (drag: DragState | null): boolean =>
            !!drag && !!drag.el && (drag.mode === "tab" || drag.mode === "section");

        const finish = (drag: DragState, tab: number, section: number) => {
            cancelFrame();
            dragRef.current = null;
            if (drag.moved && drag.source === "touch") clickGuardRef.current = performance.now();

            const rest = drag.axis === "x" ? -tab * drag.page : -section * drag.page;
            const remaining = Math.abs(rest - drag.offset);
            const duration = prefersNoMotion() ? 0 : settleDuration(remaining, drag.page);

            drag.el?.classList.remove("snap-dragging");
            navRef.current.commit(tab, section, duration);
        };

        const abort = () => {
            const drag = dragRef.current;
            if (!drag) return;
            if (!isActive(drag)) {
                cancelFrame();
                dragRef.current = null;
                return;
            }

            const { currentTab, currentSection } = stateRef.current;
            if (drag.axis === "x") finish(drag, drag.base, currentSection);
            else finish(drag, currentTab, drag.base);
        };

        const lockAxis = (drag: DragState, deltaX: number, deltaY: number) => {
            const axis: Axis = Math.abs(deltaX) > Math.abs(deltaY) * tuning.axisBias ? "x" : "y";
            const { currentTab } = stateRef.current;

            drag.axis = axis;
            drag.lockDelta = drag.source === "touch" ? (axis === "x" ? deltaX : deltaY) : 0;

            if (axis === "x") {
                if (drag.hasHorizontalScroll) {
                    drag.mode = "native";
                    return;
                }
                drag.mode = "tab";
                drag.el = tabsRef.current;
                drag.count = totalTabs;
                drag.page = container.clientWidth;
            } else {
                if (getSectionsForTab(currentTab) <= 1) {
                    drag.mode = "native";
                    return;
                }

                if (findVerticalScroll(drag.target, container, deltaY < 0)) {
                    drag.mode = "native";
                    return;
                }
                drag.mode = "section";
                drag.el = sectionsRef.current;
                drag.count = getSectionsForTab(currentTab);
                drag.page = container.clientHeight;
            }

            if (!drag.el || drag.page <= 0) {
                drag.mode = "native";
                drag.el = null;
                return;
            }

            drag.startOffset = currentTranslate(drag.el, axis);
            drag.offset = drag.startOffset;
            drag.base = clamp(Math.round(-drag.startOffset / drag.page), 0, drag.count - 1);
            drag.el.classList.add("snap-dragging");
            write(drag);

            container.classList.add("snap-moving");

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = null;
                isScrollingRef.current = false;
            }
        };

        const track = (drag: DragState, delta: number) => {
            const now = performance.now();
            const dt = now - drag.lastTime;
            if (dt <= 0) return;
            const instant = (delta - drag.delta) / dt;
            drag.velocity = dt > tuning.flickIdle ? instant : drag.velocity * 0.7 + instant * 0.3;
            drag.lastTime = now;
        };

        const applyDelta = (drag: DragState, delta: number) => {
            const raw = drag.startOffset + delta;
            const min = -clamp(drag.base + 1, 0, drag.count - 1) * drag.page;
            const max = -clamp(drag.base - 1, 0, drag.count - 1) * drag.page;

            drag.delta = delta;
            drag.offset =
                raw > max
                    ? max + rubberBand(raw - max, drag.page)
                    : raw < min
                      ? min + rubberBand(raw - min, drag.page)
                      : raw;
            drag.moved = true;
            schedule();
        };

        const release = (drag: DragState) => {
            const { currentTab, currentSection } = stateRef.current;
            const idle = performance.now() - drag.lastTime > tuning.flickIdle;
            const velocity = idle ? 0 : drag.velocity;
            const dist = drag.offset + drag.base * drag.page;

            const flick =
                Math.abs(velocity) > tuning.flickVelocity &&
                Math.abs(dist) > tuning.flickDistance &&
                Math.sign(velocity) === Math.sign(dist);
            const ratio = drag.source === "touch" ? tuning.commitRatio : tuning.wheel.commitRatio;
            const dragged = Math.abs(dist) > drag.page * ratio;

            let target = drag.base;
            if (flick || dragged) target = drag.base + (dist < 0 ? 1 : -1);
            target = clamp(target, 0, drag.count - 1);

            if (drag.axis === "x") {
                // Changing tab resets the section, same as nextTab/prevTab
                finish(drag, target, target === drag.base ? currentSection : 0);
            } else {
                finish(drag, currentTab, target);
            }
        };

        const start = (
            source: DragState["source"],
            id: number,
            target: Element | null
        ): DragState =>
            ({
                source,
                id,
                target,
                startX: 0,
                startY: 0,
                axis: null,
                mode: null,
                el: null,
                lockDelta: 0,
                base: 0,
                count: 0,
                page: 0,
                startOffset: 0,
                delta: 0,
                offset: 0,
                velocity: 0,
                lastTime: performance.now(),
                hasHorizontalScroll: hasHorizontalScroll(target, container),
                moved: false,
            }) satisfies DragState;

        const handleTouchStart = (e: TouchEvent) => {
            if (document.body.classList.contains("hole-active")) return;

            // A second finger means pinch or zoom, hand the gesture back
            if (e.touches.length > 1) {
                abort();
                return;
            }

            // The draggable logo and friends drive their own gesture
            if (ownsGesture(e.target as Element, container)) return;

            const touch = e.touches[0];
            const drag = start("touch", touch.identifier, e.target as Element);
            drag.startX = touch.clientX;
            drag.startY = touch.clientY;
            dragRef.current = drag;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const drag = dragRef.current;
            if (!drag || drag.source !== "touch") return;
            if (document.body.classList.contains("hole-active") || e.touches.length > 1) {
                abort();
                return;
            }

            const touch = findTouch(e.touches, drag.id);
            if (!touch) return;

            const deltaX = touch.clientX - drag.startX;
            const deltaY = touch.clientY - drag.startY;

            if (!drag.axis) {
                if (
                    Math.abs(deltaX) < tuning.directionLock &&
                    Math.abs(deltaY) < tuning.directionLock
                )
                    return;
                lockAxis(drag, deltaX, deltaY);
            }

            // Latched to an inner scroller: never hijack, never preventDefault
            if (!isActive(drag)) return;
            if (e.cancelable) e.preventDefault();

            const delta = (drag.axis === "x" ? deltaX : deltaY) - drag.lockDelta;
            track(drag, delta);
            applyDelta(drag, delta);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const drag = dragRef.current;
            if (!drag || drag.source !== "touch") return;
            if (!findTouch(e.changedTouches, drag.id)) return;

            if (!isActive(drag)) {
                dragRef.current = null;
                return;
            }
            release(drag);
        };

        const handleTouchCancel = () => abort();

        const endWheelGesture = () => {
            wheelTimeoutRef.current = null;
            const drag = dragRef.current;
            if (!drag || drag.source !== "wheel") return;
            if (isActive(drag)) release(drag);
            else dragRef.current = null;
        };

        const restartWheelIdle = () => {
            if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
            wheelTimeoutRef.current = setTimeout(endWheelGesture, tuning.wheel.idle);
        };

        const handleNotch = (e: WheelEvent) => {
            const { currentTab } = stateRef.current;
            if (isScrollingRef.current) {
                e.preventDefault();
                return;
            }

            const absX = Math.abs(e.deltaX);
            const absY = Math.abs(e.deltaY);
            const target = e.target as Element;
            const nav = navRef.current;

            if (absX > absY * 1.5 && absX > threshold) {
                if (hasHorizontalScroll(target, container)) return;

                e.preventDefault();
                if (e.deltaX > 0) nav.nextTab();
                else nav.prevTab();
            } else if (absY > absX * 1.5 && absY > threshold) {
                if (getSectionsForTab(currentTab) <= 1) return;
                if (findVerticalScroll(target, container, e.deltaY > 0)) return;

                e.preventDefault();
                if (e.deltaY > 0) nav.nextSection();
                else nav.prevSection();
            }
        };

        const handlePan = (e: WheelEvent) => {
            let drag = dragRef.current;

            if (!drag) {
                drag = start("wheel", -1, e.target as Element);
                dragRef.current = drag;
            }

            if (!drag.axis) {
                // Accumulate first, so one tiny event cannot lock the axis
                drag.startX -= e.deltaX;
                drag.startY -= e.deltaY;
                if (
                    Math.abs(drag.startX) < tuning.wheel.lock &&
                    Math.abs(drag.startY) < tuning.wheel.lock
                ) {
                    return;
                }
                lockAxis(drag, drag.startX, drag.startY);
            }

            if (!isActive(drag)) return;
            e.preventDefault();

            const delta = drag.delta + (drag.axis === "x" ? -e.deltaX : -e.deltaY);
            track(drag, delta);
            applyDelta(drag, delta);
        };

        const handleWheel = (e: WheelEvent) => {
            const drag = dragRef.current;
            if (drag?.source === "touch") return;

            if (document.body.classList.contains("hole-active")) {
                e.preventDefault();
                return;
            }

            restartWheelIdle();

            if (!drag && isDiscreteWheel(e)) handleNotch(e);
            else handlePan(e);
        };

        const handleClick = (e: MouseEvent) => {
            if (performance.now() - clickGuardRef.current < tuning.clickGuard) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("touchend", handleTouchEnd, { passive: true });
        container.addEventListener("touchcancel", handleTouchCancel, { passive: true });
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("click", handleClick, true);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
            container.removeEventListener("touchcancel", handleTouchCancel);
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("click", handleClick, true);

            cancelFrame();
            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
                wheelTimeoutRef.current = null;
            }
            dragRef.current?.el?.classList.remove("snap-dragging");
            dragRef.current = null;
            container.classList.remove("snap-moving");
        };
    }, [getSectionsForTab, threshold, totalTabs]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                isScrollingRef.current ||
                dragRef.current ||
                e.altKey ||
                document.querySelector("[role='dialog']") ||
                document.body.classList.contains("hole-active")
            )
                return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    nextSection();
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    prevSection();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    nextTab();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    prevTab();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextSection, prevSection, nextTab, prevTab]);

    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    return {
        containerRef,
        tabsRef,
        sectionsRef,
        tabsStyle: initialStyles.tabs,
        sectionsStyle: initialStyles.sections,
        currentTab: state.currentTab,
        currentSection: state.currentSection,
        goToTab,
        goToSection,
        nextSection,
        prevSection,
        nextTab,
        prevTab,
    };
}

interface UseSmoothScrollOptions {
    enabled?: boolean;
    delayed?: boolean;
    delayDuration?: number;
}

/**
 * Hook that adds Lenis smooth scrolling to a container element.
 * Supports both immediate and delayed initialization modes.
 *
 * @param options - Configuration options
 * @param options.enabled - Whether smooth scrolling is active (default: true)
 * @param options.delayed - Delay initialization for animated elements (default: false)
 * @param options.delayDuration - Delay duration in ms when delayed is true (default: 250)
 * @returns Object containing the container ref and scrollTo function
 */
export function useSmoothScroll<T extends HTMLElement>({
    enabled = true,
    delayed = false,
    delayDuration = 250,
}: UseSmoothScrollOptions = {}) {
    const containerRef = useRef<T>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const observerRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        if (!enabled) {
            // Cleanup when disabled
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            observerRef.current?.disconnect();
            observerRef.current = null;
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            return;
        }

        const initializeLenis = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const content = container.firstElementChild as HTMLElement | null;

            if (!content) return;

            lenisRef.current = new Lenis({
                wrapper: container,
                content: content,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                touchMultiplier: 2,
                infinite: false,
                smoothWheel: true,
                syncTouch: !delayed,
                overscroll: delayed ? false : undefined,
            });

            function raf(time: number) {
                lenisRef.current?.raf(time);
                rafIdRef.current = requestAnimationFrame(raf);
            }

            rafIdRef.current = requestAnimationFrame(raf);

            // Reading scrollHeight in the frame loop forced a layout per frame
            let firstObservation = true;
            observerRef.current = new ResizeObserver(() => {
                // Always fires on observe, and Lenis has just measured itself
                if (firstObservation) {
                    firstObservation = false;
                    return;
                }
                lenisRef.current?.resize();
            });
            observerRef.current.observe(container);
            observerRef.current.observe(content);
        };

        // Delay initialization if delayed mode is enabled
        const timeoutId = delayed ? setTimeout(initializeLenis, delayDuration) : null;

        if (!delayed) {
            initializeLenis();
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            observerRef.current?.disconnect();
            observerRef.current = null;
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, [enabled, delayed, delayDuration]);

    const scrollTo = useCallback((target: string | HTMLElement, offset = 0) => {
        lenisRef.current?.scrollTo(target, { offset });
    }, []);

    return { scrollRef: containerRef, scrollTo };
}

/**
 * Hook for drag-to-scroll functionality on carousels.
 * Enables mouse drag scrolling with grab cursor.
 * On touch devices, prevents vertical page scroll while swiping the carousel horizontally.
 *
 * @param ref - Ref to the scrollable element.
 * @param snap - Whether to snap to items on mouse release (default: true, for carousels).
 */
export function useDragScroll<T extends HTMLElement>(ref: React.RefObject<T | null>, snap = true) {
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollStart = useRef(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            startX.current = e.pageX;
            scrollStart.current = el.scrollLeft;
            el.style.cursor = "grabbing";
            el.style.userSelect = "none";
            if (snap) el.style.scrollSnapType = "none";
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const delta = e.pageX - startX.current;
            el.scrollLeft = scrollStart.current - delta;
        };

        const handleMouseUp = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            el.style.cursor = "grab";
            el.style.userSelect = "";

            if (snap) {
                const itemWidth = el.offsetWidth;
                const targetIndex = Math.round(el.scrollLeft / itemWidth);
                el.scrollTo({ left: targetIndex * itemWidth, behavior: "smooth" });

                setTimeout(() => {
                    el.style.scrollSnapType = "";
                }, 300);
            }
        };

        let touchStartX = 0;
        let touchStartY = 0;
        let touchDirection: "x" | "y" | null = null;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchDirection = null;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const dx = Math.abs(touch.clientX - touchStartX);
            const dy = Math.abs(touch.clientY - touchStartY);

            if (!touchDirection && (dx > 10 || dy > 10)) {
                touchDirection = dx > dy ? "x" : "y";
            }

            if (touchDirection === "x") {
                e.stopPropagation();
            }
        };

        const updateOverflowState = () => {
            const overflows = el.scrollWidth > el.clientWidth;
            if (overflows) {
                el.style.cursor = "grab";
                el.style.touchAction = "pan-x";
                el.addEventListener("mousedown", handleMouseDown);
                el.addEventListener("touchstart", handleTouchStart, { passive: true });
                el.addEventListener("touchmove", handleTouchMove, { passive: true });
                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
            } else {
                el.style.cursor = "";
                el.style.touchAction = "";
                el.removeEventListener("mousedown", handleMouseDown);
                el.removeEventListener("touchstart", handleTouchStart);
                el.removeEventListener("touchmove", handleTouchMove);
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            }
        };

        updateOverflowState();
        const observer = new ResizeObserver(updateOverflowState);
        observer.observe(el);

        return () => {
            observer.disconnect();
            el.removeEventListener("mousedown", handleMouseDown);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [ref, snap]);
}