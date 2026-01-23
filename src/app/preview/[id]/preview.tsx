"use client";

import { useEffect, useRef } from "react";

import RepositoriesPage from "@/app/repositories/page";
import { useProjectDetail } from "@/hooks/detail";

interface PreviewProps {
    projectId: string;
}

export function Preview({ projectId }: PreviewProps) {
    const { openProject } = useProjectDetail();
    const hasOpened = useRef(false);

    useEffect(() => {
        if (hasOpened.current) return;
        hasOpened.current = true;

        openProject(projectId, {
            onClose: () => {
                history.replaceState(null, "", "/repositories");
            },
            skipUpdate: true,
        });
    }, [projectId, openProject]);

    return <RepositoriesPage />;
}