import { useRef, useState } from "react";

/**
 * Clamps content to 2 lines with ellipsis, and expands smoothly on hover.
 * On mouse leave, waits for the collapse transition to complete before
 * re-applying the clamp so the animation is visible in both directions.
 *
 * @returns Refs, state and event handlers to spread onto the wrapper and paragraph
 */
export function useExpand() {
    const [expanded, setExpanded] = useState(false);
    const [clamped, setClamped] = useState(true);
    const [expandedHeight, setExpandedHeight] = useState<number>(999);
    const wrapRef = useRef<HTMLDivElement>(null);
    const pRef = useRef<HTMLParagraphElement>(null);

    const onMouseEnter = () => {
        if (pRef.current) setExpandedHeight(pRef.current.scrollHeight);
        setClamped(false);
        setExpanded(true);
    };

    const onMouseLeave = () => {
        setExpanded(false);
        const el = wrapRef.current;
        if (!el) return;
        const onEnd = () => {
            setClamped(true);
            el.removeEventListener("transitionend", onEnd);
        };
        el.addEventListener("transitionend", onEnd);
    };

    return { expanded, clamped, expandedHeight, wrapRef, pRef, onMouseEnter, onMouseLeave };
}