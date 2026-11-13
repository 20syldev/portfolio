import { type RefObject, useEffect, useState } from "react";

/**
 * Hook telling whether an element is on screen while the tab is in the foreground.
 * Meant to pause work and defer downloads for an element that sits in a hidden panel or
 * far down a scroll container, where the browser's own lazy loading still considers it near.
 *
 * @param ref - Ref to the observed element.
 * @returns True while the element intersects the viewport and the page is visible.
 */
export function useVisible<T extends Element>(ref: RefObject<T | null>) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let onScreen = false;
        const sync = () => setVisible(onScreen && !document.hidden);

        const observer = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
        });
        observer.observe(el);
        document.addEventListener("visibilitychange", sync);

        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", sync);
        };
    }, [ref]);

    return visible;
}
