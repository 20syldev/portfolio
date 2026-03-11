"use client";

import * as React from "react";

interface MotionContextType {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const MotionContext = React.createContext<MotionContextType | undefined>(undefined);

/**
 * Hook to access motion context state.
 * Provides enabled state and setter for toggling all animations.
 *
 * @returns Motion context with enabled state and setter
 * @throws Error if used outside MotionProvider
 */
export function useMotion() {
    const context = React.useContext(MotionContext);
    if (context === undefined) {
        throw new Error("useMotion must be used within a MotionProvider");
    }
    return context;
}

/**
 * Provider for motion/animations control.
 * Disables all CSS animations and transitions site-wide via Alt+M shortcut.
 * Persists state in localStorage.
 *
 * @param props - Provider props
 * @param props.children - Child components to wrap with motion context
 * @returns The rendered provider with motion context
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = React.useState(true);
    const mounted = React.useRef(false);

    React.useEffect(() => {
        const stored = localStorage.getItem("motion");
        if (stored !== null) setEnabled(JSON.parse(stored) as boolean);
        mounted.current = true;
    }, []);

    React.useEffect(() => {
        if (!mounted.current) return;
        localStorage.setItem("motion", JSON.stringify(enabled));
    }, [enabled]);

    React.useEffect(() => {
        if (enabled) document.body.classList.remove("no-motion");
        else document.body.classList.add("no-motion");

        return () => {
            document.body.classList.remove("no-motion");
        };
    }, [enabled]);

    return (
        <MotionContext.Provider value={{ enabled, setEnabled }}>{children}</MotionContext.Provider>
    );
}