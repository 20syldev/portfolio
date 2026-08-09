export type Axis = "x" | "y";

export const tuning = {
    // Gesture recognition
    directionLock: 10, // Travel before the axis is locked (px)
    axisBias: 1.2, // Horizontal must beat vertical by this factor
    scrollSlack: 4, // Overflow below which a scroller is ignored (px)
    // Commit rules
    commitRatio: 0.22, // Page share to commit without a flick
    flickVelocity: 0.35, // Speed that commits a short drag (px/ms)
    flickDistance: 12, // Minimum flick travel, filters taps (px)
    flickIdle: 70, // Stillness that cancels a flick (ms)
    // Feel
    rubberBand: 0.55, // Edge resistance, lower is stiffer
    clickGuard: 250, // Click swallowed after a drag (ms)
    settleMin: 220, // Shortest settle animation (ms)
    settleMax: 600, // Longest settle animation (ms)
    // Wheel only
    wheel: {
        commitRatio: 0.5, // Raised: a pause looks exactly like letting go
        idle: 160, // Silence that ends a gesture (ms)
        lock: 6, // Accumulated travel before the axis is locked (px)
    },
};

/**
 * Applies non-linear resistance past the first and the last index.
 * Mirrors the iOS formula: the offset converges toward one page whatever
 * the distance dragged, so the edge always feels elastic.
 *
 * @param distance - Raw overscroll distance in px, signed
 * @param page - Size of one page in px
 * @returns The damped offset in px
 */
export function rubberBand(distance: number, page: number): number {
    if (page <= 0) return 0;
    return (distance * page * tuning.rubberBand) / (page + tuning.rubberBand * Math.abs(distance));
}

/**
 * Computes the settle duration, proportional to the distance left to travel.
 *
 * @param remaining - Distance still to travel in px
 * @param page - Size of one page in px
 * @returns Duration in ms
 */
export function settleDuration(remaining: number, page: number): number {
    if (page <= 0) return tuning.settleMin;

    const ratio = Math.min(1, remaining / page);
    return Math.round(tuning.settleMin + ratio * (tuning.settleMax - tuning.settleMin));
}

/**
 * Reads the live translation of an element, mid transition included.
 * Must be called before the transition is removed, since removing it snaps
 * the computed value straight to its end state.
 *
 * @param el - Element to measure
 * @param axis - Axis to read
 * @returns The current translation in px
 */
export function currentTranslate(el: HTMLElement, axis: Axis): number {
    const value = window.getComputedStyle(el).transform;
    if (!value || value === "none") return 0;

    try {
        const matrix = new DOMMatrixReadOnly(value);
        return axis === "x" ? matrix.m41 : matrix.m42;
    } catch {
        return 0;
    }
}

/**
 * Checks whether the gesture started inside a horizontally scrollable
 * ancestor, since carousels own their own gesture.
 *
 * @param element - Element the gesture started on
 * @param boundary - Element to stop the walk at, exclusive
 * @returns True if an ancestor scrolls horizontally
 */
export function hasHorizontalScroll(element: Element | null, boundary: Element): boolean {
    let node = element;
    while (node && node !== boundary) {
        const { overflowX } = window.getComputedStyle(node);
        if (
            (overflowX === "auto" || overflowX === "scroll") &&
            node.scrollWidth > node.clientWidth + tuning.scrollSlack
        ) {
            return true;
        }
        node = node.parentElement;
    }
    return false;
}

/**
 * Finds the closest vertically scrollable ancestor that can still move in
 * the requested direction. Called once when the axis locks, so ownership of
 * the gesture never flips halfway through.
 *
 * @param element - Element the gesture started on
 * @param boundary - Element to stop the walk at, exclusive
 * @param forward - True when the content should scroll down
 * @returns The scrollable element, or null if none can absorb the gesture
 */
export function findVerticalScroll(
    element: Element | null,
    boundary: Element,
    forward: boolean
): Element | null {
    let node = element;
    while (node && node !== boundary) {
        const { overflowY } = window.getComputedStyle(node);
        if (overflowY === "auto" || overflowY === "scroll") {
            const { scrollTop, scrollHeight, clientHeight } = node;
            if (scrollHeight > clientHeight + tuning.scrollSlack) {
                if (
                    forward
                        ? scrollTop + clientHeight < scrollHeight - tuning.scrollSlack
                        : scrollTop > tuning.scrollSlack
                ) {
                    return node;
                }
            }
        }
        node = node.parentElement;
    }
    return null;
}

/**
 * Checks whether an ancestor drives its own touch gestures.
 * `touch-action: none` is exactly that statement, so the pager keeps its
 * hands off: the draggable logo, and anything else physics driven.
 *
 * @param element - Element the gesture started on
 * @param boundary - Element to stop the walk at, exclusive
 * @returns True if the gesture belongs to a descendant widget
 */
export function ownsGesture(element: Element | null, boundary: Element): boolean {
    let node = element;
    while (node && node !== boundary) {
        if (window.getComputedStyle(node).touchAction === "none") return true;
        node = node.parentElement;
    }
    return false;
}

/**
 * Checks whether an element is the one currently on screen, by testing its
 * center against the viewport. Pager tabs stay mounted off screen, so a
 * component can never assume it is the one the user is looking at.
 *
 * @param el - Element to test
 * @returns True if the element is centered within the viewport
 */
export function isOnScreen(el: Element | null): boolean {
    if (!el) return false;

    const { left, top, width, height } = el.getBoundingClientRect();
    if (!width || !height) return false;

    const cx = left + width / 2;
    const cy = top + height / 2;
    return cx >= 0 && cx < window.innerWidth && cy >= 0 && cy < window.innerHeight;
}

/**
 * Picks the touch that started the gesture out of a touch list.
 *
 * @param list - Touch list from the event
 * @param id - Identifier captured at touchstart
 * @returns The matching touch, or null if it is gone
 */
export function findTouch(list: TouchList, id: number): Touch | null {
    for (let i = 0; i < list.length; i++) {
        if (list[i].identifier === id) return list[i];
    }
    return null;
}

/**
 * Checks whether every animation must be skipped.
 * Combines the site-wide no-motion toggle and the system preference.
 *
 * @returns True if animations are disabled
 */
export function prefersNoMotion(): boolean {
    return (
        document.body.classList.contains("no-motion") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

/**
 * Checks whether a wheel event comes from a notched mouse wheel rather than
 * a trackpad. Notched wheels report lines, pages, or round pixel jumps of a
 * full notch, while trackpads emit many small fractional deltas.
 *
 * @param e - Wheel event to classify
 * @returns True for a notched mouse wheel
 */
export function isDiscreteWheel(e: WheelEvent): boolean {
    if (e.deltaMode !== 0) return true;

    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    return Math.abs(delta) >= 100 && Number.isInteger(delta);
}

/**
 * Constrains a value between two bounds.
 *
 * @param value - Value to clamp
 * @param min - Lower bound
 * @param max - Upper bound
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}