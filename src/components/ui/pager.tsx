import { type CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface PagerDotProps {
    label: string;
    onClick: () => void;
    className?: string;
    style?: CSSProperties;
}

/**
 * Pager dot of a mobile carousel.
 * The button is a 24px square so it stays easy to tap and passes the target size check, and
 * the visible dot is a smaller span centered inside it.
 *
 * @param props - PagerDot props
 * @param props.label - Accessible name of the button
 * @param props.onClick - Called when the dot is pressed
 * @param props.className - Classes of the visible dot, such as its size and colour
 * @param props.style - Inline style of the visible dot, for a computed width
 * @returns The rendered dot button
 */
export function PagerDot({ label, onClick, className, style }: PagerDotProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex h-6 min-w-6 cursor-pointer items-center justify-center"
        >
            <span className={cn("block rounded-full transition-all", className)} style={style} />
        </button>
    );
}
