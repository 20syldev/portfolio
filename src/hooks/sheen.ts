import { useEffect } from "react";

/** Card area in square pixels above which the sheen turns into a wide ellipse. */
const WIDE_AREA = 150000;

/**
 * Hook lighting the glass cards under the pointer with a soft sheen that follows it.
 * One delegated listener serves every `[data-slot="card"]`, installed only under a hovering fine
 * pointer. A move writes `--sheen-x` and `--sheen-y` on the card under the pointer once per
 * animation frame, and CSS fades the sheen in and out with the hover, so a card at rest shows none.
 * The card is measured at the same time: a large one gets `data-sheen="wide"`, so that its sheen is
 * a wide ellipse instead of a disc that would fit entirely inside it.
 */
export function useSheen() {
    useEffect(() => {
        if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        let card: HTMLElement | null = null;
        let frame = 0;
        let x = 0;
        let y = 0;

        const paint = () => {
            frame = 0;
            if (!card) return;

            const box = card.getBoundingClientRect();
            if (box.width * box.height > WIDE_AREA) card.dataset.sheen = "wide";
            else delete card.dataset.sheen;
            card.style.setProperty("--sheen-x", `${(x - box.left).toFixed(1)}px`);
            card.style.setProperty("--sheen-y", `${(y - box.top).toFixed(1)}px`);
        };

        const onMove = (event: PointerEvent) => {
            if (event.pointerType === "touch" || !(event.target instanceof Element)) return;

            card = event.target.closest<HTMLElement>('[data-slot="card"]');
            if (!card) return;

            x = event.clientX;
            y = event.clientY;
            if (!frame) frame = requestAnimationFrame(paint);
        };

        document.addEventListener("pointermove", onMove, { passive: true });

        return () => {
            document.removeEventListener("pointermove", onMove);
            cancelAnimationFrame(frame);
        };
    }, []);
}
