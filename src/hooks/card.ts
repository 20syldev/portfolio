"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Project } from "@/data/projects";
import { titles, urls } from "@/lib/nav";
import { getProject } from "@/lib/projects";

// Location restored when a card opened from a shared link is closed
const fallback = { path: "/repositories/", title: "Projets - Sylvain L." };

// Instance that opened the card shown by the URL, among the lists mounted on a page
let owner: symbol | null = null;

/**
 * Reads the title of the tab shown at the current URL.
 *
 * @returns The title, or null if the URL is not the one of a tab
 */
function tabTitle(): string | null {
    const path = location.pathname.replace(/\/$/, "");
    const index = urls.findIndex((url) => url.replace(/\/$/, "") === path);
    return index === -1 ? null : titles[index];
}

/**
 * Builds the shareable URL of a project card.
 *
 * @param id - The unique project identifier
 * @returns The card pathname
 */
function cardPath(id: string): string {
    return `/card/${id}/`;
}

/**
 * Extracts the project identifier out of a pathname.
 *
 * @param path - The pathname to read
 * @returns The project identifier, or null if the path is not a card URL
 */
function cardId(path: string): string | null {
    return path.match(/^\/card\/([^/]+)\/?$/)?.[1] ?? null;
}

/**
 * Keeps the opened project card in sync with the browser URL.
 * Opening a card pushes its shareable /card/<id> URL, closing it restores the
 * previous location, and back/forward navigation reopens or closes the card.
 *
 * When several lists are mounted at once, only the one that opened a card reopens it on forward
 * navigation, while leaving a card URL closes it in every list.
 *
 * @param initialProjectId - Project identifier opened from a /card/<id> URL
 * @returns The opened project with its open and close handlers
 */
export function useCard(initialProjectId?: string) {
    const [project, setProject] = useState<Project | null>(
        () => (initialProjectId ? getProject(initialProjectId) : undefined) ?? null
    );
    const origin = useRef<{ path: string; title: string } | null>(null);
    const pushed = useRef(false);
    const self = useRef(Symbol());

    const open = useCallback((next: Project) => {
        owner = self.current;
        origin.current = {
            path: location.pathname + location.search + location.hash,
            title: document.title,
        };
        history.pushState(null, "", cardPath(next.id));
        pushed.current = true;
        setProject(next);
    }, []);

    const close = useCallback(() => {
        setProject(null);

        // Drop the entry pushed on open, otherwise leave the shared link behind
        if (pushed.current) {
            pushed.current = false;
            history.back();
        } else if (cardId(location.pathname)) {
            history.replaceState(null, "", fallback.path);
        }
    }, []);

    // Follow back and forward navigation between a card URL and its origin
    useEffect(() => {
        if (initialProjectId) owner = self.current;

        function sync() {
            const id = cardId(location.pathname);
            if (id && owner !== self.current) return;

            pushed.current = !!id && !!origin.current;
            setProject(id ? (getProject(id) ?? null) : null);
        }

        addEventListener("popstate", sync);
        return () => removeEventListener("popstate", sync);
    }, [initialProjectId]);

    // Mirror the card metadata in the tab title while it stays open
    useEffect(() => {
        if (!project) return;

        const previous = origin.current?.title ?? fallback.title;
        document.title = `${project.name} - Sylvain L.`;

        return () => {
            document.title = tabTitle() ?? previous;
        };
    }, [project]);

    return { project, open, close };
}