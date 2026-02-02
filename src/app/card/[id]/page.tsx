import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { projects } from "@/data/projects";
import { getProject } from "@/lib/projects";

import { Card } from "./card";

export const dynamicParams = false;

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * Generates static parameters for all project card pages at build time.
 *
 * @returns Array of project ID parameter objects
 */
export async function generateStaticParams() {
    return projects.map((p) => ({ id: p.id }));
}

/**
 * Generates metadata for the project card page.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the project ID
 * @returns Page metadata with title, description and OpenGraph data
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const project = getProject(id);

    if (!project) {
        return { title: "Projet non trouvé" };
    }

    return {
        title: `${project.name} - Sylvain L.`,
        description: project.description,
        openGraph: {
            title: `${project.name} - Sylvain L.`,
            description: project.description,
            type: "article",
        },
    };
}

/**
 * Project card page displaying the repositories view with a pre-selected project.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the project ID
 * @returns The rendered card page
 */
export default async function Page({ params }: Props) {
    const { id } = await params;
    const project = getProject(id);

    if (!project) {
        notFound();
    }

    return <Card projectId={id} />;
}