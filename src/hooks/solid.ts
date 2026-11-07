import { type RefObject, useEffect } from "react";

import { reachesTop } from "@/lib/scroller";

const threshold = 8;

/**
 * Hook marking a header as solid once content scrolls under it.
 * Scrollers are read when they move, and once at mount for a page that opened already scrolled by
 * an anchor. Transforms are watched too, since a home section leaving the screen is not a scroll.
 *
 * @param ref - Ref to the header element that receives `data-solid`
 */
export function useSolid(ref: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const header = ref.current;
        if (!header) return;

        const scrolled = new Set<Element>();
        let solid = false;

        const sync = () => {
            let next = false;
            for (const el of scrolled) {
                if (!el.isConnected) {
                    scrolled.delete(el);
                } else if (!el.closest("[inert]") && reachesTop(el)) {
                    next = true;
                    break;
                }
            }

            if (next === solid) return;
            solid = next;
            header.toggleAttribute("data-solid", next);
        };

        const onScroll = (event: Event) => {
            const target = event.target === document ? document.scrollingElement : event.target;
            if (!(target instanceof Element)) return;

            if (target.scrollTop > threshold) scrolled.add(target);
            else scrolled.delete(target);
            sync();
        };

        const onTransition = (event: TransitionEvent) => {
            if (event.propertyName === "transform") sync();
        };

        const seed = requestAnimationFrame(() => {
            for (const el of document.querySelectorAll("*")) {
                if (el.scrollTop > threshold) scrolled.add(el);
            }
            sync();
        });

        document.addEventListener("scroll", onScroll, { capture: true, passive: true });
        document.addEventListener("transitionend", onTransition, true);
        addEventListener("resize", sync);

        return () => {
            cancelAnimationFrame(seed);
            document.removeEventListener("scroll", onScroll, true);
            document.removeEventListener("transitionend", onTransition, true);
            removeEventListener("resize", sync);
        };
    }, [ref]);
}