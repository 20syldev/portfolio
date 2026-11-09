import { useEffect } from "react";

/**
 * How the highlight picks its target: the item under the pointer, or the item a list marks as
 * selected with `data-selected="true"` (mouse and keyboard alike).
 */
type SlideMode = "pointer" | "selection";

/**
 * Hook sliding one highlight capsule between the items of a list, like the hover of the bar.
 * The indicator is created inside the host and driven by `--slide-x`, `--slide-y`, `--slide-w`,
 * `--slide-h` and `--slide-o`, so a move costs no React render. The first target is reached
 * without sliding, and the highlight fades out over an item that already wears `aria-current` and
 * when the pointer leaves the host. In selection mode the highlight also follows the scroll offset
 * of the host and settles without sliding when the layout switches. Measures are divided by the
 * scale of the host, so a popup still zooming in places the highlight where it will end up. The
 * pointer mode is installed only under a hovering fine pointer.
 *
 * @param host - Host element that holds the items, it becomes the positioning parent, or null before mount
 * @param targets - Selector of the items that wear the highlight
 * @param mode - Whether the pointer or the list selection drives the highlight
 */
export function useSlide(host: HTMLElement | null, targets: string, mode: SlideMode = "pointer") {
    useEffect(() => {
        if (!host) return;
        if (mode === "pointer" && !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        const indicator = document.createElement("span");
        indicator.className = "slide-indicator";
        indicator.setAttribute("aria-hidden", "true");
        host.appendChild(indicator);
        indicator.dataset.mode = mode;

        let current: HTMLElement | null = null;
        let engaged = false;
        let frame = 0;

        const place = (target: HTMLElement, hidden: boolean) => {
            const box = host.getBoundingClientRect();
            const rect = target.getBoundingClientRect();
            const scale = host.offsetWidth > 0 ? box.width / host.offsetWidth : 1;
            indicator.style.setProperty(
                "--slide-x",
                `${(rect.left - box.left) / scale - host.clientLeft}px`
            );
            indicator.style.setProperty(
                "--slide-y",
                `${(rect.top - box.top) / scale - host.clientTop + host.scrollTop}px`
            );
            indicator.style.setProperty("--slide-w", `${rect.width / scale}px`);
            indicator.style.setProperty("--slide-h", `${rect.height / scale}px`);
            indicator.style.setProperty("--slide-o", hidden ? "0" : "1");
        };

        const snap = (target: HTMLElement, hidden: boolean) => {
            indicator.dataset.snap = "";
            place(target, hidden);
            void indicator.offsetWidth;
            delete indicator.dataset.snap;
        };

        const show = (target: HTMLElement) => {
            current = target;
            const hidden = target.getAttribute("aria-current") !== null;

            if (!engaged) {
                engaged = true;
                snap(target, hidden);
                return;
            }

            place(target, hidden);
        };

        const hide = () => {
            engaged = false;
            current = null;
            indicator.style.setProperty("--slide-o", "0");
        };

        const onOver = (event: PointerEvent) => {
            if (event.pointerType === "touch" || !(event.target instanceof Element)) return;

            const target = event.target.closest<HTMLElement>(targets);
            if (target && host.contains(target)) show(target);
        };

        const sync = (instant: boolean) => {
            frame = 0;
            const target = host.querySelector<HTMLElement>(`${targets}[data-selected="true"]`);
            if (!target) return hide();

            current = target;
            if (!engaged || instant) {
                engaged = true;
                snap(target, false);
            } else {
                place(target, false);
            }
        };

        const queue = (records: MutationRecord[]) => {
            const instant = records.some((record) => record.attributeName === "data-layout");
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => sync(instant));
        };

        const refresh = () => {
            if (!current || !engaged) return;
            snap(current, current.getAttribute("aria-current") !== null);
        };

        const onCurrent = () => {
            if (current) place(current, current.getAttribute("aria-current") !== null);
        };

        const sizes = new ResizeObserver(refresh);
        const marks = new MutationObserver(mode === "selection" ? queue : onCurrent);

        sizes.observe(host);
        if (mode === "selection") {
            marks.observe(host, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["data-selected", "data-layout"],
            });
            sync(true);
        } else {
            marks.observe(host, {
                subtree: true,
                attributes: true,
                attributeFilter: ["aria-current"],
            });
            host.addEventListener("pointerover", onOver, { passive: true });
            host.addEventListener("pointerleave", hide, { passive: true });
        }

        return () => {
            cancelAnimationFrame(frame);
            sizes.disconnect();
            marks.disconnect();
            host.removeEventListener("pointerover", onOver);
            host.removeEventListener("pointerleave", hide);
            indicator.remove();
        };
    }, [host, targets, mode]);
}
