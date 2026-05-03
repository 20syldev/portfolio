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

const shakeThreshold = 10;
const shakeCount = 2;
const shakeWindow = 1500;
const shakeMinGap = 300;

type Trigger = "konami" | "shake" | "tap";

interface KonamiContextType {
    toggle: (source?: Trigger) => void;
    activated: boolean;
    trigger: Trigger | null;
    shakeVectorRef: React.RefObject<{ x: number; y: number } | null>;
}

export const KonamiContext = React.createContext<KonamiContextType>({
    toggle: () => {},
    activated: false,
    trigger: null,
    shakeVectorRef: { current: null },
});

/**
 * Provider for Konami Code Easter egg.
 * Listens for the Konami sequence (↑↑↓↓←→←→BA) and toggles Matrix rain effect.
 * Also supports mobile triggers: multi-tap on logo (via useMultiTap) and device shake.
 * Forces dark theme when activated.
 *
 * @param props - Provider props
 * @param props.children - Child components to wrap
 * @returns The rendered provider with Matrix rain overlay when activated
 */
export function KonamiProvider({ children }: { children: React.ReactNode }) {
    const [activated, setActivated] = React.useState(false);
    const [trigger, setTrigger] = React.useState<Trigger | null>(null);
    const { theme, setTheme } = useTheme();
    const indexRef = React.useRef(0);
    const themeRef = React.useRef(theme);
    const setThemeRef = React.useRef(setTheme);
    const previousThemeRef = React.useRef<string | undefined>(undefined);
    const shakeVectorRef = React.useRef<{ x: number; y: number } | null>(null);

    const toggle = React.useCallback((source?: Trigger) => {
        setActivated((prev) => {
            if (!prev && source) setTrigger(source);
            if (prev) setTrigger(null);
            return !prev;
        });
    }, []);
    const ctx = React.useMemo(
        () => ({ toggle, activated, trigger, shakeVectorRef }),
        [toggle, activated, trigger]
    );

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
                    toggle("konami");
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
                if (shakes.length > 0 && now - shakes[shakes.length - 1] < shakeMinGap) return;
                shakes.push(now);
                while (shakes.length > 0 && now - shakes[0] > shakeWindow) shakes.shift();
                if (shakes.length >= shakeCount) {
                    shakes.length = 0;
                    shakeVectorRef.current = { x: acc.x ?? 0, y: acc.y ?? 0 };
                    toggle("shake");
                }
            }
        };

        window.addEventListener("devicemotion", handleMotion);
        return () => window.removeEventListener("devicemotion", handleMotion);
    }, [toggle]);

    const restoreTheme = React.useCallback(() => {
        if (previousThemeRef.current) {
            setThemeRef.current(previousThemeRef.current);
            previousThemeRef.current = undefined;
        }
    }, []);

    React.useEffect(() => {
        if (activated) {
            previousThemeRef.current = themeRef.current;
            setThemeRef.current("dark");
        }
    }, [activated]);

    return (
        <KonamiContext.Provider value={ctx}>
            {children}
            <Matrix active={activated} onDrainComplete={restoreTheme} />
        </KonamiContext.Provider>
    );
}