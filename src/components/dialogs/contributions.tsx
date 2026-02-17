"use client";

import { Github, GitPullRequest } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { contributions } from "@/data/profile";

interface ContributionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Dialog listing external open-source contributions with PR links.
 *
 * @param props - Component props
 * @param props.open - Whether the dialog is open
 * @param props.onOpenChange - Callback when dialog open state changes
 * @returns The rendered contributions dialog
 */
export function ContributionsDialog({ open, onOpenChange }: ContributionsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Contributions externes</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 overflow-hidden">
                    {contributions.map((contrib) => (
                        <div
                            key={contrib.pr}
                            className="flex items-center gap-3 p-3 rounded-lg border"
                        >
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0">
                                <GitPullRequest className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm truncate">{contrib.title}</p>
                                    <Badge variant="secondary" className="text-xs shrink-0">
                                        C
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    {contrib.description}
                                </p>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                            >
                                <a href={contrib.url} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}