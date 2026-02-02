import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { getProject } from "@/lib/projects";

import { Preview } from "./preview";

export const dynamicParams = false;

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * Generates static parameters for all project preview pages at build time.
 *
 * @returns Array of project ID parameter objects for projects with content
 */
export async function generateStaticParams() {
    return projects.filter((p) => p.hasContent).map((p) => ({ id: p.id }));
}

/**
 * Generates metadata for the project preview page.
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
        title: `${project.name} - ${profile.name}`,
        description: project.description,
        openGraph: {
            title: `${project.name} - ${profile.name}`,
            description: project.description,
            type: "article",
        },
    };
}

/**
 * Project preview page that opens the detail modal over the repositories view.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the project ID
 * @returns The rendered preview page
 */
export default async function Page({ params }: Props) {
    const { id } = await params;
    const project = getProject(id);

    if (!project || !project.hasContent) {
        notFound();
    }

    return <Preview projectId={id} />;
}