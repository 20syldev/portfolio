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

const shake = {
    // Detection
    threshold: 12, // Net acceleration of a counted spike (m/s²)
    minGap: 50, // Debounce between two counted reversals (ms)
    graceGap: 700, // Idle time that forgets the current charge (ms)
    planar: 0.3, // In-plane share below which a shake reads as front-to-back
    gravityFactor: 0.8, // Low-pass factor isolating gravity from raw readings
    // Charge
    duration: 3000, // Continuous shaking needed to activate (ms)
    reversals: 10, // Reversals required over the full duration
    stopReversals: 3, // Reversals needed to switch it back off
    cooldown: 2500, // Silence after a trigger (ms)
    // Response
    full: 20, // Intensity at which the response saturates (m/s²)
    maxForce: 3, // Cap on how much a hard shake outweighs a soft one
    pace: 170, // Reversal interval treated as a neutral pace (ms)
    minPace: 1, // Pace only ever rewards, never penalises a lone heave
    maxPace: 2.5, // Cap on how much a fast shake outweighs a slow one
};

type Trigger = "konami" | "shake" | "tap";

/**
 * Element driven by the shake detector while the user keeps shaking.
 * Registered by the hero so the logo reacts before the effect fires.
 */
export interface ShakeTarget {
    ready: () => boolean;
    nudge: (x: number, y: number, progress: number, force: number) => void;
    launch: (x: number, y: number, force: number) => void;
}

interface KonamiContextType {
    toggle: (source?: Trigger) => void;
    activated: boolean;
    trigger: Trigger | null;
    shakeTargetRef: React.RefObject<ShakeTarget | null>;
}

export const KonamiContext = React.createContext<KonamiContextType>({
    toggle: () => {},
    activated: false,
    trigger: null,
    shakeTargetRef: { current: null },
});

/**
 * Provider for Konami Code Easter egg.
 * Listens for the Konami sequence (↑↑↓↓←→←→BA) and toggles Matrix rain effect.
 * Also supports mobile triggers: multi-tap on logo (via useMultiTap) and device shake.
 * Shaking must alternate direction for three straight seconds to switch it on, nudging
 * the registered target harder as the charge builds, so a jolt can never trigger it.
 * Switching it back off only takes a flick, since a false positive is harmless there.
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
    const shakeTargetRef = React.useRef<ShakeTarget | null>(null);
    const activatedRef = React.useRef(false);

    const toggle = React.useCallback((source?: Trigger) => {
        setActivated((prev) => {
            if (!prev && source) setTrigger(source);
            if (prev) setTrigger(null);
            return !prev;
        });
    }, []);
    const ctx = React.useMemo(
        () => ({ toggle, activated, trigger, shakeTargetRef }),
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

        const gravity = { x: 0, y: 0, z: 0 };
        let primed = false;

        let runStart = 0;
        let lastSpike = 0;
        let reversals = 0;
        let mutedUntil = 0;
        let lastX = 0,
            lastY = 0,
            lastZ = 0;
        let aimed = false;

        const toScreen = (x: number, y: number) => {
            const rad = ((screen.orientation?.angle ?? 0) * Math.PI) / 180;
            const cos = Math.cos(rad),
                sin = Math.sin(rad);
            return { x: y * sin - x * cos, y: x * sin + y * cos };
        };

        const handleMotion = (e: DeviceMotionEvent) => {
            const now = Date.now();
            if (now < mutedUntil || document.body.classList.contains("no-motion")) return;

            let ax: number, ay: number, az: number;
            const linear = e.acceleration;
            if (linear && (linear.x !== null || linear.y !== null || linear.z !== null)) {
                ax = linear.x ?? 0;
                ay = linear.y ?? 0;
                az = linear.z ?? 0;
            } else {
                const raw = e.accelerationIncludingGravity;
                if (!raw) return;
                const rx = raw.x ?? 0,
                    ry = raw.y ?? 0,
                    rz = raw.z ?? 0;
                if (!primed) {
                    gravity.x = rx;
                    gravity.y = ry;
                    gravity.z = rz;
                    primed = true;
                    return;
                }
                gravity.x = shake.gravityFactor * gravity.x + (1 - shake.gravityFactor) * rx;
                gravity.y = shake.gravityFactor * gravity.y + (1 - shake.gravityFactor) * ry;
                gravity.z = shake.gravityFactor * gravity.z + (1 - shake.gravityFactor) * rz;
                ax = rx - gravity.x;
                ay = ry - gravity.y;
                az = rz - gravity.z;
            }

            const magnitude = Math.sqrt(ax ** 2 + ay ** 2 + az ** 2);
            if (magnitude < shake.threshold || now - lastSpike < shake.minGap) return;

            const gap = now - lastSpike;
            if (gap > shake.graceGap) {
                runStart = 0;
                reversals = 0;
                aimed = false;
            }

            const x = ax / magnitude,
                y = ay / magnitude,
                z = az / magnitude;

            const opposing = !aimed || x * lastX + y * lastY + z * lastZ < 0;
            lastX = x;
            lastY = y;
            lastZ = z;
            aimed = true;
            lastSpike = now;
            if (!opposing) return;

            if (!runStart) runStart = now;
            reversals++;

            const armed = activatedRef.current;
            const target = shakeTargetRef.current;

            const pace = Math.max(
                shake.minPace,
                Math.min(shake.maxPace, shake.pace / Math.max(gap, shake.minGap))
            );
            const reach = Math.max(
                0,
                Math.min(1, (magnitude - shake.threshold) / (shake.full - shake.threshold))
            );
            const force = shake.maxForce * reach * reach * (3 - 2 * reach) * pace;
            const progress = armed ? 1 : Math.min(1, (now - runStart) / shake.duration);

            const planar = Math.hypot(x, y);
            const dir =
                planar > shake.planar
                    ? toScreen(x / planar, y / planar)
                    : { x: 0, y: Math.sign(z) || 1 };

            if (target?.ready()) target.nudge(dir.x, dir.y, progress, force);
            if (progress < 1 || reversals < (armed ? shake.stopReversals : shake.reversals)) return;

            runStart = 0;
            reversals = 0;
            aimed = false;
            mutedUntil = now + shake.cooldown;
            if (!armed && target?.ready()) target.launch(dir.x, dir.y, force);
            toggle("shake");
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
        activatedRef.current = activated;
        if (activated) {
            if (previousThemeRef.current === undefined) previousThemeRef.current = themeRef.current;
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