import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * CVA variants for the Badge component.
 */
const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-chip overflow-hidden",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground",
                secondary:
                    "border-transparent bg-glass-capsule text-foreground data-[status=paused]:bg-secondary [a&]:not-data-[status=paused]:hoverable:bg-hover-fill [a&]:data-[status=paused]:hover:bg-secondary/90 [a&]:pressed:bg-hover-fill",
                destructive:
                    "border-transparent bg-destructive text-primary-foreground dark:text-background",
                outline:
                    "border-transparent bg-glass-tab-hover text-foreground [box-shadow:var(--ui-chip-shadow)] [a&]:hover:text-accent-foreground [a&]:hoverable:bg-glass-capsule [a&]:pressed:bg-hover-fill",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

/**
 * Styled badge component with variant support.
 *
 * @param props - Badge props extending span element with variant and asChild options
 * @returns The rendered badge
 */
function Badge({
    className,
    variant = "default",
    asChild = false,
    ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot="badge"
            data-variant={variant}
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
