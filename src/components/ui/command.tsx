"use client";

import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import * as React from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSmoothScroll } from "@/hooks/scroll";
import { cn } from "@/lib/utils";

/**
 * Command palette container built on cmdk.
 *
 * @param props - Command primitive props
 * @returns The rendered command container
 */
function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
    return (
        <CommandPrimitive
            data-slot="command"
            className={cn(
                "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
                className
            )}
            {...props}
        />
    );
}

/**
 * Command palette wrapped in a dialog overlay.
 *
 * @param props - Dialog props with optional title, description, className and showCloseButton
 * @returns The rendered command dialog
 */
function CommandDialog({
    title = "Command Palette",
    description = "Search for a command to run...",
    children,
    className,
    showCloseButton = true,
    filter,
    ...props
}: React.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
    filter?: (value: string, search: string, keywords?: string[]) => number;
}) {
    return (
        <Dialog {...props}>
            <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogContent
                className={cn(
                    "overflow-hidden p-0",
                    "top-[4rem] translate-y-0 sm:top-[50%] sm:translate-y-[-50%]",
                    className
                )}
                showCloseButton={showCloseButton}
            >
                <Command
                    filter={filter}
                    className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
                >
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Search input field for the command palette with a search icon.
 *
 * @param props - Command input primitive props
 * @returns The rendered command input
 */
function CommandInput({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
    return (
        <div
            data-slot="command-input-wrapper"
            className="flex h-9 items-center gap-2 border-b px-3"
        >
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
                data-slot="command-input"
                className={cn(
                    "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        </div>
    );
}

/**
 * Scrollable list container for command palette items with smooth scrolling.
 *
 * @param props - Command list primitive props
 * @returns The rendered command list
 */
const CommandList = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>({ delayed: true });
    const internalRef = React.useRef<HTMLDivElement>(null);

    // Sync refs using useEffect to avoid mutation during render
    React.useEffect(() => {
        const node = internalRef.current;
        if (!node) return;

        // Set scrollRef
        if ("current" in scrollRef) {
            scrollRef.current = node;
        }

        // Set external ref
        if (typeof ref === "function") {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }

        // Cleanup
        return () => {
            if (typeof ref === "function") {
                ref(null);
            } else if (ref) {
                ref.current = null;
            }
        };
    }, [ref, scrollRef]);

    return (
        <CommandPrimitive.List
            ref={internalRef}
            data-slot="command-list"
            data-lenis-prevent
            className={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
            {...props}
        />
    );
});
CommandList.displayName = "CommandList";

/**
 * Empty state message displayed when no command results match.
 *
 * @param props - Command empty primitive props
 * @returns The rendered empty state
 */
function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
    return (
        <CommandPrimitive.Empty
            data-slot="command-empty"
            className="py-6 text-center text-sm"
            {...props}
        />
    );
}

/**
 * Group container for organizing command palette items with a heading.
 *
 * @param props - Command group primitive props
 * @returns The rendered command group
 */
function CommandGroup({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
    return (
        <CommandPrimitive.Group
            data-slot="command-group"
            className={cn(
                "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
                className
            )}
            {...props}
        />
    );
}

/**
 * Visual separator line between command palette groups.
 *
 * @param props - Command separator primitive props
 * @returns The rendered separator
 */
function CommandSeparator({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return (
        <CommandPrimitive.Separator
            data-slot="command-separator"
            className={cn("bg-border -mx-1 h-px", className)}
            {...props}
        />
    );
}

/**
 * Selectable item within the command palette.
 *
 * @param props - Command item primitive props
 * @returns The rendered command item
 */
function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
    return (
        <CommandPrimitive.Item
            data-slot="command-item"
            className={cn(
                "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        />
    );
}

/**
 * Keyboard shortcut hint displayed alongside a command item.
 *
 * @param props - Span element props
 * @returns The rendered shortcut text
 */
function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="command-shortcut"
            className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
            {...props}
        />
    );
}

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
};