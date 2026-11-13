import { type RefObject, useEffect } from "react";

const reach = 64;

/**
 * Hook lighting an element under the pointer with a soft glow.
 * Installed only under a hovering fine pointer. A move far from the element writes no style, and
 * near it one animation frame writes the pointer position and a strength that CSS then fades.
 *
 * @param ref - Ref to the glass element that receives `--glass-x`, `--glass-y` and `--glass-glow`
 */
export function useGlow(ref: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        const plain = matchMedia(
            "(prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)"
        );
        let box: DOMRect | null = null;
        let frame = 0;
        let lit = false;
        let x = 0;
        let y = 0;
        let strength = 0;

        const paint = () => {
            frame = 0;
            box = el.getBoundingClientRect();

            if (strength <= 0) {
                lit = false;
                el.style.setProperty("--glass-glow", "0");
                return;
            }

            lit = true;
            el.style.setProperty("--glass-x", `${(x - box.left).toFixed(1)}px`);
            el.style.setProperty("--glass-y", `${(y - box.top).toFixed(1)}px`);
            el.style.setProperty("--glass-glow", strength.toFixed(2));
        };

        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };

        const onMove = (event: PointerEvent) => {
            if (event.pointerType === "touch" || plain.matches) return;

            box ??= el.getBoundingClientRect();
            const dx = Math.max(box.left - event.clientX, 0, event.clientX - box.right);
            const dy = Math.max(box.top - event.clientY, 0, event.clientY - box.bottom);
            const distance = Math.hypot(dx, dy);
            if (distance >= reach && !lit) return;

            x = event.clientX;
            y = event.clientY;
            strength = distance >= reach ? 0 : 1 - distance / reach;
            schedule();
        };

        const onLeave = () => {
            strength = 0;
            if (lit) schedule();
        };

        const onResize = () => {
            box = null;
        };

        const observer = new ResizeObserver(onResize);
        observer.observe(el);
        addEventListener("resize", onResize);
        addEventListener("blur", onLeave);
        document.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);

        return () => {
            observer.disconnect();
            removeEventListener("resize", onResize);
            removeEventListener("blur", onLeave);
            document.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            cancelAnimationFrame(frame);
            for (const name of ["--glass-x", "--glass-y", "--glass-glow"]) {
                el.style.removeProperty(name);
            }
        };
    }, [ref]);
}
