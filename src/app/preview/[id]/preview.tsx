"use client";

import { useEffect, useRef } from "react";

import RepositoriesPage from "@/app/repositories/page";
import { useProjectDetail } from "@/hooks/detail";

interface PreviewProps {
    projectId: string;
}

/**
 * Client component that automatically opens the project detail modal on mount.
 *
 * @param props - Component props
 * @param props.projectId - ID of the project to preview
 * @returns The rendered repositories page with detail modal
 */
export function Preview({ projectId }: PreviewProps) {
    const { openProject } = useProjectDetail();
    const hasOpened = useRef(false);

    useEffect(() => {
        if (hasOpened.current) return;
        hasOpened.current = true;

        openProject(projectId, {
            onClose: () => {
                history.replaceState(null, "", "/repositories");
                document.title = "Projets - Sylvain L.";
            },
            skipUpdate: true,
        });
    }, [projectId, openProject]);

    return <RepositoriesPage />;
}