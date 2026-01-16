// Note: Github and Linkedin are deprecated in lucide-react but still functional
// Will migrate when v1.0 is released
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-12 border-t py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        &copy; {currentYear}
                        <Link href="/" className="hover:text-foreground ml-1">
                            sylvain.pro
                        </Link>
                        . All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href={profile.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Github className="h-5 w-5"/>
                        </a>
                        <a
                            href={profile.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Linkedin className="h-5 w-5"/>
                        </a>
                        <a
                            href={`mailto:${profile.links.email}`}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Mail className="h-5 w-5"/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}