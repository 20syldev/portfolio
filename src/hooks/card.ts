"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Project } from "@/data/projects";
import { getProject } from "@/lib/projects";

// Location restored when a card opened from a shared link is closed
const fallback = { path: "/repositories/", title: "Projets - Sylvain L." };

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
 * @param initialProjectId - Project identifier opened from a /card/<id> URL
 * @returns The opened project with its open and close handlers
 */
export function useCard(initialProjectId?: string) {
    const [project, setProject] = useState<Project | null>(
        () => (initialProjectId ? getProject(initialProjectId) : undefined) ?? null
    );
    const origin = useRef<{ path: string; title: string } | null>(null);
    const pushed = useRef(false);

    const open = useCallback((next: Project) => {
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
        function sync() {
            const id = cardId(location.pathname);
            pushed.current = !!id && !!origin.current;
            setProject(id ? (getProject(id) ?? null) : null);
        }

        addEventListener("popstate", sync);
        return () => removeEventListener("popstate", sync);
    }, []);

    // Mirror the card metadata in the tab title while it stays open
    useEffect(() => {
        if (!project) return;

        const previous = origin.current?.title ?? fallback.title;
        document.title = `${project.name} - Sylvain L.`;

        return () => {
            document.title = previous;
        };
    }, [project]);

    return { project, open, close };
}