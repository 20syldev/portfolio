"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface DropdownMenuProps {
    children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

interface DropdownMenuContentProps {
    children: React.ReactNode;
    align?: "start" | "center" | "end";
    className?: string;
}

interface DropdownMenuItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const DropdownMenuContext = React.createContext<{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

/**
 * Root dropdown menu component managing open/close state.
 *
 * @param props - Component props
 * @param props.children - Menu trigger and content elements
 * @returns The rendered dropdown menu container
 */
export function DropdownMenu({ children }: DropdownMenuProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-flex">{children}</div>
        </DropdownMenuContext.Provider>
    );
}

/**
 * Element that toggles the dropdown menu on click.
 *
 * @param props - Component props
 * @param props.children - Trigger element content
 * @param props.asChild - Whether to merge props onto the child element
 * @returns The rendered trigger
 */
export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

    const handleClick = () => context.setOpen(!context.open);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
            onClick: handleClick,
        });
    }

    return <button onClick={handleClick}>{children}</button>;
}

/**
 * Popover container for dropdown menu items with alignment options.
 *
 * @param props - Component props
 * @param props.children - Menu items
 * @param props.align - Horizontal alignment relative to the trigger (default: "end")
 * @param props.className - Optional CSS class
 * @returns The rendered dropdown content, or null when closed
 */
export function DropdownMenuContent({
    children,
    align = "end",
    className,
}: DropdownMenuContentProps) {
    const context = React.useContext(DropdownMenuContext);
    const ref = React.useRef<HTMLDivElement>(null);

    if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                context.setOpen(false);
            }
        };

        if (context.open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [context.open, context]);

    if (!context.open) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                align === "start" && "left-0",
                align === "center" && "left-1/2 -translate-x-1/2",
                align === "end" && "right-0",
                className
            )}
        >
            {children}
        </div>
    );
}

/**
 * Selectable item within the dropdown menu that closes on click.
 *
 * @param props - Component props
 * @param props.children - Item content
 * @param props.onClick - Click handler
 * @param props.className - Optional CSS class
 * @returns The rendered menu item
 */
export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuItem must be used within DropdownMenu");

    const handleClick = () => {
        onClick?.();
        context.setOpen(false);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
            )}
        >
            {children}
        </button>
    );
}