"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import * as React from "react";

import { LazyContactDialog, LazyShortcutsDialog } from "@/components/dialogs/lazy";
import { Button } from "@/components/ui/button";
import { useCursor } from "@/components/utils/cursor";
import { useFont } from "@/components/utils/font";
import { useMotion } from "@/components/utils/motion";
import { useXray } from "@/components/utils/xray";
import { useOnce } from "@/hooks/once";

const loadPalette = () => import("@/components/utils/palette").then((m) => m.Palette);

const Palette = dynamic(loadPalette, { ssr: false });

/**
 * Context for sharing command dialog state
 */
const CommandContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
} | null>(null);

/**
 * Hook to access command dialog state
 */
export function useCommand() {
    const context = React.useContext(CommandContext);
    if (!context) {
        throw new Error("useCommand must be used within a CommandProvider");
    }
    return context;
}

/**
 * Provider for command dialog state
 */
export function CommandProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);

    const setOpenWrapper = React.useCallback((value: boolean | ((prev: boolean) => boolean)) => {
        if (typeof value === "function") {
            setOpen(value);
        } else {
            setOpen(value);
        }
    }, []);

    return (
        <CommandContext.Provider value={{ open, setOpen: setOpenWrapper }}>
            {children}
        </CommandContext.Provider>
    );
}

/**
 * Search button that opens the command dialog.
 * Starts fetching the palette on hover or focus so it is ready by the time of the click.
 *
 * @returns The rendered search button
 */
export function SearchButton() {
    const { setOpen } = useCommand();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            onPointerEnter={loadPalette}
            onFocus={loadPalette}
            aria-label="Rechercher"
            className="h-9 w-9"
        >
            <Search className="h-4 w-4" />
        </Button>
    );
}

/**
 * Global keyboard shortcuts and dialogs of the command palette.
 * Stays in the initial bundle for the shortcuts; the palette and both dialogs load on first use.
 *
 * @returns The rendered shortcut listener and lazy dialogs
 */
export function CommandMenu() {
    const { open, setOpen } = useCommand();
    const [contactOpen, setContactOpen] = React.useState(false);
    const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
    const { theme, setTheme } = useTheme();
    const { enabled: cursorEnabled, setEnabled: setCursorEnabled } = useCursor();
    const { dialogOpen: fontDialogOpen, setDialogOpen: setFontDialogOpen } = useFont();
    const { enabled: motionEnabled, setEnabled: setMotionEnabled } = useMotion();
    const { enabled: xrayEnabled, setEnabled: setXrayEnabled } = useXray();
    const paletteLoaded = useOnce(open);

    const cycleTheme = React.useCallback(
        () => setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system"),
        [theme, setTheme]
    );

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prevOpen) => !prevOpen);
                return;
            }
            if (e.altKey) {
                switch (e.key) {
                    case "/":
                    case ":":
                        e.preventDefault();
                        setShortcutsOpen((prev) => !prev);
                        break;
                    case "c":
                        e.preventDefault();
                        setCursorEnabled(!cursorEnabled);
                        break;
                    case "p":
                        e.preventDefault();
                        setFontDialogOpen(!fontDialogOpen);
                        break;
                    case "t":
                        e.preventDefault();
                        cycleTheme();
                        break;
                    case "m":
                        e.preventDefault();
                        setMotionEnabled(!motionEnabled);
                        break;
                    case "x":
                        e.preventDefault();
                        setXrayEnabled(!xrayEnabled);
                        break;
                }
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [
        setOpen,
        cursorEnabled,
        setCursorEnabled,
        fontDialogOpen,
        setFontDialogOpen,
        motionEnabled,
        setMotionEnabled,
        cycleTheme,
        xrayEnabled,
        setXrayEnabled,
    ]);

    return (
        <>
            {paletteLoaded && (
                <Palette
                    onContact={() => setContactOpen(true)}
                    onShortcuts={() => setShortcutsOpen(true)}
                />
            )}
            <LazyContactDialog open={contactOpen} onOpenChange={setContactOpen} />
            <LazyShortcutsDialog
                open={shortcutsOpen}
                onOpenChange={setShortcutsOpen}
                actions={{
                    cursor: () => setCursorEnabled(!cursorEnabled),
                    font: () => setFontDialogOpen(true),
                    theme: cycleTheme,
                    motion: () => setMotionEnabled(!motionEnabled),
                    xray: () => setXrayEnabled(!xrayEnabled),
                    command: () => setOpen(true),
                }}
            />
        </>
    );
}