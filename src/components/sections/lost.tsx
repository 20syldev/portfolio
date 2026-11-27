"use client";

import { Search, Unlink } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CommandMenu, useCommand } from "@/components/utils/command";

/**
 * Reads the address that was asked for, without its trailing slash.
 *
 * @returns The decoded path, or the raw one when it cannot be decoded
 */
function requestedPath(): string {
    const raw = location.pathname.replace(/\/+$/, "") || "/";
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

/**
 * Search box of the 404 page, filled with the last words of the address that was asked for.
 * Sending it opens the command palette on that text, and Ctrl K opens it empty.
 *
 * @returns The rendered search box and the address that was requested
 */
export function Lost() {
    const { setOpen, setQuery } = useCommand();
    const [address, setAddress] = useState("");
    const [value, setValue] = useState("");

    useEffect(() => {
        const path = requestedPath();
        setAddress(path);
        setValue(
            path
                .split("/")
                .filter(Boolean)
                .pop()
                ?.replace(/[-_.+]+/g, " ") ?? ""
        );
    }, []);

    return (
        <>
            <CommandMenu />
            <form
                role="search"
                onSubmit={(event) => {
                    event.preventDefault();
                    setQuery(value.trim());
                    setOpen(true);
                }}
                className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-border bg-card py-2 pr-2 pl-4 shadow-sm transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30"
            >
                <Search aria-hidden className="size-[1.15rem] shrink-0 text-muted-foreground" />
                <input
                    type="search"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    aria-label="Rechercher sur le site"
                    placeholder="Rechercher sur le site"
                    autoComplete="off"
                    spellCheck={false}
                    className="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
                <kbd className="hidden shrink-0 items-center rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground sm:inline-flex">
                    Ctrl K
                </kbd>
                <Button type="submit" size="lg" className="rounded-xl">
                    Rechercher
                </Button>
            </form>
            <p className="mt-4 flex min-h-7 flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                {address && (
                    <>
                        <Unlink aria-hidden className="size-4" />
                        Adresse demandée
                        <code className="max-w-full truncate rounded-md bg-muted px-2 py-0.5 font-mono text-[13px] text-foreground">
                            {address}
                        </code>
                    </>
                )}
            </p>
        </>
    );
}
