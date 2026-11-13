"use client";

import Lenis from "lenis";
import { CSSProperties, startTransition, useCallback, useEffect, useRef, useState } from "react";

import { useMotionEnabled } from "@/components/utils/motion";
import { Flight, flightSpeed, launchEase, translate } from "@/lib/flight";
import {
    Axis,
    clamp,
    currentTranslate,
    findTouch,
    findVerticalScroll,
    hasHorizontalScroll,
    isDiscreteWheel,
    isNewSwipe,
    ownsGesture,
    prefersNoMotion,
    rubberBand,
    settledEvent,
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
    initialTab?: number;
}

// Who drives the gesture, latched once and never flipped mid gesture
type DragMode = "native" | "tab" | "section";

// The two translated layers of the pager
type Layer = "tabs" | "sections";

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
 * What a gesture hands over to the settle of the layer it was dragging: the layer, the duration in
 * ms, the release velocity in px/ms and the translation at release in px. A missing field falls
 * back to the default of the situation.
 */
interface Motion {
    layer: Layer;
    duration?: number;
    velocity?: number;
    from?: number;
}

/**
 * Hook for tab and section-based scroll navigation.
 * Touch and trackpad gestures follow the fingers with rubber band resistance at the edges; a
 * notched mouse wheel and the keyboard move one page at a time.
 *
 * @param options - Scroll configuration options
 * @param options.totalTabs - Total number of navigable tabs
 * @param options.sections - Number of sections in the first tab (default: 1)
 * @param options.threshold - Minimum notched wheel delta to navigate (default: 50)
 * @param options.initialTab - Initial active tab index (default: 0)
 * @returns Scroll state, element refs and navigation methods
 */
