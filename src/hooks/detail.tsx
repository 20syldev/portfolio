"use client";

import { createContext, type ReactNode, useCallback, useContext, useRef, useState } from "react";

import { DetailModal } from "@/components/detail";
import { type Project, projects } from "@/data/projects";
import { getProjectContent } from "@/lib/projects";

interface OpenProjectOptions {
    onClose?: () => void;
    skipUpdate?: boolean;
}

interface ProjectDetailContextValue {
    openProject: (projectId: string, options?: OpenProjectOptions) => void;
    closeProject: () => void;
}

const ProjectDetailContext = createContext<ProjectDetailContextValue | null>(null);

/**
 * Context provider for project detail modal management.
 * Handles opening/closing project modals with URL synchronization.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap
 * @returns The provider wrapping children with the detail modal
 */
export function ProjectDetailProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const onCloseRef = useRef<(() => void) | null>(null);
    const previousUrlRef = useRef<string | null>(null);

    const openProject = useCallback((projectId: string, options?: OpenProjectOptions) => {
        const { onClose, skipUpdate } = options ?? {};
        const found = projects.find((p) => p.id === projectId);
        if (found) {
            if (!skipUpdate) {
                const url = `/preview/${projectId}/`;
                previousUrlRef.current = location.pathname;
                requestAnimationFrame(() => history.pushState(null, "", url));
            }
            setProject(found);
            onCloseRef.current = onClose ?? null;
            setOpen(true);
        }
    }, []);

    const closeProject = useCallback(() => {
        setOpen(false);
        setProject(null);
        if (onCloseRef.current) {
            setTimeout(() => {
                onCloseRef.current?.();
                onCloseRef.current = null;
            }, 150);
        }
        if (previousUrlRef.current) {
            history.replaceState(null, "", previousUrlRef.current);
            previousUrlRef.current = null;
        }
    }, []);

    return (
        <ProjectDetailContext.Provider value={{ openProject, closeProject }}>
            {children}
            <DetailModal
                project={project}
                content={project ? getProjectContent(project.id) : null}
                open={open}
                onOpenChange={(isOpen) => {
                    if (!isOpen) closeProject();
                }}
            />
        </ProjectDetailContext.Provider>
    );
}

/**
 * Accesses the project detail context for opening and closing project modals.
 *
 * @returns Context value with openProject and closeProject methods
 * @throws Error if used outside of ProjectDetailProvider
 */
export function useProjectDetail() {
    const context = useContext(ProjectDetailContext);
    if (!context) {
        throw new Error("useProjectDetail must be used within a ProjectDetailProvider");
    }
    return context;
}