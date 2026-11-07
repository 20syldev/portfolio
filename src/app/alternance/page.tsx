"use client";

import Link from "next/link";
import { useEffect } from "react";

import { alternanceAnchors, alternanceFallback } from "@/data/anchors";

/**
 * Former alternance page, now only forwarding visitors to the page that replaced the anchor they
 * asked for, or to the Zenetys projects when it is unknown.
 *
 * @returns The rendered redirection notice
 */
export default function AlternancePage() {
    useEffect(() => {
        const anchor = location.hash.slice(1).toLowerCase();
        location.replace(
            Object.hasOwn(alternanceAnchors, anchor)
                ? alternanceAnchors[anchor]
                : alternanceFallback
        );
    }, []);

    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="text-muted-foreground">Cette page a déménagé.</p>
            <Link href={alternanceFallback} className="text-primary hover:underline">
                Voir les projets réalisés chez Zenetys
            </Link>
        </main>
    );
}