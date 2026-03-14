"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { Matrix } from "@/components/utils/matrix";

const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

const tapCount = 7;
const tapWindow = 3000;
const shakeThreshold = 15;
const shakeCount = 3;
const shakeWindow = 2000;

const KonamiContext = React.createContext<{ toggle: () => void }>({ toggle: () => {} });

/**
 * Provider for Konami Code Easter egg.
 * Listens for the Konami sequence (↑↑↓↓←→←→BA) and toggles Matrix rain effect.
 * Also supports mobile triggers: multi-tap on logo (via useKonamiTap) and device shake.
 * Forces dark theme when activated.
 *
 * @param props - Provider props
 * @param props.children - Child components to wrap
 * @returns The rendered provider with Matrix rain overlay when activated
 */
export function KonamiProvider({ children }: { children: React.ReactNode }) {
    const [activated, setActivated] = React.useState(false);
    const indexRef = React.useRef(0);
    const { theme, setTheme } = useTheme();
    const themeRef = React.useRef(theme);
    const setThemeRef = React.useRef(setTheme);
    const previousThemeRef = React.useRef<string | undefined>(undefined);

    const toggle = React.useCallback(() => setActivated((prev) => !prev), []);
    const ctx = React.useMemo(() => ({ toggle }), [toggle]);

    React.useEffect(() => {
        themeRef.current = theme;
        setThemeRef.current = setTheme;
    }, [theme, setTheme]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === konamiSequence[indexRef.current]) {
                indexRef.current++;
                if (indexRef.current === konamiSequence.length) {
                    indexRef.current = 0;
                    toggle();
                }
            } else {
                indexRef.current = 0;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [toggle]);

    React.useEffect(() => {
        if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) return;

        const shakes: number[] = [];

        const handleMotion = (e: DeviceMotionEvent) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc) return;

            const magnitude = Math.sqrt((acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2);

            if (magnitude - 9.8 > shakeThreshold) {
                const now = Date.now();
                shakes.push(now);
                while (shakes.length > 0 && now - shakes[0] > shakeWindow) shakes.shift();
                if (shakes.length >= shakeCount) {
                    shakes.length = 0;
                    toggle();
                }
            }
        };

        window.addEventListener("devicemotion", handleMotion);
        return () => window.removeEventListener("devicemotion", handleMotion);
    }, [toggle]);

    React.useEffect(() => {
        if (activated) {
            previousThemeRef.current = themeRef.current;
            setThemeRef.current("dark");
        } else if (previousThemeRef.current) {
            setThemeRef.current(previousThemeRef.current);
            previousThemeRef.current = undefined;
        }
    }, [activated]);

    return (
        <KonamiContext.Provider value={ctx}>
            {children}
            <Matrix active={activated} />
        </KonamiContext.Provider>
    );
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
                toggle();
            }
        };

        el.addEventListener("click", handleClick);
        return () => el.removeEventListener("click", handleClick);
    }, [ref, toggle]);
}