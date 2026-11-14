import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { type ProjectStatus } from "@/hooks/status";
import { cn } from "@/lib/utils";

interface TileProps extends React.ComponentProps<"div"> {
    status?: ProjectStatus;
    inactive?: boolean;
    asChild?: boolean;
}

/**
 * Shell of a project card, shared by the home grid, the Projets list and the Parcours entries.
 * A status draws the animated ring and its glow, an inactive project is faded out.
 *
 * @param props - Tile props extending the div element
 * @param props.status - Project status, a plain bordered tile when null or omitted
 * @param props.inactive - Fades the tile out, for an archived or paused project
 * @param props.asChild - Renders the child element as the tile, for a clickable card
 * @returns The rendered tile
 */
function Tile({ status, inactive = false, asChild = false, className, ...props }: TileProps) {
    const Comp = asChild ? Slot : "div";

    return (
        <Comp
            data-slot="tile"
            data-status={status ?? undefined}
            className={cn(
                "card-hover flex flex-col p-4",
                status ? "gradient-border glow-hover" : "border",
                inactive && "inactive",
                className
            )}
            {...props}
        />
    );
}

export { Tile };
