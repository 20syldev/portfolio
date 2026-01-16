"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./toggle";
import { CommandMenu } from "@/components/command";

const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/alternance", label: "Alternance" },
    { href: "/veille", label: "Veille" },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                    Sylvain L.
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-4 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-1">
                        <CommandMenu/>
                        <ThemeToggle/>
                    </div>
                </nav>

                {/* Mobile menu button */}
                <div className="flex items-center gap-2 md:hidden">
                    <CommandMenu/>
                    <ThemeToggle/>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="h-5 w-5"/>
                        ) : (
                            <Menu className="h-5 w-5"/>
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile nav */}
            {isOpen && (
                <nav className="border-t bg-background px-4 py-4 md:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
}