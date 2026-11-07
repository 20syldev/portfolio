/**
 * Tells whether a scroller fills the window from its very top, as the page or a home section does.
 * The ones that sit lower or off screen scroll content that never reaches the header.
 *
 * @param el - Scroller to test
 * @returns True when the scroller can slide content under the header
 */
export function reachesTop(el: Element): boolean {
    if (el === document.scrollingElement) return true;

    const rect = el.getBoundingClientRect();
    return (
        Math.abs(rect.top) <= 2 &&
        rect.bottom >= innerHeight / 2 &&
        rect.left < innerWidth / 2 &&
        rect.right > innerWidth / 2
    );
}
