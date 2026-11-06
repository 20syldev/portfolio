import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Classes that widen a dialog to the portrait phone and let its height follow the turned content,
 * up to the height of the screen, with one row for the stage and one for an optional toolbar.
 */
export const sidewaysFrame =
    "max-sm:portrait:h-auto max-sm:portrait:max-h-[calc(100dvh-1rem)] max-sm:portrait:w-[calc(100vw-1rem)] max-sm:portrait:max-w-none max-sm:portrait:grid-rows-[minmax(0,1fr)_auto]";

interface SidewaysProps {
    ratio: number;
    reserve?: string;
    active?: boolean;
    children: ReactNode;
}

/**
 * Stage that turns its content a quarter turn on a portrait phone, so a wide picture runs along
 * the height of the screen. The stage is as tall as the turned content, which the screen height
 * caps, and everywhere else the content stays upright.
 *
 * @param props - Component props
 * @param props.ratio - Width over height of the content, used to fit it once turned
 * @param props.reserve - Height left to the dialog around the stage, as a CSS length
 * @param props.active - Turns the content on a portrait phone, which suits wide content only
 * @param props.children - Content to show, sized by its width
 * @returns The stage holding the content
 */
export function Sideways({ ratio, reserve = "1rem", active = true, children }: SidewaysProps) {
    return (
        <div
            style={{ "--ratio": ratio, "--reserve": reserve } as CSSProperties}
            className={cn(
                "flex min-h-0 min-w-0 justify-center",
                active &&
                    "max-sm:portrait:relative max-sm:portrait:block max-sm:portrait:w-full max-sm:portrait:max-h-[calc(100dvh-var(--reserve))] max-sm:portrait:[aspect-ratio:1/var(--ratio)] max-sm:portrait:[container-type:size]"
            )}
        >
            <div
                className={cn(
                    "min-w-0",
                    active &&
                        "max-sm:portrait:absolute max-sm:portrait:top-1/2 max-sm:portrait:left-1/2 max-sm:portrait:w-[min(100cqh,calc(var(--ratio)*100cqw))] max-sm:portrait:-translate-x-1/2 max-sm:portrait:-translate-y-1/2 max-sm:portrait:rotate-90"
                )}
            >
                {children}
            </div>
        </div>
    );
}