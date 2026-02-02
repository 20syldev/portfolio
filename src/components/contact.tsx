"use client";

import { Check, Copy, FileText, Github, Linkedin, Mail } from "lucide-react";
import type { MouseEvent } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { usePdfViewer } from "@/components/viewer";
import { profile } from "@/data/profile";

interface ContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
    const [copied, setCopied] = React.useState(false);
    const { openPdf } = usePdfViewer();

    const copyEmail = () => {
        navigator.clipboard.writeText(profile.links.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{profile.name}</DialogTitle>
                    <DialogDescription>{profile.title}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        className="justify-start gap-3 p-3 h-auto text-muted-foreground"
                        onClick={copyEmail}
                    >
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="text-sm flex-1 truncate text-left">
                            {profile.links.email}
                        </span>
                        {copied ? (
                            <Check className="h-4 w-4 shrink-0 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4 shrink-0" />
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="justify-start gap-3 p-3 h-auto text-muted-foreground"
                    >
                        <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 shrink-0" />
                            {profile.social.github}
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="justify-start gap-3 p-3 h-auto text-muted-foreground"
                    >
                        <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 shrink-0" />
                            {profile.social.linkedin}
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        className="justify-start gap-3 p-3 h-auto text-muted-foreground"
                        onClick={(e: MouseEvent) => openPdf("/CV.pdf", "CV", e)}
                    >
                        <FileText className="h-4 w-4 shrink-0" />
                        CV
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function ContactLink({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button
                variant="link"
                className="h-auto p-0 underline hover:text-foreground transition-colors"
                onClick={() => setOpen(true)}
            >
                {children}
            </Button>
            <ContactDialog open={open} onOpenChange={setOpen} />
        </>
    );
}