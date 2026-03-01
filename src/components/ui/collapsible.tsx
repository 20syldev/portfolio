"use client";

import * as React from "react";

interface CollapsibleProps {
    open: boolean;
    children: React.ReactNode;
    className?: string;
}

export function Collapsible({ open, children, className }: CollapsibleProps) {
    return (
        <div
            className={`grid ${className ?? ""}`}
            style={{
                gridTemplateRows: open ? "1fr" : "0fr",
                transition: "grid-template-rows 300ms ease-in-out",
            }}
        >
            <div
                className="overflow-hidden min-h-0"
                style={{
                    opacity: open ? 1 : 0,
                    transition: "opacity 250ms ease-out",
                    transitionDelay: open ? "75ms" : "0ms",
                }}
            >
                {children}
            </div>
        </div>
    );
}