"use client";

import * as React from "react";

import { KonamiContext } from "@/components/utils/konami";

const tapCount = 7;
const tapWindow = 3000;

/**
 * Hook to access Konami activation state and trigger.
 */
export function useKonami() {
    return React.useContext(KonamiContext);
}

/**
 * Hook that adds multi-tap Konami activation to an element.
 * Triggers after 7 taps within 3 seconds.
 *
 * @param ref - Ref to the element to attach tap detection to
 */
export function useMultiTap(ref: React.RefObject<HTMLElement | null>) {
    const { toggle } = React.useContext(KonamiContext);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const taps: number[] = [];

        const handleClick = () => {
            const now = Date.now();
            taps.push(now);
            while (taps.length > 0 && now - taps[0] > tapWindow) taps.shift();
            if (taps.length >= tapCount) {
                taps.length = 0;
                toggle("tap");
            }
        };

        el.addEventListener("click", handleClick);
        return () => el.removeEventListener("click", handleClick);
    }, [ref, toggle]);
}