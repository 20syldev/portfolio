import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Classes that stretch a dialog over a portrait phone, leaving the stage one row and the toolbar
 * another, so a wide picture can be turned on its side inside it.
 */
export const sidewaysFrame =
    "max-sm:portrait:h-[calc(100dvh-1rem)] max-sm:portrait:w-[calc(100vw-1rem)] max-sm:portrait:max-w-none max-sm:portrait:grid-rows-[minmax(0,1fr)_auto]";

interface SidewaysProps {
    ratio: number;
    active?: boolean;
    children: ReactNode;
}

/**
 * Stage that turns its content a quarter turn on a portrait phone, so a wide picture fills the
 * height of the screen instead of its width. The content is sized from the stage with container
 * units, whichever of the two limits it first, and everywhere else it stays upright.
 *
 * @param props - Component props
 * @param props.ratio - Width over height of the content, used to fit it once turned
 * @param props.active - Turns the content on a portrait phone, which suits wide content only
 * @param props.children - Content to show, sized by its width
 * @returns The stage holding the content
 */
export function Sideways({ ratio, active = true, children }: SidewaysProps) {
    return (
        <div
            style={{ "--ratio": ratio } as CSSProperties}
            className={cn(
                "flex min-h-0 min-w-0 justify-center",
                active &&
                    "max-sm:portrait:relative max-sm:portrait:block max-sm:portrait:[container-type:size]"
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