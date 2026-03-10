"use client";

import { Keyboard, MousePointer2, Palette, Search, Type } from "lucide-react";
import * as React from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const shortcuts = [
    { keys: ["Alt", "C"], label: "Curseur personnalisé", icon: MousePointer2 },
    { keys: ["Alt", "P"], label: "Police de caractères", icon: Type },
    { keys: ["Alt", "T"], label: "Changer de thème", icon: Palette },
    { keys: ["Alt", "/"], label: "Raccourcis clavier", icon: Keyboard },
    { keys: ["Ctrl", "K"], label: "Rechercher", icon: Search },
];

function Keycap({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground shadow-[0_1px_0_1px] shadow-border/50">
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
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
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
                    {shortcuts.map((s) => (
                        <div
                            key={s.keys.join("")}
                            className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
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
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}