"use client";

import RepositoriesPage from "@/app/repositories/page";

interface CardProps {
    projectId: string;
}

export function Card({ projectId }: CardProps) {
    return <RepositoriesPage initialProjectId={projectId} />;
}