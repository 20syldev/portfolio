import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { projects } from "@/data/projects";
import { getProject, getProjectContent } from "@/lib/projects";

import { Doc } from "./doc";

export const dynamicParams = false;

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * Generates static parameters for all project documentation pages at build time.
 *
 * @returns Array of project ID parameter objects for projects with content
 */
export async function generateStaticParams() {
    return projects.filter((p) => p.hasContent).map((p) => ({ id: p.id }));
}

/**
 * Generates metadata for the project documentation page.
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
 * Full-page project documentation view with sidebar navigation.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the project ID
 * @returns The rendered documentation page
 */
export default async function Page({ params }: Props) {
    const { id } = await params;
    const project = getProject(id);
    const content = getProjectContent(id);

    if (!project || !content) {
        notFound();
    }

    return <Doc project={project} content={content} />;
}