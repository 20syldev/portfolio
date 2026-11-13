import { useLayoutEffect } from "react";

let mounted = 0;

/**
 * Hook marking the page as `data-modal` on the root element while a dialog overlay is mounted,
 * its exit animation included. Stylesheets read the mark instead of `:has()`, which has the
 * browser check the whole page again at every change of the DOM and slows the close of a dialog.
 */
export function useModalMark() {
    useLayoutEffect(() => {
        const root = document.documentElement;
        mounted += 1;
        root.setAttribute("data-modal", "");

        return () => {
            mounted -= 1;
            if (mounted === 0) root.removeAttribute("data-modal");
        };
    }, []);
}
