"use client";

import { Github, Linkedin, UserRound } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { ContactDialog } from "@/components/dialogs/contact";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

/**
 * Site footer.
 * Displays copyright and social media links.
 *
 * @example
 * // To keep the footer at the bottom of the page:
 * <div className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
 *     <Nav />
 *     <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
 *       {content}
 *     </main>
 *     <Footer />
 * </div>
 *
 * @returns The rendered footer
 */
export function Footer() {
    const currentYear = new Date().getFullYear();
    const [contactOpen, setContactOpen] = React.useState(false);

    return (
        <footer className="mt-8 border-t py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-1 md:items-start">
                        <p className="text-sm text-muted-foreground">
                            &copy; {currentYear}
                            <Link href="/" className="transition-colors hover:text-foreground ml-1">
                                sylvain.pro
                            </Link>
                            . Tout droits réservés.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            <Link
                                href="/mentions/"
                                className="transition-colors hover:text-foreground"
                            >
                                Mentions légales
                            </Link>
                            {" · "}
                            <Link
                                href="/confidentialite/"
                                className="transition-colors hover:text-foreground"
                            >
                                Confidentialité
                            </Link>
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            asChild
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <a
                                href={profile.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            asChild
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <a
                                href={profile.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setContactOpen(true)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <UserRound className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
            <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
        </footer>
    );
}
