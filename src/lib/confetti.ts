import { prefersNoMotion } from "@/lib/gesture";
import { random } from "@/lib/utils";

// Gold shades picked to stay visible on both the light and the dark background
const colors = [
    "oklch(0.88 0.15 95)",
    "oklch(0.82 0.16 88)",
    "oklch(0.76 0.16 80)",
    "oklch(0.7 0.15 72)",
    "oklch(0.97 0.06 100)",
];

const shapes = ["star", "chip", "dot"];

// Particles per burst
const count = 22;

// Min delay between two bursts from the same element (ms)
const cooldown = 500;

const lastBurst = new WeakMap<Element, number>();

/**
 * Picks a random number within a range.
 *
 * @param min - Lower bound, included
 * @param max - Upper bound, excluded
 * @returns A number between the two bounds
 */
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Returns the fixed layer holding the confetti, creating it on first use.
 * The layer sits above the page so particles are never clipped by a scroll container.
 *
 * @returns The confetti layer element
 */
function getLayer(): HTMLElement {
    let layer = document.getElementById("confetti-layer");
    if (!layer) {
        layer = document.createElement("div");
        layer.id = "confetti-layer";
        layer.className = "confetti-layer";
        layer.setAttribute("aria-hidden", "true");
        document.body.appendChild(layer);
    }
    return layer;
}

/**
 * Pops a burst of golden confetti from the center of an element.
 * Does nothing when animations are disabled, and ignores a second burst from the same element
 * within the cooldown so a jittery hover cannot spam the page.
 *
 * @param origin - Element whose center the burst starts from, also the key of the cooldown
 */
export function popConfetti(origin: HTMLElement): void {
    if (prefersNoMotion()) return;

    const now = performance.now();
    if (now - (lastBurst.get(origin) ?? -Infinity) < cooldown) return;
    lastBurst.set(origin, now);

    const rect = origin.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const layer = getLayer();

    for (let i = 0; i < count; i++) {
        // Most particles fountain upwards, one in four scatters all around
        const angle = i % 4 === 0 ? rand(0, 360) : rand(-160, -20);
        const rad = (angle * Math.PI) / 180;
        const speed = rand(34, 92);
        const duration = rand(800, 1300);

        const particle = document.createElement("span");
        particle.className = `confetti confetti-${random.pick(shapes)}`;
        particle.style.left = `${cx}px`;
        particle.style.top = `${cy}px`;
        particle.style.setProperty("--confetti-dx", `${Math.cos(rad) * speed}px`);
        particle.style.setProperty("--confetti-dy", `${Math.sin(rad) * speed}px`);
        particle.style.setProperty("--confetti-fall", `${rand(36, 90)}px`);
        particle.style.setProperty("--confetti-rot", `${rand(-540, 540)}deg`);
        particle.style.setProperty("--confetti-size", `${rand(5, 11)}px`);
        particle.style.setProperty("--confetti-color", random.pick(colors));
        particle.style.animationDuration = `${duration}ms`;
        particle.style.animationDelay = `${rand(0, 90)}ms`;

        layer.appendChild(particle);
        const remove = () => particle.remove();
        particle.addEventListener("animationend", remove, { once: true });

        setTimeout(remove, duration + 400);
    }
}
