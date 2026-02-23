"use client";

import { Command } from "lucide-react";
import * as React from "react";

import { Notification } from "@/components/ui/notification";
import { version } from "@root/package.json";

interface CursorContextType {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const CursorContext = React.createContext<CursorContextType | undefined>(undefined);

/**
 * Hook to access custom cursor context state.
 * Provides enabled state and setter for toggling the custom cursor.
 *
 * @returns Cursor context with enabled state and setter
 * @throws Error if used outside CursorProvider
 */
export function useCursor() {
    const context = React.useContext(CursorContext);
    if (context === undefined) {
        throw new Error("useCursor must be used within a CursorProvider");
    }
    return context;
}

/**
 * Provider for custom cursor functionality.
 * Manages cursor visibility, keyboard shortcuts (Alt+C), and localStorage persistence.
 *
 * @param props - Provider props
 * @param props.children - Child components to wrap with cursor context
 * @returns The rendered provider with cursor context and custom cursor overlay
 */
export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = React.useState(() => {
        if (typeof window === "undefined") return false;
        const stored = localStorage.getItem("cursor");
        return stored !== null ? (JSON.parse(stored) as boolean) : false;
    });
    const [showNotification, setShowNotification] = React.useState(false);
    const [isNotificationHiding, setIsNotificationHiding] = React.useState(false);

    const dismissNotification = React.useCallback(() => {
        setIsNotificationHiding(true);
        setTimeout(() => {
            setShowNotification(false);
            setIsNotificationHiding(false);
        }, 300);
    }, []);

    const handleSetEnabled = React.useCallback(
        (value: boolean) => {
            if (!value) dismissNotification();
            setEnabled(value);
        },
        [dismissNotification]
    );

    React.useEffect(() => {
        const storedCursor = localStorage.getItem("cursor");
        const storedVersion = localStorage.getItem("version");
        const isCursorEnabled = storedCursor !== null && JSON.parse(storedCursor) === true;
        const isNewVersion = storedVersion === null || storedVersion !== version;

        if (isCursorEnabled && isNewVersion) {
            setTimeout(() => setShowNotification(true), 3000);
        }

        const timer = setTimeout(() => {
            localStorage.setItem("version", version);
            dismissNotification();
        }, 10000);

        return () => clearTimeout(timer);
    }, [dismissNotification]);

    React.useEffect(() => {
        localStorage.setItem("cursor", JSON.stringify(enabled));
    }, [enabled]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === "c") {
                e.preventDefault();
                handleSetEnabled(!enabled);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [enabled, handleSetEnabled]);

    React.useEffect(() => {
        if (enabled) document.body.classList.add("cursor-none");
        else document.body.classList.remove("cursor-none");

        return () => {
            document.body.classList.remove("cursor-none");
        };
    }, [enabled]);

    return (
        <CursorContext.Provider value={{ enabled, setEnabled: handleSetEnabled }}>
            {children}
            <Cursor />
            {showNotification && (
                <Notification
                    onDismiss={() => setShowNotification(false)}
                    isHiding={isNotificationHiding}
                >
                    Vous pouvez désactiver le curseur personnalisé avec{" "}
                    <kbd className="font-mono text-xs bg-muted px-1 py-0.5 rounded">ALT + C</kbd>,
                    via le menu{" "}
                    <kbd className="font-mono text-xs bg-muted px-1 py-0.5 rounded">CTRL + K</kbd>{" "}
                    ou avec{" "}
                    <kbd className="inline-flex items-center gap-1 font-mono text-xs bg-muted px-1 py-0.5 rounded">
                        <Command className="w-3 h-3" />K
                    </kbd>
                    .
                </Notification>
            )}
        </CursorContext.Provider>
    );
}

/**
 * Custom cursor component with smooth following animation.
 * Displays a dot and circle cursor, hidden on touch devices.
 *
 * @returns The rendered custom cursor elements, or null if disabled or on touch device
 */
function Cursor() {
    const { enabled } = useCursor();
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [circlePosition, setCirclePosition] = React.useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = React.useState(false);
    const [isTouchDevice, setIsTouchDevice] = React.useState(false);
    const animationRef = React.useRef<number | undefined>(undefined);

    React.useEffect(() => {
        // Detect if device supports touch
        const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(hasTouch);
    }, []);

    React.useEffect(() => {
        if (!enabled) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, [enabled, isVisible]);

    React.useEffect(() => {
        if (!enabled) return;

        const animate = () => {
            setCirclePosition((prev) => {
                const dx = mousePosition.x - prev.x;
                const dy = mousePosition.y - prev.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 0.1) return mousePosition;

                const easing = 0.15;
                return {
                    x: prev.x + dx * easing,
                    y: prev.y + dy * easing,
                };
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [mousePosition, enabled, isVisible]);

    if (!enabled || !isVisible || isTouchDevice) return null;

    return (
        <>
            <div
                className="fixed top-0 left-0 w-2 h-2 bg-foreground rounded-full pointer-events-none z-[9999]"
                style={{
                    transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px)`,
                }}
            />
            <div
                className="fixed top-0 left-0 w-8 h-8 border-2 border-foreground rounded-full pointer-events-none z-[9999]"
                style={{
                    transform: `translate(${circlePosition.x - 16}px, ${circlePosition.y - 16}px)`,
                }}
            />
        </>
    );
}