"use client";

import * as React from "react";

interface CursorContextType {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const CursorContext = React.createContext<CursorContextType | undefined>(undefined);

export function useCursor() {
    const context = React.useContext(CursorContext);
    if (context === undefined) {
        throw new Error("useCursor must be used within a CursorProvider");
    }
    return context;
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = React.useState(true);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === "c") {
                e.preventDefault();
                setEnabled((prev) => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    React.useEffect(() => {
        if (enabled) {
            document.body.classList.add("cursor-none");
        } else {
            document.body.classList.remove("cursor-none");
        }

        return () => {
            document.body.classList.remove("cursor-none");
        };
    }, [enabled]);

    return (
        <CursorContext.Provider value={{ enabled, setEnabled }}>
            {children}
            <Cursor />
        </CursorContext.Provider>
    );
}

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
            if (!isVisible) {
                setIsVisible(true);
            }
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

                if (distance < 0.1) {
                    return mousePosition;
                }

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
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
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