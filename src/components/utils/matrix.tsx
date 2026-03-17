"use client";

import * as React from "react";

/**
 * Matrix rain canvas animation overlay.
 * Renders falling katakana/hex characters in green on a transparent canvas.
 * When deactivated, stops spawning new characters and lets existing ones
 * fall off screen before unmounting the canvas.
 *
 * @param props - Component props
 * @param props.active - Whether the animation is currently running
 * @returns The rendered canvas element when active or draining, null otherwise
 */
export function Matrix({
    active,
    onDrainComplete,
}: {
    active: boolean;
    onDrainComplete?: () => void;
}) {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const animationRef = React.useRef<number | undefined>(undefined);
    const activeRef = React.useRef(active);
    const onDrainCompleteRef = React.useRef(onDrainComplete);
    const [visible, setVisible] = React.useState(false);

    activeRef.current = active;
    onDrainCompleteRef.current = onDrainComplete;

    React.useEffect(() => {
        if (active) setVisible(true);
    }, [active]);

    React.useEffect(() => {
        if (!visible) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);

        const chars =
            "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

        let fadeFrames = 0;
        const fadeOutDuration = 20;

        const draw = () => {
            ctx.font = `${fontSize}px monospace`;
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let allOffScreen = true;

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                if (Math.random() > 0.95) {
                    ctx.fillStyle = "#fff";
                } else {
                    ctx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, 0, ${0.8 + Math.random() * 0.2})`;
                }

                ctx.fillText(char, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    if (activeRef.current) {
                        drops[i] = 0;
                    }
                }

                if (y <= canvas.height) {
                    allOffScreen = false;
                }

                drops[i]++;
            }

            if (!activeRef.current && allOffScreen) {
                fadeFrames++;
                if (fadeFrames >= fadeOutDuration) {
                    setVisible(false);
                    onDrainCompleteRef.current?.();
                    return;
                }
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        animationRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen opacity-50"
            aria-hidden="true"
        />
    );
}