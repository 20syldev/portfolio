import { Axis, clamp, tuning } from "@/lib/gesture";

export type Bezier = [number, number, number, number];

/**
 * A settle running on the compositor, kept to retarget it from where it stands. It records the
 * translation at launch and at rest in px, the duration in ms, its easing, whether the slide is
 * visually finished and the timer that marks it so.
 */
export interface Flight {
    anim: Animation;
    from: number;
    to: number;
    duration: number;
    ease: Bezier;
    done: boolean;
    timer: ReturnType<typeof setTimeout> | null;
}

const defaultEase: Bezier = [0.22, 1, 0.36, 1];

/**
 * Builds the CSS translation of a layer.
 *
 * @param axis - Axis to translate along
 * @param px - Translation in px
 * @returns A translate3d value
 */
export function translate(axis: Axis, px: number): string {
    return axis === "x" ? `translate3d(${px}px, 0, 0)` : `translate3d(0, ${px}px, 0)`;
}

/**
 * Evaluates a CSS cubic-bezier easing: the progress reached at a given time.
 *
 * @param bezier - Control points of the curve
 * @param x - Time fraction between 0 and 1
 * @returns The eased progress
 */
function bezierAt([x1, y1, x2, y2]: Bezier, x: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    const axis = (a: number, b: number, t: number) =>
        3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;

    let low = 0;
    let high = 1;
    let t = x;
    for (let i = 0; i < 24; i++) {
        const value = axis(x1, x2, t);
        if (Math.abs(value - x) < 1e-5) break;
        if (value < x) low = t;
        else high = t;
        t = (low + high) / 2;
    }
    return axis(y1, y2, t);
}

/**
 * Builds the easing of a settle so that it leaves at the speed the page
 * already had. The curve keeps the shape of the default ease-out and only
 * changes how steeply it takes off.
 *
 * @param launch - Speed toward the target in px/ms, undefined for the default look
 * @param duration - Duration of the settle in ms
 * @param distance - Distance left to travel in px
 * @returns The control points of the cubic Bezier
 */
export function launchEase(launch: number | undefined, duration: number, distance: number): Bezier {
    if (launch === undefined || distance <= 0 || duration <= 0) return [...defaultEase];

    const slope = clamp(
        (Math.max(launch, 0) * duration) / distance,
        tuning.slopeMin,
        tuning.slopeMax
    );
    const y1 = Math.min(1, slope * defaultEase[0]);
    return [y1 / slope, y1, defaultEase[2], defaultEase[3]];
}

/**
 * Reads the time reached by a settle off the animation itself.
 *
 * @param flight - The running settle
 * @returns Elapsed time in ms, between 0 and the duration
 */
function flightTime(flight: Flight): number {
    return clamp(Number(flight.anim.currentTime ?? 0), 0, flight.duration);
}

/**
 * Reads the velocity of a settle at this very moment off its own easing curve.
 *
 * @param flight - The running settle
 * @returns Signed speed along the layer axis in px/ms
 */
export function flightSpeed(flight: Flight): number {
    const step = 4;
    const t = flightTime(flight);
    const ahead = bezierAt(flight.ease, Math.min(1, (t + step) / flight.duration));
    const now = bezierAt(flight.ease, t / flight.duration);
    return ((flight.to - flight.from) * (ahead - now)) / step;
}
