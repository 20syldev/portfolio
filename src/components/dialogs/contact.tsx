"use client";

import {
    Award,
    BadgeCheck,
    Briefcase,
    Check,
    CircleCheck,
    Compass,
    Copy,
    Dot,
    FileText,
    Github,
    GraduationCap,
    Heart,
    Linkedin,
    Mail,
    Newspaper,
    Wrench,
} from "lucide-react";
import type { MouseEvent } from "react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Period } from "@/components/ui/period";
import { useViewer } from "@/components/utils/viewer";
import { totalCertifications, totalCompletionBadges, totalGdevBadges } from "@/data/achievements";
import type { ParcoursEntry } from "@/data/parcours";
import { alternance, parcours } from "@/data/parcours";
import type { ContactLink } from "@/data/profile";
import { contacts, pageLinks, profile } from "@/data/profile";
import { techCategories } from "@/data/technologies";
import { veilles } from "@/data/veille";
import { cn } from "@/lib/utils";

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
    award: <Award className="h-4 w-4 shrink-0" />,
    badge: <BadgeCheck className="h-4 w-4 shrink-0" />,
    check: <CircleCheck className="h-4 w-4 shrink-0" />,
    graduation: <GraduationCap className="h-4 w-4 shrink-0" />,
    veille: <Newspaper className="h-4 w-4 shrink-0" />,
    wrench: <Wrench className="h-4 w-4 shrink-0" />,
};

const work = alternance.find((entry) => entry.current) ?? alternance[0];
const formation = parcours.find((entry) => entry.status === "current") ?? parcours[0];
const totalTech = techCategories.reduce((acc, cat) => acc + cat.items.length, 0);

const formationStatus: Record<ParcoursEntry["status"], string> = {
    upcoming: "À venir",
    current: "En cours",
    done: "Terminé",
};

const counters: Record<NonNullable<ContactLink["counter"]>, number> = {
    tech: totalTech,
    veille: veilles.length,
    certifications: totalCertifications,
    badges: totalGdevBadges,
    completion: totalCompletionBadges,
};

const btnClass = "justify-start gap-3 p-3 h-auto text-muted-foreground";

interface ContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    autoFocusClose?: boolean;
}

/**
 * Inner layout shared by every dialog button: icon, label, optional detail line and counter.
 * The detail line and the counter are only rendered above the md breakpoint.
 *
 * @param props - Component props
 * @param props.contact - Contact link configuration
 * @param props.trailing - Optional node rendered at the end of the row
 * @returns The rendered button content
 */
function ContactContent({
    contact,
    trailing,
}: {
    contact: ContactLink;
    trailing?: React.ReactNode;
}) {
    const count = contact.counter ? counters[contact.counter] : undefined;

    return (
        <>
            {links[contact.icon]}
            <span className="min-w-0 flex-1 text-left">
                <span className={cn("block truncate text-sm", contact.detail && "text-foreground")}>
                    {contact.label}
                </span>
                {contact.detail && (
                    <span className="block truncate text-xs font-normal">{contact.detail}</span>
                )}
            </span>
            {count !== undefined && (
                <Badge
                    variant="secondary"
                    className="inline-flex px-1.5 py-0 text-[10px] font-normal"
                >
                    {count}
                </Badge>
            )}
            {trailing}
        </>
    );
}

/**
 * Renders a contact action button with appropriate behavior.
 * Supports copy-to-clipboard, PDF viewer, internal route and external link actions.
 *
 * @param props - Component props
 * @param props.contact - Contact link configuration with action type
 * @param props.onNavigate - Called before an internal navigation so the dialog can close
 * @returns The rendered contact button
 */
function ContactButton({ contact, onNavigate }: { contact: ContactLink; onNavigate?: () => void }) {
    const [copied, setCopied] = React.useState(false);
    const { openPdf } = useViewer();

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
                <ContactContent
                    contact={contact}
                    trailing={
                        copied ? (
                            <Check className="h-4 w-4 shrink-0 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4 shrink-0" />
                        )
                    }
                />
            </Button>
        );
    }

    if (contact.action === "route") {
        return (
            <Button variant="outline" asChild className={btnClass} onClick={() => onNavigate?.()}>
                <a href={contact.url}>
                    <ContactContent contact={contact} />
                </a>
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
                <ContactContent contact={contact} />
            </Button>
        );
    }

    return (
        <Button variant="outline" asChild className={btnClass}>
            <a href={contact.url} target="_blank" rel="noopener noreferrer">
                <ContactContent contact={contact} />
            </a>
        </Button>
    );
}

/**
 * Heading of a link group.
 *
 * @param props - Component props
 * @param props.icon - Leading icon of the group
 * @param props.label - Group label
 * @returns The rendered group heading
 */
function GroupTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <h3 className="flex items-center gap-2 text-sm font-medium">
            {icon}
            {label}
        </h3>
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

    const close = () => onOpenChange(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="p-4 sm:p-6 sm:max-w-lg md:max-w-2xl lg:max-w-3xl grid-rows-[auto_minmax(0,1fr)] max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:w-screen max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0 sm:max-h-[calc(100dvh-2rem)]"
                autoFocusClose={autoFocusClose}
            >
                <DialogHeader>
                    <DialogTitle>
                        <span className="animate-shine">{profile.name}</span>
                    </DialogTitle>
                    <DialogDescription>{profile.title}</DialogDescription>
                    <div className="hidden flex-col gap-1 text-xs text-muted-foreground lg:flex">
                        <span className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="font-normal">
                                <Briefcase />
                                Alternance chez {work.company}
                            </Badge>
                            <Period from={work.from} to={work.to} />
                        </span>
                        <span className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="outline" className="font-normal">
                                <GraduationCap />
                                {formation.school}
                            </Badge>
                            <Period from={formation.from} to={formation.to} />
                            <Dot className="h-4 w-4 shrink-0" />
                            {formationStatus[formation.status]}
                        </span>
                    </div>
                </DialogHeader>

                <div className="-mx-1 min-h-0 overflow-y-auto overscroll-contain px-1 pb-4 sm:pb-1">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-2 [&>a]:flex-1 [&>button]:flex-1">
                            <GroupTitle
                                icon={<Mail className="h-4 w-4 text-primary" />}
                                label="Me contacter"
                            />
                            {contacts.map((contact) => (
                                <ContactButton key={contact.icon} contact={contact} />
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 md:border-l md:pl-6 [&>a]:flex-1 [&>button]:flex-1">
                            <GroupTitle
                                icon={<Compass className="h-4 w-4 text-primary" />}
                                label="Explorer"
                            />
                            {pageLinks.map((link) => (
                                <ContactButton key={link.icon} contact={link} onNavigate={close} />
                            ))}
                        </div>
                    </div>
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