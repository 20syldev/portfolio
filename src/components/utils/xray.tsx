"use client";

import * as React from "react";

interface XrayContextType {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const XrayContext = React.createContext<XrayContextType | undefined>(undefined);

/**
 * Hook to access X-Ray context state.
 * Provides enabled state and setter for toggling CSS debug outlines.
 *
 * @returns X-Ray context with enabled state and setter
 * @throws Error if used outside XrayProvider
 */
export function useXray() {
    const context = React.useContext(XrayContext);
    if (context === undefined) {
        throw new Error("useXray must be used within an XrayProvider");
    }
    return context;
}

/**
 * Provider for X-Ray mode.
 * Toggles CSS debug outlines on all elements via Alt+X shortcut.
 * Persists state in localStorage.
 *
 * @param props - Provider props
 * @param props.children - Child components to wrap with X-Ray context
 * @returns The rendered provider with X-Ray context
 */
export function XrayProvider({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = React.useState(false);

    React.useEffect(() => {
        const stored = localStorage.getItem("xray");
        if (stored !== null) setEnabled(JSON.parse(stored) as boolean);
    }, []);

    React.useEffect(() => {
        localStorage.setItem("xray", JSON.stringify(enabled));
    }, [enabled]);

    React.useEffect(() => {
        if (enabled) document.body.classList.add("xray");
        else document.body.classList.remove("xray");

        return () => {
            document.body.classList.remove("xray");
        };
    }, [enabled]);

    return (
        <XrayContext.Provider value={{ enabled, setEnabled }}>
            {children}
            {enabled && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-black/80 px-4 py-1.5 text-xs font-mono text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)] backdrop-blur-sm">
                        X-RAY
                    </div>
                </div>
            )}
        </XrayContext.Provider>
    );
}