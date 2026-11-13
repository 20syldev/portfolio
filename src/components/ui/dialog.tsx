"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";

import { useModalMark } from "@/hooks/modal";
import { cn } from "@/lib/utils";

/**
 * Root dialog component built on Radix UI Dialog.
 *
 * @param props - Radix Dialog root props
 * @returns The rendered dialog root
 */
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * Button or element that opens the dialog when clicked.
 *
 * @param props - Radix Dialog trigger props
 * @returns The rendered dialog trigger
 */
function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Portal that renders dialog content outside the DOM hierarchy.
 *
 * @param props - Radix Dialog portal props
 * @returns The rendered dialog portal
 */
function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * Button that closes the dialog when clicked.
 *
 * @param props - Radix Dialog close props
 * @returns The rendered dialog close button
 */
function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * Backdrop overlay behind the dialog content, veiled and blurred by popups.css.
 *
 * @param props - Radix Dialog overlay props
 * @returns The rendered overlay
 */
function DialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    useModalMark();

    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 duration-300",
                className
            )}
            {...props}
        />
    );
}

/**
 * Main dialog content panel centered on screen with optional close button, glazed by popups.css.
 * The onOpenAutoFocus of the caller runs first, while focus has not moved yet, so it can read
 * the element focused before the dialog opened; autoFocusClose then takes over unless it prevented.
 *
 * @param props - Radix Dialog content props
 * @param props.className - Classes merged onto the panel
 * @param props.children - Dialog body
 * @param props.showCloseButton - Renders the corner close button, true by default
 * @param props.autoFocusClose - Moves focus to the close button on open, false by default
 * @param props.onOpenAutoFocus - Called before the focus moves, can prevent the default
 * @returns The rendered dialog content
 */
function DialogContent({
    className,
    children,
    showCloseButton = true,
    autoFocusClose = false,
    onOpenAutoFocus,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
    autoFocusClose?: boolean;
}) {
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                data-lenis-prevent
                className={cn(
                    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 p-5 duration-300 outline-none sm:max-w-lg sm:gap-4.5 sm:p-7",
                    className
                )}
                onOpenAutoFocus={(e) => {
                    onOpenAutoFocus?.(e);
                    if (!autoFocusClose || e.defaultPrevented) return;
                    e.preventDefault();
                    const target = e.currentTarget as HTMLElement | null;
                    target?.querySelector<HTMLButtonElement>("[data-slot='dialog-close']")?.focus();
                }}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="dialog-close"
                        className="absolute top-4.5 right-4.5 inline-flex size-8.5 items-center justify-center outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}

/**
 * Header section of the dialog with centered text on mobile.
 *
 * @param props - Div element props
 * @returns The rendered dialog header
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    );
}

/**
 * Footer section of the dialog with responsive flex layout.
 *
 * @param props - Div element props
 * @returns The rendered dialog footer
 */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
            {...props}
        />
    );
}

/**
 * Dialog title element with semibold font styling.
 *
 * @param props - Radix Dialog title props
 * @returns The rendered dialog title
 */
function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-xl leading-[1.2] font-semibold tracking-[-0.012em]", className)}
            {...props}
        />
    );
}

/**
 * Dialog description text with muted styling.
 *
 * @param props - Radix Dialog description props
 * @returns The rendered dialog description
 */
function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-muted-foreground text-center text-sm sm:text-left", className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
