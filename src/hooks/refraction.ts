import { type RefObject, useEffect, useState } from "react";

import { canRefract, displacementMap, type Refraction } from "@/lib/refraction";

// Last bitmap drawn, so that a page change starts with the pill already bent
let drawn: Refraction | null = null;

/**
 * Hook preparing the bitmap that bends the backdrop of an element, once the page is idle.
 * Nothing is drawn before the load event and an idle slot, and the bitmap is kept from one page to
 * the next: it is drawn again only when the element really changes size.
 *
 * @param ref - Ref to the glass element
 * @returns The bitmap and the size it was drawn for, or null while refraction is not available
 */
export function useRefraction(ref: RefObject<HTMLElement | null>) {
    const [state, setState] = useState<Refraction | null>(() =>
        drawn && canRefract() ? drawn : null
    );

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof requestIdleCallback !== "function") return;

        const wide = matchMedia("(min-width: 768px)");
        let observer: ResizeObserver | null = null;
        let idle = 0;
        let settle = 0;
        let last = drawn ? `${drawn.width}x${drawn.height}` : "";

        const sync = () => {
            clearTimeout(settle);
            const width = Math.round(el.offsetWidth);
            const height = Math.round(el.offsetHeight);
            if (!width || !canRefract()) {
                last = "";
                drawn = null;
                setState(null);
                return;
            }

            const key = `${width}x${height}`;
            if (key === last) return;
            last = key;

            const href = displacementMap(width, height, Math.min(2, Math.ceil(devicePixelRatio)));
            drawn = href ? { width, height, href } : null;
            setState(drawn);
        };

        const resize = () => {
            if (`${Math.round(el.offsetWidth)}x${Math.round(el.offsetHeight)}` === last) return;
            setState(null);
            clearTimeout(settle);
            settle = window.setTimeout(sync, 150);
        };

        const start = () => {
            idle = requestIdleCallback(
                () => {
                    sync();
                    observer = new ResizeObserver(resize);
                    observer.observe(el);
                    wide.addEventListener("change", sync);
                },
                { timeout: 2000 }
            );
        };

        if (document.readyState === "complete") start();
        else addEventListener("load", start, { once: true });

        return () => {
            removeEventListener("load", start);
            cancelIdleCallback(idle);
            clearTimeout(settle);
            observer?.disconnect();
            wide.removeEventListener("change", sync);
        };
    }, [ref]);

    return state;
}
