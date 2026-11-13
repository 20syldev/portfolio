export type Axis = "x" | "y";

export const settledEvent = "snapsettled";

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
    scrollRest: 200, // Quiet time before a page counts as no longer scrolling (ms)
    duration: 600, // Duration of a notch, key or dot move (ms)
    settleMin: 222, // Shortest settle animation (ms)
    settleMax: 600, // Longest settle animation (ms)
    chain: 280, // Shortest gap between two same direction steps of a key or a notch (ms)
    reverse: 80, // Shortest gap before a step back (ms)
    keyStart: 1.4, // Launch of a key, notch or dot move that finds the page at rest, in distance per duration
    visualEnd: 0.75, // Flight share after which the slide counts as visually done
    slopeMin: 0.5, // Gentlest launch of a settle, in distance per duration
    slopeMax: 7, // Sharpest launch of a settle, in distance per duration
    // Trackpad only
    pad: {
        lock: 6, // Accumulated travel before the axis is locked (px)
        silence: 140, // Silence that ends a gesture and releases the lock (ms)
        follow: 0.5, // Scale applied to the deltas while following
        earlyRatio: 0.2, // Followed share of a page that commits early
        peakMin: 0.06, // Followed share of a page before a speed peak may commit
        peakDrop: 0.8, // Share of the peak speed that marks the peak as passed
        reaccelRatio: 3, // Growth over the recent minimum that marks a new swipe
        reaccelMin: 250, // Smallest delta that can mark a new swipe (px)
        reaccelWindow: 5, // Events kept to find the recent minimum
        notchGap: 150, // Quiet time before a large round delta may be a notch (ms)
        minDt: 8, // Shortest interval used to estimate a speed (ms)
        launchMin: 4, // Gentlest launch speed of a committed page (px/ms)
        launchMax: 12, // Sharpest launch speed of a committed page (px/ms)
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
 * Reads the live translation of an element, mid animation included.
 * Must be called before the animation is cancelled, since cancelling it snaps
 * the computed value straight to the inline end state.
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
 * full notch, while trackpads emit many small fractional deltas. Some
 * trackpads round their deltas, so a large round delta that follows another
 * wheel event closely counts as a notch only when it is exactly 100 or 120.
 *
 * @param e - Wheel event to classify
 * @param gap - Time since the previous wheel event in ms
 * @returns True for a notched mouse wheel
 */
export function isDiscreteWheel(e: WheelEvent, gap: number): boolean {
    if (e.deltaMode !== 0) return true;

    const delta = Math.abs(Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX);
    if (delta < 100 || !Number.isInteger(delta)) return false;

    return gap > tuning.pad.notchGap || delta === 100 || delta === 120;
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

/**
 * Tells whether a wheel event restarts a trackpad gesture that is already locked: a delta that
 * grows well above the recent minimum is a new swipe, a decaying tail never is.
 *
 * @param recent - Delta sizes of the latest events, newest last
 * @param size - Delta size of the incoming event
 * @returns True when the event starts a new swipe
 */
export function isNewSwipe(recent: number[], size: number): boolean {
    if (recent.length === 0 || size < tuning.pad.reaccelMin) return false;

    return size >= Math.min(...recent) * tuning.pad.reaccelRatio;
}
