"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { MatrixRain } from "@/components/utils/matrix";

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

/**
 * Provider for Konami Code Easter egg.
 * Listens for the Konami sequence (↑↑↓↓←→←→BA) and toggles Matrix rain effect.
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
                    setActivated((prev) => !prev);
                }
            } else {
                indexRef.current = 0;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

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
        <>
            {children}
            <MatrixRain active={activated} />
        </>
    );
}