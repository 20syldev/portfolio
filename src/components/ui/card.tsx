import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card container component with border, shadow and rounded corners.
 *
 * @param props - Div element props
 * @returns The rendered card container
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                "bg-card text-card-foreground flex flex-col gap-2 rounded-xl border py-6 shadow-sm",
                className
            )}
            {...props}
        />
    );
}

/**
 * Card header section with grid layout for title, description and actions.
 *
 * @param props - Div element props
 * @returns The rendered card header
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
                className
            )}
            {...props}
        />
    );
}

/**
 * Card title element with semibold font styling.
 *
 * @param props - Div element props
 * @returns The rendered card title
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn("leading-none font-semibold", className)}
            {...props}
        />
    );
}

/**
 * Card description element with muted text styling.
 *
 * @param props - Div element props
 * @returns The rendered card description
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

/**
 * Card action slot positioned at the top-right of the card header.
 *
 * @param props - Div element props
 * @returns The rendered card action
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className
            )}
            {...props}
        />
    );
}

/**
 * Card body content area with horizontal padding.
 *
 * @param props - Div element props
 * @returns The rendered card content
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

/**
 * Card footer section with horizontal flex layout.
 *
 * @param props - Div element props
 * @returns The rendered card footer
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
            {...props}
        />
    );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };