import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * CVA variants for the Button component.
 */
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium cursor-pointer transition-capsule pressed:[transform:scale(0.97)] disabled:pointer-events-none disabled:[box-shadow:none] disabled:saturate-40 disabled:opacity-45 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground [box-shadow:var(--ui-shadow-solid)] hoverable:[box-shadow:var(--ui-shadow-solid-hover)] hoverable:brightness-[1.18] dark:hoverable:brightness-90 pressed:[box-shadow:var(--ui-shadow-solid-active)] pressed:brightness-[1.12]",
                destructive:
                    "border-transparent bg-destructive text-primary-foreground dark:text-background [box-shadow:var(--ui-shadow-solid)] hoverable:[box-shadow:var(--ui-shadow-solid-hover)] hoverable:brightness-[1.18] dark:hoverable:brightness-90 pressed:[box-shadow:var(--ui-shadow-solid-active)] pressed:brightness-[1.12]",
                outline:
                    "border border-transparent bg-glass-tab-hover [box-shadow:var(--ui-shadow-outline)] hover:text-accent-foreground focus-visible:bg-glass-capsule hoverable:bg-glass-capsule hoverable:[box-shadow:var(--ui-shadow-outline-hover)] pressed:bg-glass-capsule pressed:[box-shadow:var(--ui-shadow-pressed)]",
                secondary:
                    "border-transparent bg-glass-capsule text-foreground [box-shadow:var(--ui-shadow-secondary)] hoverable:bg-hover-fill hoverable:[box-shadow:var(--ui-shadow-secondary-hover)] pressed:bg-hover-fill pressed:[box-shadow:var(--ui-shadow-pressed)]",
                ghost: "border-transparent bg-transparent hover:text-accent-foreground focus-visible:bg-glass-tab-hover hoverable:bg-glass-tab-hover pressed:bg-glass-capsule pressed:[box-shadow:var(--ui-shadow-pressed)]",
                link: "text-primary underline-offset-[0.3em] hover:underline hoverable:decoration-2",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

/**
 * Styled button component with variant and size support.
 *
 * @param props - Button props extending native button with variant, size and asChild options
 * @returns The rendered button
 */
function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
