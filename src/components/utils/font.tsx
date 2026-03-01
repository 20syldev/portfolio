"use client";

import * as React from "react";

import { defaultFontId, getFontById, getFontCssValue } from "@/lib/fonts";

interface FontContextType {
    font: string;
    setFont: (id: string) => void;
    fontSize: number;
    setFontSize: (size: number) => void;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}

const FontContext = React.createContext<FontContextType | undefined>(undefined);

/**
 * Hook to access font context state.
 * Provides current font id, setter, and dialog state.
 *
 * @returns Font context with current font and controls
 * @throws Error if used outside FontProvider
 */
export function useFont() {
    const context = React.useContext(FontContext);
    if (context === undefined) {
        throw new Error("useFont must be used within a FontProvider");
    }
    return context;
}

const defaultFontSize = 100;
const minFontSize = 80;
const maxFontSize = 180;

export { defaultFontSize, minFontSize, maxFontSize };

/**
 * Apply the selected font to the body element.
 * Uses inline style to override Tailwind's compiled font-sans utility.
 * For the default font, removes the override to let the utility class apply.
 */
function applyFont(fontId: string) {
    const config = getFontById(fontId);
    if (!config) return;

    if (fontId === defaultFontId) {
        document.body.style.removeProperty("font-family");
    } else {
        document.body.style.fontFamily = getFontCssValue(config);
    }
}

function applyFontSize(size: number) {
    if (size === defaultFontSize) {
        document.documentElement.style.removeProperty("font-size");
    } else {
        document.documentElement.style.fontSize = `${size}%`;
    }
}

/**
 * Provider for font selection functionality.
 * Manages font preference, keyboard shortcut (Alt+P), and localStorage persistence.
 *
 * @param props - Provider props
 * @param props.children - Child components to wrap with font context
 * @returns The rendered provider with font context
 */
export function FontProvider({ children }: { children: React.ReactNode }) {
    const [font, setFontState] = React.useState(() => {
        if (typeof window === "undefined") return defaultFontId;
        const stored = localStorage.getItem("font");
        return stored && getFontById(stored) ? stored : defaultFontId;
    });
    const [fontSize, setFontSizeState] = React.useState(() => {
        if (typeof window === "undefined") return defaultFontSize;
        const stored = localStorage.getItem("fontSize");
        if (!stored) return defaultFontSize;
        const parsed = parseInt(stored, 10);
        return parsed >= minFontSize && parsed <= maxFontSize ? parsed : defaultFontSize;
    });
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const setFont = React.useCallback((id: string) => {
        if (!getFontById(id)) return;
        setFontState(id);
    }, []);

    const setFontSize = React.useCallback((size: number) => {
        const clamped = Math.min(maxFontSize, Math.max(minFontSize, size));
        setFontSizeState(clamped);
    }, []);

    React.useEffect(() => {
        localStorage.setItem("font", font);
        applyFont(font);
    }, [font]);

    React.useEffect(() => {
        localStorage.setItem("fontSize", String(fontSize));
        applyFontSize(fontSize);
    }, [fontSize]);

    React.useEffect(() => {
        applyFont(font);
        applyFontSize(fontSize);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === "p") {
                e.preventDefault();
                setDialogOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <FontContext.Provider
            value={{ font, setFont, fontSize, setFontSize, dialogOpen, setDialogOpen }}
        >
            {children}
        </FontContext.Provider>
    );
}