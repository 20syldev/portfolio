/**
 * Animation length, kept in sync with the `target-mark` keyframes in globals.css.
 * Time the smooth scroll needs to settle before the mark is worth watching.
 */
const duration = 2800;
const settle = 700;

/**
 * Highlights an anchor target once the view has settled on it.
 *
 * Driven imperatively rather than through `:target` for two reasons: the table of contents
 * scrolls programmatically without ever navigating to a fragment, and a fragment that is
 * honoured immediately would burn half its animation while the smooth scroll is still
 * travelling.
 *
 * @param id - Element id to mark
 * @param delay - Milliseconds to wait before marking, defaults to the scroll settle time
 * @returns A cleanup function cancelling any pending or running mark
 */
export function markAnchor(id: string, delay = settle) {
    const element = document.getElementById(id);
    if (!element) return () => {};

    const start = window.setTimeout(() => {
        element.removeAttribute("data-marked");
        void element.offsetWidth;
        element.setAttribute("data-marked", "");
    }, delay);

    const end = window.setTimeout(() => element.removeAttribute("data-marked"), delay + duration);

    return () => {
        window.clearTimeout(start);
        window.clearTimeout(end);
        element.removeAttribute("data-marked");
    };
}