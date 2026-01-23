import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

import { profile } from "@/data/profile";

/**
 * Site footer.
 * Displays copyright and social media links.
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-8 border-t py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        &copy; {currentYear}
                        <Link href="/" className="transition-colors hover:text-foreground ml-1">
                            sylvain.pro
                        </Link>
                        . Tout droits réservés.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href={profile.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                        <a
                            href={profile.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                        <a
                            href={`mailto:${profile.links.email}`}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Mail className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}