export function useScroll({
    totalTabs,
    sections = 1,
    threshold = 50,
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
    const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clickGuardRef = useRef(Number.NEGATIVE_INFINITY);
    const targetRef = useRef({ tab: initialTab, section: 0 });
    const flightsRef = useRef<Record<Layer, Flight | null>>({ tabs: null, sections: null });
    const stepRef = useRef({ time: Number.NEGATIVE_INFINITY, dir: 0 });
    const pendingTabRef = useRef<number | null>(null);

    const [initialStyles] = useState<{ tabs: CSSProperties; sections: CSSProperties }>(() => ({
        tabs: { transform: `translate3d(-${initialTab * 100}vw, 0, 0)` },
        sections: { transform: "translate3d(0, 0, 0)" },
    }));

    const isFlying = useCallback(
        () => !!(flightsRef.current.tabs || flightsRef.current.sections),
        []
    );

    const settleMoving = useCallback(() => {
        const { tabs, sections: vertical } = flightsRef.current;
        if ((tabs && !tabs.done) || (vertical && !vertical.done)) return;
        if (dragRef.current?.el) return;
        containerRef.current?.classList.remove("snap-moving");
    }, []);

    const dropFlight = useCallback((layer: Layer) => {
        const flight = flightsRef.current[layer];
        if (!flight) return;

        if (flight.timer) clearTimeout(flight.timer);
        flight.anim.cancel();
        flightsRef.current[layer] = null;
    }, []);

    const layerEl = useCallback(
        (layer: Layer) => (layer === "tabs" ? tabsRef.current : sectionsRef.current),
        []
    );

    const grab = useCallback(
        (layer: Layer, axis: Axis) => {
            const flight = flightsRef.current[layer];
            const el = layerEl(layer);
            if (!flight || !el) return;

            const position = currentTranslate(el, axis);
            dropFlight(layer);
            el.style.transform = translate(axis, position);
        },
        [layerEl, dropFlight]
    );

    const settle = useCallback(
        (layer: Layer, index: number, previous: number, motion?: Motion): boolean => {
            const el = layerEl(layer);
            const container = containerRef.current;
            if (!el || !container) return false;

            const axis: Axis = layer === "tabs" ? "x" : "y";
            const page = axis === "x" ? container.clientWidth : container.clientHeight;
            const to = -index * page;
            const flight = flightsRef.current[layer];

            let from = motion?.from ?? -previous * page;
            let velocity = motion?.velocity;
            if (flight) {
                from = currentTranslate(el, axis);
                velocity = flightSpeed(flight);
                dropFlight(layer);
            }

            el.style.transform =
                axis === "x"
                    ? `translate3d(-${index * 100}vw, 0, 0)`
                    : `translate3d(0, -${index * 100}dvh, 0)`;

            const distance = Math.abs(to - from);
            const duration =
                motion?.duration ??
                (prefersNoMotion() ? 0 : flight ? settleDuration(distance, page) : tuning.duration);
            if (duration <= 0 || distance < 0.5) return false;

            const launch =
                velocity === undefined
                    ? (distance / duration) * tuning.keyStart
                    : velocity * Math.sign(to - from);
            const ease = launchEase(launch, duration, distance);
            const anim = el.animate(
                [{ transform: translate(axis, from) }, { transform: translate(axis, to) }],
                { duration, easing: `cubic-bezier(${ease.join(", ")})` }
            );

            const next: Flight = { anim, from, to, duration, ease, done: false, timer: null };
            flightsRef.current[layer] = next;
            next.timer = setTimeout(() => {
                if (flightsRef.current[layer] !== next) return;
                next.done = true;
                settleMoving();
            }, duration * tuning.visualEnd);
            anim.onfinish = () => {
                if (flightsRef.current[layer] !== next) return;
                if (next.timer) clearTimeout(next.timer);
                flightsRef.current[layer] = null;
                settleMoving();
                if (!isFlying()) window.dispatchEvent(new Event(settledEvent));
            };
            return true;
        },
        [layerEl, settleMoving, dropFlight, isFlying]
    );

    const commit = useCallback(
        (tab: number, section: number, motion?: Motion) => {
            const clampedTab = clamp(tab, 0, totalTabs - 1);
            const clampedSection = clamp(section, 0, getSectionsForTab(clampedTab) - 1);
            const previous = targetRef.current;
            targetRef.current = { tab: clampedTab, section: clampedSection };
            pendingTabRef.current = null;

            const flying = [
                settle(
                    "tabs",
                    clampedTab,
                    previous.tab,
                    motion?.layer === "tabs" ? motion : undefined
                ),
                settle(
                    "sections",
                    clampedSection,
                    previous.section,
                    motion?.layer === "sections" ? motion : undefined
                ),
            ];

            if (flying.some(Boolean)) containerRef.current?.classList.add("snap-moving");
            else {
                settleMoving();
                if (!isFlying()) window.dispatchEvent(new Event(settledEvent));
            }

            startTransition(() =>
                setState((prev) =>
                    prev.currentTab === clampedTab && prev.currentSection === clampedSection
                        ? prev
                        : { currentTab: clampedTab, currentSection: clampedSection }
                )
            );
        },
        [totalTabs, getSectionsForTab, settle, settleMoving, isFlying]
    );

    const allowStep = useCallback((dir: number) => {
        const now = performance.now();
        const last = stepRef.current;
        if (now - last.time < (dir === last.dir ? tuning.chain : tuning.reverse)) return false;

        stepRef.current = { time: now, dir };
        return true;
    }, []);

    const goToTab = useCallback(
        (tab: number) => {
            const target = targetRef.current;
            if (tab === target.tab && target.section === 0) return;
            commit(tab, 0);
        },
        [commit]
    );

    const goToSection = useCallback(
        (section: number) => {
            const target = targetRef.current;
            if (section === target.section) return;
            commit(target.tab, section);
        },
        [commit]
    );

    const syncTab = useCallback(
        (tab: number, force = false) => {
            if (tab === targetRef.current.tab) {
                pendingTabRef.current = null;
                return;
            }
            if (isFlying() && !force) {
                pendingTabRef.current = tab;
                return;
            }
            commit(tab, 0);
        },
        [commit, isFlying]
    );

    const pageStep = useCallback(
        (axis: Axis, forward: boolean) => {
            const { tab, section } = targetRef.current;
            const step = forward ? 1 : -1;

            if (axis === "x") {
                const next = tab + step;
                if (next < 0 || next >= totalTabs || !allowStep(step * 2)) return;
                commit(next, 0);
                return;
            }

            const next = section + step;
            if (next < 0 || next >= getSectionsForTab(tab) || !allowStep(step)) return;
            commit(tab, next);
        },
        [commit, allowStep, getSectionsForTab, totalTabs]
    );

    const nextSection = useCallback(() => pageStep("y", true), [pageStep]);
    const prevSection = useCallback(() => pageStep("y", false), [pageStep]);
    const nextTab = useCallback(() => pageStep("x", true), [pageStep]);
    const prevTab = useCallback(() => pageStep("x", false), [pageStep]);

    const navRef = useRef({ commit, nextTab, prevTab, nextSection, prevSection, grab });
    useEffect(() => {
        navRef.current = { commit, nextTab, prevTab, nextSection, prevSection, grab };
    });

    useEffect(() => {
        const applyPending = () => {
            const tab = pendingTabRef.current;
            if (tab !== null) navRef.current.commit(tab, 0);
        };

        addEventListener(settledEvent, applyPending);
        return () => removeEventListener(settledEvent, applyPending);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let padLocked = false;
        let padRecent: number[] = [];
        let padPeak = 0;
        let lastWheel = Number.NEGATIVE_INFINITY;

        const cancelFrame = () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };

        const write = (drag: DragState) => {
            if (!drag.el) return;
            drag.el.style.transform = translate(drag.axis ?? "y", drag.offset);
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

        const finish = (drag: DragState, tab: number, section: number, velocity?: number) => {
            cancelFrame();
            dragRef.current = null;
            if (drag.moved && drag.source === "touch") clickGuardRef.current = performance.now();

            const rest = drag.axis === "x" ? -tab * drag.page : -section * drag.page;
            const remaining = Math.abs(rest - drag.offset);
            const duration = prefersNoMotion() ? 0 : settleDuration(remaining, drag.page);

            navRef.current.commit(tab, section, {
                layer: drag.axis === "x" ? "tabs" : "sections",
                duration,
                velocity,
                from: drag.offset,
            });
        };

        const abort = () => {
            container.classList.remove("snap-pending");
            const drag = dragRef.current;
            if (!drag) return;
            if (!isActive(drag)) {
                cancelFrame();
                dragRef.current = null;
                return;
            }

            const { tab, section } = targetRef.current;
            if (drag.axis === "x") finish(drag, drag.base, section);
            else finish(drag, tab, drag.base);
        };

        const lockAxis = (drag: DragState, deltaX: number, deltaY: number) => {
            const axis: Axis = Math.abs(deltaX) > Math.abs(deltaY) * tuning.axisBias ? "x" : "y";
            const { tab: currentTab } = targetRef.current;

            container.classList.remove("snap-pending");
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

            navRef.current.grab(axis === "x" ? "tabs" : "sections", axis);
            drag.startOffset = currentTranslate(drag.el, axis);
            drag.offset = drag.startOffset;
            drag.base = clamp(Math.round(-drag.startOffset / drag.page), 0, drag.count - 1);
            write(drag);

            container.classList.add("snap-moving");
        };

        const track = (drag: DragState, delta: number) => {
            const now = performance.now();
            const raw = now - drag.lastTime;
            if (raw <= 0) return;

            const dt = drag.source === "wheel" ? Math.max(raw, tuning.pad.minDt) : raw;
            const instant = (delta - drag.delta) / dt;
            drag.velocity = raw > tuning.flickIdle ? instant : drag.velocity * 0.7 + instant * 0.3;
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

        const settleDrag = (drag: DragState, target: number, velocity: number) => {
            const { section: currentSection } = targetRef.current;
            if (drag.axis === "x") {
                // Changing tab resets the section, same as nextTab/prevTab
                finish(drag, target, target === drag.base ? currentSection : 0, velocity);
            } else {
                finish(drag, targetRef.current.tab, target, velocity);
            }
        };

        const release = (drag: DragState) => {
            const idle = performance.now() - drag.lastTime > tuning.flickIdle;
            const velocity = idle ? 0 : drag.velocity;

            // A trackpad swipe may have grabbed a page in flight: only what the fingers did counts
            const dist = drag.source === "wheel" ? drag.delta : drag.offset + drag.base * drag.page;

            const flick =
                Math.abs(velocity) > tuning.flickVelocity &&
                Math.abs(dist) > tuning.flickDistance &&
                Math.sign(velocity) === Math.sign(dist);
            const ratio = drag.source === "touch" ? tuning.commitRatio : tuning.pad.earlyRatio;
            const dragged = Math.abs(dist) > drag.page * ratio;

            let target = drag.base;
            if (flick || dragged) target = drag.base + (dist < 0 ? 1 : -1);
            target = clamp(target, 0, drag.count - 1);

            settleDrag(drag, target, velocity);
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

            abort();

            const touch = e.touches[0];
            const drag = start("touch", touch.identifier, e.target as Element);
            drag.startX = touch.clientX;
            drag.startY = touch.clientY;
            dragRef.current = drag;
            container.classList.add("snap-pending");
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
            container.classList.remove("snap-pending");

            if (!isActive(drag)) {
                dragRef.current = null;
                return;
            }
            release(drag);
        };

        const handleTouchCancel = () => abort();

        const endWheelGesture = () => {
            wheelTimeoutRef.current = null;
            padLocked = false;
            padRecent = [];
            padPeak = 0;

            const drag = dragRef.current;
            if (!drag || drag.source !== "wheel") return;
            if (isActive(drag)) release(drag);
            else dragRef.current = null;
        };

        const restartWheelIdle = () => {
            if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
            wheelTimeoutRef.current = setTimeout(endWheelGesture, tuning.pad.silence);
        };

        const handleNotch = (e: WheelEvent) => {
            const { tab: currentTab } = targetRef.current;

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

        const lockPad = () => {
            padLocked = true;
            padRecent = [];
        };

        const commitEarly = (drag: DragState, e: WheelEvent) => {
            // The direction is what the fingers did, never where the page was grabbed
            const target = clamp(drag.base + (drag.delta < 0 ? 1 : -1), 0, drag.count - 1);
            if (target === drag.base) return;

            const travelled = Math.abs(drag.delta) / drag.page;
            const size = Math.abs(drag.axis === "x" ? e.deltaX : e.deltaY);
            padPeak = Math.max(padPeak, size);

            const early = travelled >= tuning.pad.earlyRatio;
            const peaked = travelled >= tuning.pad.peakMin && size <= padPeak * tuning.pad.peakDrop;
            if (!early && !peaked) return;

            const speed = clamp(
                Math.abs(drag.velocity),
                tuning.pad.launchMin,
                tuning.pad.launchMax
            );
            lockPad();
            settleDrag(drag, target, speed * Math.sign(drag.delta));
        };

        const handlePan = (e: WheelEvent) => {
            let drag = dragRef.current;

            if (!drag) {
                drag = start("wheel", -1, e.target as Element);
                dragRef.current = drag;
                padPeak = 0;
            }

            let delta: number;
            if (drag.axis) {
                delta = drag.delta - (drag.axis === "x" ? e.deltaX : e.deltaY) * tuning.pad.follow;
            } else {
                // Accumulate first, so one tiny event cannot lock the axis
                drag.startX -= e.deltaX;
                drag.startY -= e.deltaY;
                if (
                    Math.abs(drag.startX) < tuning.pad.lock &&
                    Math.abs(drag.startY) < tuning.pad.lock
                ) {
                    return;
                }
                lockAxis(drag, drag.startX, drag.startY);
                delta = (drag.axis === "x" ? drag.startX : drag.startY) * tuning.pad.follow;
            }

            if (!isActive(drag)) return;
            e.preventDefault();

            track(drag, delta);
            applyDelta(drag, delta);
            commitEarly(drag, e);
        };

        const handleLocked = (e: WheelEvent) => {
            const size = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));

            if (!isNewSwipe(padRecent, size)) {
                padRecent.push(size);
                if (padRecent.length > tuning.pad.reaccelWindow) padRecent.shift();
                e.preventDefault();
                return;
            }

            padLocked = false;
            padRecent = [];
            handlePan(e);
        };

        const handleWheel = (e: WheelEvent) => {
            // Pinch to zoom arrives as a wheel event with the ctrl key down
            if (e.ctrlKey) return;

            const drag = dragRef.current;
            if (drag?.source === "touch") return;

            if (document.body.classList.contains("hole-active")) {
                e.preventDefault();
                return;
            }

            const now = performance.now();
            const gap = now - lastWheel;
            lastWheel = now;
            restartWheelIdle();

            if (padLocked) handleLocked(e);
            else if (!drag && isDiscreteWheel(e, gap)) handleNotch(e);
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
            dragRef.current = null;
            container.classList.remove("snap-moving");
        };
    }, [getSectionsForTab, threshold, totalTabs]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let timer: ReturnType<typeof setTimeout> | undefined;

        const rest = () => container.removeAttribute("data-scrolling");
        const handleScroll = () => {
            if (!container.hasAttribute("data-scrolling")) {
                container.setAttribute("data-scrolling", "");
            }
            clearTimeout(timer);
            timer = setTimeout(rest, tuning.scrollRest);
        };

        container.addEventListener("scroll", handleScroll, { capture: true, passive: true });
        return () => {
            clearTimeout(timer);
            container.removeEventListener("scroll", handleScroll, true);
            rest();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
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
        const flights = flightsRef.current;
        return () => {
            for (const flight of [flights.tabs, flights.sections]) {
                if (flight?.timer) clearTimeout(flight.timer);
                flight?.anim.cancel();
            }
            flights.tabs = null;
            flights.sections = null;
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
        syncTab,
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
 * Supports both immediate and delayed initialization modes. Lenis watches the element marked
 * `data-scroll-content` for size changes, else the first child, so a page whose first child is a
 * fixed header must mark the wrapper that holds the real content.
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
    const motion = useMotionEnabled();
    const active = enabled && motion;

    useEffect(() => {
        if (!active) {
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
            const content = (container.querySelector(":scope > [data-scroll-content]") ??
                container.firstElementChild) as HTMLElement | null;

            if (!content) return;

            lenisRef.current = new Lenis({
                wrapper: container,
                content: content,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                infinite: false,
                smoothWheel: true,
                syncTouch: false,
                overscroll: delayed ? false : undefined,
                prevent: () => !!container.closest(".snap-moving, .snap-pending"),
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
    }, [active, delayed, delayDuration]);

    const scrollTo = useCallback((target: string | HTMLElement, offset = 0) => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset });
            return;
        }

        const container = containerRef.current;
        const element =
            typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (!container || !element) return;

        const top =
            element.getBoundingClientRect().top -
            container.getBoundingClientRect().top +
            container.scrollTop +
            offset;

        container.scrollTo({ top, behavior: "auto" });
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
            if (e.button !== 0) return;
            isDragging.current = true;
            startX.current = e.pageX;
            scrollStart.current = el.scrollLeft;
            el.style.cursor = "grabbing";
            el.style.userSelect = "none";
            if (snap) el.style.scrollSnapType = "none";
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            if (e.buttons === 0) {
                handleMouseUp();
                return;
            }
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

        const handleHide = () => {
            if (document.hidden) handleMouseUp();
        };

        const handleDragStart = (e: DragEvent) => e.preventDefault();

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
                el.style.touchAction = "pan-x pan-y";
                el.addEventListener("mousedown", handleMouseDown);
                el.addEventListener("dragstart", handleDragStart);
                el.addEventListener("touchstart", handleTouchStart, { passive: true });
                el.addEventListener("touchmove", handleTouchMove, { passive: true });
                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
            } else {
                el.style.cursor = "";
                el.style.touchAction = "";
                el.removeEventListener("mousedown", handleMouseDown);
                el.removeEventListener("dragstart", handleDragStart);
                el.removeEventListener("touchstart", handleTouchStart);
                el.removeEventListener("touchmove", handleTouchMove);
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            }
        };

        window.addEventListener("blur", handleMouseUp);
        document.addEventListener("visibilitychange", handleHide);

        updateOverflowState();
        const observer = new ResizeObserver(updateOverflowState);
        observer.observe(el);

        return () => {
            observer.disconnect();
            window.removeEventListener("blur", handleMouseUp);
            document.removeEventListener("visibilitychange", handleHide);
            el.removeEventListener("mousedown", handleMouseDown);
            el.removeEventListener("dragstart", handleDragStart);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [ref, snap]);
}
