"use client";

import { Check, Copy, FileText, Github, Heart, Linkedin, Mail } from "lucide-react";
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
import { usePdfViewer } from "@/components/utils/viewer";
import type { ContactLink } from "@/data/profile";
import { contacts, profile } from "@/data/profile";

const links: Record<string, React.ReactNode> = {
    mail: <Mail className="h-4 w-4 shrink-0" />,
    github: <Github className="h-4 w-4 shrink-0" />,
    sponsors: <Heart className="h-4 w-4 shrink-0" />,
    linkedin: <Linkedin className="h-4 w-4 shrink-0" />,
    discord: (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
        </svg>
    ),
    cv: <FileText className="h-4 w-4 shrink-0" />,
};

interface ContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    autoFocusClose?: boolean;
}

/**
 * Renders a contact action button with appropriate behavior.
 * Supports copy-to-clipboard, PDF viewer, and external link actions.
 *
 * @param props - Component props
 * @param props.contact - Contact link configuration with action type
 * @returns The rendered contact button
 */
function ContactButton({ contact }: { contact: ContactLink }) {
    const [copied, setCopied] = React.useState(false);
    const { openPdf } = usePdfViewer();

    const btnClass = "justify-start gap-3 p-3 h-auto text-muted-foreground";

    if (contact.action === "copy") {
        return (
            <Button
                variant="outline"
                className={btnClass}
                onClick={() => {
                    navigator.clipboard.writeText(contact.label);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}
            >
                {links[contact.icon]}
                <span className="text-sm flex-1 truncate text-left">{contact.label}</span>
                {copied ? (
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                ) : (
                    <Copy className="h-4 w-4 shrink-0" />
                )}
            </Button>
        );
    }

    if (contact.action === "pdf") {
        return (
            <Button
                variant="outline"
                className={btnClass}
                onClick={(e: MouseEvent) => openPdf(contact.url!, contact.label, e)}
            >
                {links[contact.icon]}
                {contact.label}
            </Button>
        );
    }

    return (
        <Button variant="outline" asChild className={btnClass}>
            <a href={contact.url} target="_blank" rel="noopener noreferrer">
                {links[contact.icon]}
                {contact.label}
            </a>
        </Button>
    );
}

/**
 * Contact information dialog with profile details.
 * Manages URL history integration for the /me route.
 *
 * @param props - Component props
 * @param props.open - Whether the dialog is open
 * @param props.onOpenChange - Callback when open state changes
 * @param props.autoFocusClose - Whether to auto-focus the close button on open
 * @returns The rendered contact dialog
 */
export function ContactDialog({ open, onOpenChange, autoFocusClose }: ContactDialogProps) {
    const pushedRef = React.useRef(false);

    React.useEffect(() => {
        if (open) {
            if (location.pathname !== "/me/") {
                history.pushState({ dialog: "me" }, "", "/me/");
                pushedRef.current = true;
            }
        } else if (pushedRef.current) {
            history.back();
            pushedRef.current = false;
        }
    }, [open]);

    React.useEffect(() => {
        const onPopState = () => {
            if (pushedRef.current) {
                pushedRef.current = false;
                onOpenChange(false);
            }
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="p-4 sm:p-6 sm:max-w-md lg:max-w-lg"
                autoFocusClose={autoFocusClose}
            >
                <DialogHeader>
                    <DialogTitle>{profile.name}</DialogTitle>
                    <DialogDescription className="text-center sm:text-left">
                        {profile.title}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {contacts.map((contact) => (
                        <ContactButton key={contact.icon} contact={contact} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Trigger link to open the contact dialog.
 * Wraps children in a button that opens the ContactDialog.
 *
 * @param props - Component props
 * @param props.children - Content to display as the link
 * @returns The rendered link button with dialog
 */
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