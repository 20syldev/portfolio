import { Maximize } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Hover overlay with a centered Maximize icon.
 * Place inside a `group` container with `relative` positioning.
 */
export function Expand({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "absolute inset-0 flex items-center justify-center",
                "bg-black/0 transition-all duration-200",
                "group-hover:bg-black/30 group-active:bg-black/30",
                className
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center rounded-full",
                    "h-12 w-12 sm:h-14 sm:w-14",
                    "bg-white/90 text-black shadow-lg",
                    "transition-transform duration-200",
                    "scale-90 opacity-0",
                    "group-hover:scale-100 group-hover:opacity-100",
                    "group-active:scale-100 group-active:opacity-100"
                )}
            >
                <Maximize className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
        </div>
    );
}