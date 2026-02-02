"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown";

/**
 * Theme toggle button (light/dark/system).
 * Supports Alt+T keyboard shortcut to cycle through themes.
 *
 * @returns The rendered theme toggle dropdown
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // ALT+T keyboard shortcut to cycle themes
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key.toLowerCase() === "t") {
                e.preventDefault();
                setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [theme, setTheme]);

    const getCurrentIcon = () => {
        if (theme === "light") return <Sun className="h-4 w-4" />;
        if (theme === "dark") return <Moon className="h-4 w-4" />;
        return <Laptop className="h-4 w-4" />;
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <Laptop className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    {getCurrentIcon()}
                    <span className="sr-only">Changer de thème</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Laptop className="h-4 w-4" />
                    <span>Système</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="h-4 w-4" />
                    <span>Clair</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="h-4 w-4" />
                    <span>Sombre</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}