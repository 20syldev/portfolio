"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useMotion } from "@/components/utils/motion";

type Segment = { type: "static"; text: string } | { type: "slot"; words: string[] };

interface RotatingProps {
    template: string;
    variants: string[][];
    className?: string;
}

interface RotatingSlotProps {
    options: string[];
    active: number;
    prev: number;
    index: number;
}

/**
 * Parse a template with %s placeholders and variant arrays into segments.
 */
function parseTemplate(template: string, variants: string[][]): Segment[] {
    const segments: Segment[] = [];
    const parts = template.split("%s");

    for (let i = 0; i < parts.length; i++) {
        if (parts[i]) segments.push({ type: "static", text: parts[i] });
        if (i < parts.length - 1) {
            segments.push({ type: "slot", words: variants.map((v) => v[i]) });
        }
    }

    return segments;
}

/**
 * Rotating text with 3D barrel effect between word variants.
 * Each rotating slot animates with a cascade delay for a wave effect.
 */
export function Rotating({ template, variants, className = "" }: RotatingProps) {
    const [{ active, prev }, setRotation] = useState({ active: 0, prev: 0 });
    const { enabled: motionEnabled } = useMotion();
    const segments = useMemo(() => parseTemplate(template, variants), [template, variants]);

    useEffect(() => {
        if (!motionEnabled) {
            setRotation({ active: 0, prev: 0 });
            return;
        }

        const timer = setInterval(
            () =>
                setRotation((s) => ({ prev: s.active, active: (s.active + 1) % variants.length })),
            5000
        );
        return () => clearInterval(timer);
    }, [motionEnabled, variants.length]);

    let slotIndex = 0;

    return (
        <p className={`overflow-hidden ${className}`} data-nosnippet>
            {segments.map((segment, i) =>
                segment.type === "static" ? (
                    <span key={i}>{segment.text}</span>
                ) : (
                    <RotatingSlot
                        key={i}
                        options={segment.words}
                        active={active}
                        prev={prev}
                        index={slotIndex++}
                    />
                )
            )}
        </p>
    );
}

const duration = "600ms";
const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

function RotatingSlot({ options, active, prev, index }: RotatingSlotProps) {
    const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [widths, setWidths] = useState<number[] | null>(null);
    const [instant, setInstant] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const optionsKey = options.join("|");

    useEffect(() => {
        const measure = () => {
            const measured = measureRefs.current.map((r) =>
                r ? r.getBoundingClientRect().width + 0.5 : 0
            );
            if (measured.some((w) => w > 0)) {
                clearTimeout(timerRef.current);
                setInstant(true);
                setWidths(measured);
                timerRef.current = setTimeout(() => setInstant(false), 50);
            }
        };

        measure();
        document.fonts.ready.then(measure);

        const observer = new ResizeObserver(measure);
        measureRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
            clearTimeout(timerRef.current);
        };
    }, [optionsKey]);

    const delay = `${index * 100}ms`;

    return (
        <span
            className="relative inline-block overflow-hidden align-bottom"
            style={{
                height: "1.25rem",
                width: widths ? widths[active] : undefined,
                transition: instant ? "none" : `width ${duration} ${easing} ${delay}`,
                perspective: "200px",
            }}
        >
            {/* Off-screen measurement spans — always have intrinsic text width */}
            <span
                className="absolute whitespace-nowrap"
                style={{ visibility: "hidden", pointerEvents: "none" }}
                aria-hidden="true"
            >
                {options.map((word, i) => (
                    <span
                        key={i}
                        ref={(el) => {
                            measureRefs.current[i] = el;
                        }}
                        className="inline-block"
                    >
                        {word}
                    </span>
                ))}
            </span>

            {/* Ghost: invisible, in-flow, for auto-sizing before first measurement */}
            <span className="invisible inline-block whitespace-nowrap" aria-hidden="true">
                {options[active]}
            </span>

            {/* Rotating display words */}
            {options.map((word, i) => {
                const isActive = i === active;
                const wasActive = i === prev && i !== active;

                return (
                    <span
                        key={i}
                        className="absolute left-0 top-0 whitespace-nowrap"
                        style={{
                            transform: isActive
                                ? "rotateX(0deg)"
                                : wasActive
                                  ? "rotateX(-90deg)"
                                  : "rotateX(90deg)",
                            opacity: isActive ? 1 : 0,
                            transformOrigin: isActive || wasActive ? "center bottom" : "center top",
                            transition: `transform ${duration} ${easing} ${delay}, opacity ${duration} ${easing} ${delay}`,
                        }}
                    >
                        {word}
                    </span>
                );
            })}
        </span>
    );
}