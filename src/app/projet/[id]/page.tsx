import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { projects } from "@/data/projects";
import { renamedProjects } from "@/data/redirects";
import { getProjectContent } from "@/lib/content";
import { getProject } from "@/lib/projects";

import { Doc } from "./doc";

export const dynamicParams = false;

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * Generates static parameters for all project documentation pages at build time.
 * The former IDs of renamed projects are included, they redirect to the current page.
 *
 * @returns Array of project ID parameter objects for projects with content
 */
export async function generateStaticParams() {
    const current = projects.filter((p) => p.hasContent).map((p) => p.id);
    const former = Object.entries(renamedProjects)
        .filter(([, id]) => current.includes(id))
        .map(([oldId]) => oldId);
    return [...current, ...former].map((id) => ({ id }));
}

/**
 * Generates metadata for the project documentation page.
 * A former ID of a renamed project only gets a placeholder title, as its page redirects.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the project ID
 * @returns Page metadata with title, description and OpenGraph data
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const project = getProject(id);

    if (renamedProjects[id]) {
        return {
            title: "Redirection...",
            alternates: { canonical: `/projet/${renamedProjects[id]}/` },
        };
    }

    if (!project) {
        return { title: "Projet non trouvé" };
    }

    return {
        title: `${project.name} - Sylvain L.`,
        description: project.description,
        alternates: { canonical: `/projet/${id}/` },
        openGraph: {
            title: `${project.name} - Sylvain L.`,
            description: project.description,
            type: "article",
        },
    };
}

/**
 * Full-page project documentation view with sidebar navigation.
 * A former ID of a renamed project redirects to the page of its current ID.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the project ID
 * @returns The rendered documentation page
 */
export default async function Page({ params }: Props) {
    const { id } = await params;
    if (renamedProjects[id]) redirect(`/projet/${renamedProjects[id]}`);

    const project = getProject(id);
    const content = getProjectContent(id);

    if (!project || !content) {
        notFound();
    }

    return <Doc project={project} content={content} />;
}
