"use client";

import { Nav } from "@/components/layout/nav";
import { Repositories } from "@/components/sections/repositories";
import { tabs, urls } from "@/lib/nav";

interface CardProps {
    projectId: string;
}

/**
 * Client component showing the projects list with a pre-selected project.
 *
 * @param props - Component props
 * @param props.projectId - ID of the project to display
 * @returns The rendered projects list with the project selected
 */
export function Card({ projectId }: CardProps) {
    return (
        <>
            <Nav currentTab={1} tabs={tabs} links={urls} />
            <main>
                <Repositories initialProjectId={projectId} />
            </main>
        </>
    );
}
