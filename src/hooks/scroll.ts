"use client";

import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollState {
    currentTab: number;
    currentSection: number;
    isScrolling: boolean;
}

interface UseScrollOptions {
    totalTabs: number;
    homeSections?: number;
    threshold?: number;
    scrollDuration?: number;
    initialTab?: number;
}

export function useScroll({
    totalTabs,
    homeSections = 1,
    threshold = 50,
    scrollDuration = 500,
    initialTab = 0,
}: UseScrollOptions) {
    const getSectionsForTab = useCallback(
        (tab: number) => (tab === 0 ? homeSections : 1),
        [homeSections]
    );
    const [state, setState] = useState<ScrollState>({
        currentTab: initialTab,
        currentSection: 0,
        isScrolling: false,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number; hasHorizontalScroll: boolean } | null>(
        null
    );
    const directionLockedRef = useRef<"x" | "y" | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Store callbacks in refs to avoid dependency issues
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const scrollTo = useCallback(
        (tab: number, section: number) => {
            if (stateRef.current.isScrolling) return;

            const clampedTab = Math.max(0, Math.min(tab, totalTabs - 1));
            const maxSection = getSectionsForTab(clampedTab) - 1;
            const clampedSection = Math.max(0, Math.min(section, maxSection));

            setState({
                isScrolling: true,
                currentTab: clampedTab,
                currentSection: clampedSection,
            });

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                setState((prev) => ({ ...prev, isScrolling: false }));
            }, scrollDuration);
        },
        [totalTabs, getSectionsForTab, scrollDuration]
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

    // Wheel event handler
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isAtScrollBoundary = (element: Element, direction: "up" | "down"): boolean => {
            const { scrollTop, scrollHeight, clientHeight } = element;
            if (direction === "up") {
                return scrollTop <= 0;
            }
            return scrollTop + clientHeight >= scrollHeight - 1;
        };

        const handleWheel = (e: WheelEvent) => {
            const { isScrolling, currentTab, currentSection } = stateRef.current;

            if (isScrolling) {
                e.preventDefault();
                return;
            }

            const absX = Math.abs(e.deltaX);
            const absY = Math.abs(e.deltaY);
            const hasNativeScroll = getSectionsForTab(currentTab) === 1;

            if (absX > absY && absX > threshold) {
                e.preventDefault();
                if (e.deltaX > 0) {
                    nextTab();
                } else {
                    prevTab();
                }
            } else if (absY > absX && absY > threshold) {
                if (hasNativeScroll) {
                    return;
                }

                const section = container.querySelector(
                    `.snap-tab:nth-child(${currentTab + 1}) .snap-section:nth-child(${currentSection + 1})`
                );

                if (section) {
                    const scrollingDown = e.deltaY > 0;
                    const atBoundary = isAtScrollBoundary(section, scrollingDown ? "down" : "up");

                    if (!atBoundary) {
                        return;
                    }
                }

                e.preventDefault();
                if (e.deltaY > 0) {
                    nextSection();
                } else {
                    prevSection();
                }
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, [threshold, getSectionsForTab, nextTab, prevTab, nextSection, prevSection]);

    // Touch event handlers
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isAtScrollBoundary = (element: Element, direction: "up" | "down"): boolean => {
            const { scrollTop, scrollHeight, clientHeight } = element;
            if (direction === "up") {
                return scrollTop <= 0;
            }
            return scrollTop + clientHeight >= scrollHeight - 1;
        };

        const hasHorizontalScrollElement = (element: Element | null): boolean => {
            while (element && element !== container) {
                const style = window.getComputedStyle(element);
                const overflowX = style.overflowX;
                if (
                    (overflowX === "auto" || overflowX === "scroll") &&
                    element.scrollWidth > element.clientWidth
                ) {
                    return true;
                }
                element = element.parentElement;
            }
            return false;
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (stateRef.current.isScrolling) return;

            const touch = e.touches[0];
            const target = e.target as Element;
            touchStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                hasHorizontalScroll: hasHorizontalScrollElement(target),
            };
            directionLockedRef.current = null;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartRef.current || stateRef.current.isScrolling) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartRef.current.x;
            const deltaY = touch.clientY - touchStartRef.current.y;
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (!directionLockedRef.current && (absX > 10 || absY > 10)) {
                directionLockedRef.current = absX > absY ? "x" : "y";
            }

            // Prevent default for horizontal swipes (tab navigation)
            // Skip if the element has its own horizontal scroll
            if (
                directionLockedRef.current === "x" &&
                e.cancelable &&
                !touchStartRef.current.hasHorizontalScroll
            ) {
                e.preventDefault();
            }

            // For vertical swipes on multi-section tabs, prevent default at boundaries
            if (directionLockedRef.current === "y" && e.cancelable) {
                const { currentTab, currentSection } = stateRef.current;
                const hasNativeScroll = getSectionsForTab(currentTab) === 1;

                if (!hasNativeScroll) {
                    const section = container.querySelector(
                        `.snap-tab:nth-child(${currentTab + 1}) .snap-section:nth-child(${currentSection + 1})`
                    );

                    if (section) {
                        const scrollingDown = deltaY < 0; // swipe up = scroll down
                        const atBoundary = isAtScrollBoundary(
                            section,
                            scrollingDown ? "down" : "up"
                        );

                        if (atBoundary) {
                            e.preventDefault();
                        }
                    }
                }
            }
        };

        // Touch end handler
        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartRef.current || stateRef.current.isScrolling) {
                touchStartRef.current = null;
                directionLockedRef.current = null;
                return;
            }

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchStartRef.current.x;
            const deltaY = touch.clientY - touchStartRef.current.y;

            // Horizontal swipe for tab navigation
            if (
                directionLockedRef.current === "x" &&
                Math.abs(deltaX) > threshold &&
                !touchStartRef.current.hasHorizontalScroll
            ) {
                if (deltaX < 0) nextTab();
                else prevTab();
            }

            // Vertical swipe for section navigation
            if (directionLockedRef.current === "y" && Math.abs(deltaY) > threshold) {
                const { currentTab, currentSection } = stateRef.current;
                const hasNativeScroll = getSectionsForTab(currentTab) === 1;

                if (!hasNativeScroll) {
                    const section = container.querySelector(
                        `.snap-tab:nth-child(${currentTab + 1}) .snap-section:nth-child(${currentSection + 1})`
                    );

                    if (section) {
                        const scrollingDown = deltaY < 0; // swipe up = scroll down
                        const atBoundary = isAtScrollBoundary(
                            section,
                            scrollingDown ? "down" : "up"
                        );

                        if (atBoundary) {
                            if (scrollingDown) {
                                nextSection();
                            } else {
                                prevSection();
                            }
                        }
                    }
                }
            }

            touchStartRef.current = null;
            directionLockedRef.current = null;
        };

        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [threshold, nextTab, prevTab, nextSection, prevSection, getSectionsForTab]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                stateRef.current.isScrolling ||
                e.altKey ||
                document.querySelector("[role='dialog']")
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

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    return {
        containerRef,
        currentTab: state.currentTab,
        currentSection: state.currentSection,
        isScrolling: state.isScrolling,
        goToTab,
        goToSection,
        nextSection,
        prevSection,
        nextTab,
        prevTab,
    };
}

export function useSmoothScroll<T extends HTMLElement>(enabled = true) {
    const containerRef = useRef<T>(null);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        if (!containerRef.current || !enabled) return;

        const lenis = new Lenis({
            wrapper: containerRef.current,
            content: containerRef.current.firstElementChild as HTMLElement,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
            smoothWheel: true,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [enabled]);

    return containerRef;
}

export function useContainerSmoothScroll<T extends HTMLElement>(enabled = true) {
    const containerRef = useRef<T>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) {
            // Cleanup when disabled
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            return;
        }

        // Delay initialization to wait for modal animation
        const timeoutId = setTimeout(() => {
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
                overscroll: false,
            });

            function raf(time: number) {
                lenisRef.current?.raf(time);
                rafIdRef.current = requestAnimationFrame(raf);
            }

            rafIdRef.current = requestAnimationFrame(raf);
        }, 250);

        return () => {
            clearTimeout(timeoutId);
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, [enabled]);

    return containerRef;
}