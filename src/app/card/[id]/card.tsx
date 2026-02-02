"use client";

import RepositoriesPage from "@/app/repositories/page";

interface CardProps {
    projectId: string;
}

/**
 * Client component wrapping RepositoriesPage with a pre-selected project.
 *
 * @param props - Component props
 * @param props.projectId - ID of the project to display
 * @returns The rendered repositories page with the project selected
 */
export function Card({ projectId }: CardProps) {
    return <RepositoriesPage initialProjectId={projectId} />;
}