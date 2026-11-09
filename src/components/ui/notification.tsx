"use client";

import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface NotificationProps {
    children: React.ReactNode;
    onDismiss: () => void;
    isHiding?: boolean;
}

/**
 * Displays a dismissible notification toast anchored to the bottom-right of the screen, glazed by
 * popups.css and spanning the width of the screen on phones.
 *
 * @param props - Component props
 * @param props.children - Content to display inside the notification
 * @param props.onDismiss - Callback invoked after the hide animation completes
 * @param props.isHiding - Whether the notification is being hidden externally (default: false)
 */
export function Notification({ children, onDismiss, isHiding = false }: NotificationProps) {
    const [hiding, setHiding] = React.useState(false);

    const handleDismiss = () => {
        setHiding(true);
        setTimeout(onDismiss, 300);
    };

    return (
        <div
            data-slot="notification"
            className={cn(
                "fixed right-5 bottom-5 z-[9998] w-full max-w-sm max-sm:inset-x-3.5 max-sm:bottom-3.5 max-sm:w-auto max-sm:max-w-none",
                hiding || isHiding
                    ? "animate-out slide-out-to-bottom-4 fade-out duration-500"
                    : "animate-in slide-in-from-bottom-4 fade-in duration-500"
            )}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 text-sm text-foreground leading-snug">{children}</div>
                <button
                    onClick={handleDismiss}
                    data-slot="notification-close"
                    className="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-full leading-none"
                    aria-label="Fermer"
                >
                    <X className="size-3.25" />
                </button>
            </div>
        </div>
    );
}
