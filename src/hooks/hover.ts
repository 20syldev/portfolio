import { type RefObject, useEffect } from "react";

/**
 * Tabs and icon buttons of the pill that wear the sliding highlight, the logo keeps its own look.
 */
const targets = ".glass-tab, .glass > div > button";

/**
 * Hook sliding one highlight between the tabs and the buttons of the pill under the pointer.
 * Installed only under a hovering fine pointer. The indicator is driven by `--hover-x`, `--hover-y`,
 * `--hover-w`, `--hover-h` and `--hover-o` on its own element, so a move costs no React render. The
 * first hover places it under the target without sliding, and it fades out over the active tab,
 * which already wears its own capsule, over the logo and when the pointer leaves the pill. Measures run on
 * pointer entry and whenever the pill or the active tab changes.
 *
 * @param pillRef - Ref to the positioned pill that holds the targets
 * @param indicatorRef - Ref to the indicator element inside the pill
 */
export function useHover(
    pillRef: RefObject<HTMLElement | null>,
    indicatorRef: RefObject<HTMLElement | null>
) {
    useEffect(() => {
        const pill = pillRef.current;
        const indicator = indicatorRef.current;
        if (!pill || !indicator || !matchMedia("(hover: hover) and (pointer: fine)").matches) {
            return;
        }

        let current: HTMLElement | null = null;
        let engaged = false;

        const place = (target: HTMLElement) => {
            const box = pill.getBoundingClientRect();
            const rect = target.getBoundingClientRect();
            indicator.style.setProperty("--hover-x", `${rect.left - box.left - pill.clientLeft}px`);
            indicator.style.setProperty("--hover-y", `${rect.top - box.top - pill.clientTop}px`);
            indicator.style.setProperty("--hover-w", `${rect.width}px`);
            indicator.style.setProperty("--hover-h", `${rect.height}px`);
            indicator.style.setProperty(
                "--hover-o",
                target.getAttribute("aria-current") === "page" ? "0" : "1"
            );
        };

        const show = (target: HTMLElement) => {
            current = target;

            if (!engaged) {
                engaged = true;
                indicator.dataset.snap = "";
                place(target);
                void indicator.offsetWidth;
                delete indicator.dataset.snap;
                return;
            }

            place(target);
        };

        const hide = () => {
            engaged = false;
            current = null;
            indicator.style.setProperty("--hover-o", "0");
        };

        const refresh = () => {
            if (!current || !engaged) return;
            indicator.dataset.snap = "";
            place(current);
            void indicator.offsetWidth;
            delete indicator.dataset.snap;
        };

        const onOver = (event: PointerEvent) => {
            if (event.pointerType === "touch" || !(event.target instanceof Element)) return;

            const target = event.target.closest<HTMLElement>(targets);
            if (target && pill.contains(target)) show(target);
            else if (event.target === pill || event.target.closest("a")) hide();
        };

        const onActive = () => {
            if (current && engaged) place(current);
        };

        const sizes = new ResizeObserver(refresh);
        const marks = new MutationObserver(onActive);
        sizes.observe(pill);
        marks.observe(pill, { attributes: true, attributeFilter: ["aria-current"], subtree: true });
        pill.addEventListener("pointerover", onOver, { passive: true });
        pill.addEventListener("pointerleave", hide, { passive: true });
        pill.dataset.hover = "";

        return () => {
            sizes.disconnect();
            marks.disconnect();
            pill.removeEventListener("pointerover", onOver);
            pill.removeEventListener("pointerleave", hide);
            delete pill.dataset.hover;
            for (const name of ["--hover-x", "--hover-y", "--hover-w", "--hover-h", "--hover-o"]) {
                indicator.style.removeProperty(name);
            }
            delete indicator.dataset.snap;
        };
    }, [pillRef, indicatorRef]);
}
