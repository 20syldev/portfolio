import { type RefObject, useEffect } from "react";

import { reachesTop } from "@/lib/scroller";

const top = 24;
const down = 14;
const up = 8;

/**
 * Hook sliding a header away while a phone page scrolls down, and back as soon as it scrolls up.
 * The state is the `data-bar-hidden` attribute of the root, so sticky elements can follow it. It
 * stays visible near the top, with a dialog open, with focus inside it, and on wide windows.
 *
 * @param ref - Ref to the header element
 * @param enabled - False on the pages whose scrolling is a slide between sections
 * @param reset - Value whose change shows the header again, such as the current tab
 */
export function useHide(ref: RefObject<HTMLElement | null>, enabled: boolean, reset: number) {
    useEffect(() => {
        const header = ref.current;
        const root = document.documentElement;
        if (!header || !enabled) return;

        const phone = matchMedia("(max-width: 767.98px)");
        const last = new WeakMap<Element, number>();
        const moved = new Set<Element>();
        let frame = 0;
        let travel = 0;
        let hidden = false;

        const set = (next: boolean) => {
            travel = 0;
            if (next === hidden) return;
            hidden = next;
            root.toggleAttribute("data-bar-hidden", next);
        };

        const pinned = () =>
            header.querySelector(":focus-visible") !== null ||
            document.querySelector('[role="dialog"]') !== null;

        const step = (el: Element) => {
            const position = Math.max(el.scrollTop, 0);
            const delta = position - (last.get(el) ?? position);
            last.set(el, position);
            if (delta === 0 || el.closest("[inert]")) return;

            if (position <= top) {
                set(false);
                return;
            }

            travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
            if (travel < -up) set(false);
            else if (travel > down && !pinned() && reachesTop(el)) set(true);
        };

        const read = () => {
            frame = 0;
            const scrollers = [...moved];
            moved.clear();
            if (!phone.matches) return;

            scrollers.forEach(step);
        };

        const onScroll = (event: Event) => {
            const el = event.target === document ? document.scrollingElement : event.target;
            if (!(el instanceof Element)) return;

            moved.add(el);
            if (!frame) frame = requestAnimationFrame(read);
        };

        const onFocus = () => {
            if (header.querySelector(":focus-visible")) set(false);
        };

        const onChange = () => {
            if (!phone.matches) set(false);
        };

        document.addEventListener("scroll", onScroll, { capture: true, passive: true });
        header.addEventListener("focusin", onFocus);
        phone.addEventListener("change", onChange);

        return () => {
            document.removeEventListener("scroll", onScroll, true);
            header.removeEventListener("focusin", onFocus);
            phone.removeEventListener("change", onChange);
            cancelAnimationFrame(frame);
            root.removeAttribute("data-bar-hidden");
        };
    }, [ref, enabled, reset]);
}
