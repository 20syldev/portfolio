"use client";

import * as React from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { shortcuts } from "@/data/shortcuts";

function Keycap({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 pt-px font-mono text-[11px] font-medium text-muted-foreground shadow-[0_1px_0_1px] shadow-border/50">
            {children}
        </kbd>
    );
}

/**
 * Dialog listing all available keyboard shortcuts.
 * Accessible via ALT+/ or the command menu.
 *
 * @returns The rendered shortcuts dialog
 */
export function ShortcutsDialog({
    open,
    onOpenChange,
    actions,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    actions?: Record<string, () => void>;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md lg:max-w-lg" autoFocusClose>
                <DialogHeader>
                    <DialogTitle>Raccourcis clavier</DialogTitle>
                    <DialogDescription>
                        Personnalisations accessibles via un raccourci
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-1.5">
                    {shortcuts.map((s) => {
                        const action = actions?.[s.id];
                        const handleClick = action
                            ? () => {
                                  onOpenChange(false);
                                  action();
                              }
                            : undefined;
                        return (
                            <button
                                key={s.keys.join("")}
                                type="button"
                                disabled={!action}
                                onClick={handleClick}
                                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50 disabled:cursor-default"
                            >
                                <span className="flex items-center gap-4 text-sm">
                                    <s.icon className="h-4 w-4 text-muted-foreground" />
                                    {s.label}
                                </span>
                                <span className="flex items-center gap-1">
                                    {s.keys.map((key, i) => (
                                        <React.Fragment key={key}>
                                            {i > 0 && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    +
                                                </span>
                                            )}
                                            <Keycap>{key}</Keycap>
                                        </React.Fragment>
                                    ))}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}