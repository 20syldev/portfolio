"use client";

import { X } from "lucide-react";
import * as React from "react";

interface NotificationProps {
    children: React.ReactNode;
    onDismiss: () => void;
    isHiding?: boolean;
}

/**
 * Displays a dismissible notification toast anchored to the bottom-right of the screen.
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
            className={`fixed bottom-4 right-4 z-[9998] max-w-sm w-full bg-background border border-border rounded-lg shadow-lg p-4 ${hiding || isHiding ? "animate-out slide-out-to-bottom-4 fade-out duration-300" : "animate-in slide-in-from-bottom-4 fade-in duration-300"}`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 text-sm text-foreground leading-snug">{children}</div>
                <button
                    onClick={handleDismiss}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors text-base leading-none"
                    aria-label="Fermer"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}