import { cn } from "@/lib/utils";

/**
 * Skeleton loading placeholder.
 *
 * @param props - Span props with className for dimensions (e.g. "h-5 w-10")
 * @returns The rendered skeleton element
 */
export function Skeleton({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span className={cn("block rounded-full bg-muted animate-pulse", className)} {...props} />
    );
}