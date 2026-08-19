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
    FileUser,
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
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 12.5C11 13.8807 10.1046 15 9 15C7.89543 15 7 13.8807 7 12.5C7 11.1193 7.89543 10 9 10C10.1046 10 11 11.1193 11 12.5ZM8.22293 12.5C8.22293 13.0365 8.57084 13.4713 9 13.4713C9.42916 13.4713 9.77707 13.0365 9.77707 12.5C9.77707 11.9635 9.42916 11.5287 9 11.5287C8.57084 11.5287 8.22293 11.9635 8.22293 12.5Z"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 15C16.1046 15 17 13.8807 17 12.5C17 11.1193 16.1046 10 15 10C13.8954 10 13 11.1193 13 12.5C13 13.8807 13.8954 15 15 15ZM15 13.4713C14.5708 13.4713 14.2229 13.0365 14.2229 12.5C14.2229 11.9635 14.5708 11.5287 15 11.5287C15.4292 11.5287 15.7771 11.9635 15.7771 12.5C15.7771 13.0365 15.4292 13.4713 15 13.4713Z"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.9864 3.33561C9.94083 3.06219 9.78382 2.81995 9.55284 2.66671C9.32186 2.51347 9.03764 2.46298 8.76801 2.52729C6.61476 3.04085 5.39826 3.471 3.47772 4.64723C3.33168 4.73668 3.21105 4.86214 3.1274 5.01158C1.9368 7.13867 1.14514 8.97344 0.657859 10.9416C0.171558 12.9058 1.51992e-05 14.9565 0 17.5C0 17.7652 0.105353 18.0196 0.292888 18.2071C1.35191 19.2661 2.45067 20.1002 3.71884 20.6638C4.99135 21.2294 6.3833 21.5 8 21.5C8.43043 21.5 8.81257 21.2246 8.94868 20.8162L9.62339 18.7921C10.3731 18.918 11.1769 19 12 19C12.8231 19 13.6269 18.918 14.3766 18.7921L15.0513 20.8162C15.1874 21.2246 15.5696 21.5 16 21.5C17.6167 21.5 19.0086 21.2294 20.2812 20.6638C21.5493 20.1002 22.6481 19.2661 23.7071 18.2071C23.8946 18.0196 24 17.7652 24 17.5C24 14.9565 23.8284 12.9058 23.3421 10.9416C22.8549 8.97344 22.0632 7.13867 20.8726 5.01158C20.789 4.86214 20.6683 4.73668 20.5223 4.64723C18.6017 3.471 17.3852 3.04085 15.232 2.52729C14.9624 2.46298 14.6781 2.51347 14.4472 2.66671C14.2162 2.81995 14.0592 3.06219 14.0136 3.33561L13.6356 5.60381C13.129 5.53843 12.5832 5.49994 12 5.49994C11.4168 5.49994 10.8709 5.53843 10.3644 5.60381L9.9864 3.33561ZM16.7135 19.4783L16.3365 18.3471C17.2221 18.0953 18.1008 17.7971 18.9331 17.4013C19.4309 17.1622 19.6405 16.5647 19.4014 16.0669C19.1622 15.5692 18.5647 15.3597 18.0669 15.5986C17.4725 15.8793 16.8456 16.1 16.2191 16.2953C15.0702 16.6535 13.5516 17 12 17C10.4484 17 8.92975 16.6535 7.78088 16.2953C7.15483 16.1001 6.53092 15.8781 5.93607 15.6C5.44219 15.3668 4.83698 15.5709 4.59864 16.0669C4.36123 16.561 4.57887 17.1681 5.0722 17.4039C5.90316 17.7978 6.77969 18.0958 7.66354 18.3471L7.28647 19.4783C6.22623 19.4118 5.33457 19.1933 4.53112 18.8362C3.65215 18.4455 2.83779 17.8709 2.00169 17.0797C2.02016 14.8272 2.19155 13.069 2.59925 11.4223C3.01458 9.74468 3.68586 8.13987 4.7452 6.2178C6.0043 5.46452 6.90106 5.0901 8.19227 4.73633L8.40706 6.02507C7.53196 6.29408 6.64115 6.64982 5.903 7.1977C5.46929 7.52129 5.37507 8.1667 5.7 8.59994C6.03024 9.04026 6.6539 9.1307 7.09547 8.80332C7.4639 8.53958 7.89071 8.34569 8.30889 8.17842C9.14624 7.84348 10.3952 7.49994 12 7.49994C13.6048 7.49994 14.8538 7.84348 15.6911 8.17842C16.1093 8.34568 16.5361 8.53955 16.9045 8.8033C17.3461 9.1307 17.9698 9.04027 18.3 8.59994C18.6241 8.16782 18.526 7.51604 18.0932 7.19491C17.3475 6.65617 16.4693 6.29447 15.5929 6.02507L15.8077 4.73633C17.0989 5.0901 17.9957 5.46452 19.2548 6.2178C20.3141 8.13987 20.9854 9.74468 21.4008 11.4223C21.8085 13.069 21.9798 14.8272 21.9983 17.0797C21.1622 17.8709 20.3479 18.4455 19.4689 18.8362C18.6654 19.1933 17.7738 19.4118 16.7135 19.4783ZM9 15C10.1046 15 11 13.8807 11 12.5C11 11.1193 10.1046 10 9 10C7.89543 10 7 11.1193 7 12.5C7 13.8807 7.89543 15 9 15ZM17 12.5C17 13.8807 16.1046 15 15 15C13.8954 15 13 13.8807 13 12.5C13 11.1193 13.8954 10 15 10C16.1046 10 17 11.1193 17 12.5ZM9 13.4713C8.57084 13.4713 8.22293 13.0365 8.22293 12.5C8.22293 11.9635 8.57084 11.5287 9 11.5287C9.42916 11.5287 9.77707 11.9635 9.77707 12.5C9.77707 13.0365 9.42916 13.4713 9 13.4713ZM15 13.4713C14.5708 13.4713 14.2229 13.0365 14.2229 12.5C14.2229 11.9635 14.5708 11.5287 15 11.5287C15.4292 11.5287 15.7771 11.9635 15.7771 12.5C15.7771 13.0365 15.4292 13.4713 15 13.4713Z"
            />
        </svg>
    ),
    cv: <FileUser className="h-4 w-4 shrink-0" />,
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

                <div className="-mx-1 min-h-0 overflow-y-auto overscroll-contain px-1 pb-4 max-sm:pr-3 sm:pb-1">
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