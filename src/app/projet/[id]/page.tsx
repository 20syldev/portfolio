import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { projects } from "@/data/projects";
import { getProject, getProjectContent } from "@/lib/projects";

import { Doc } from "./doc";

export const dynamicParams = false;

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return projects.filter((p) => p.hasContent).map((p) => ({ id: p.id }));
}

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

export default async function Page({ params }: Props) {
    const { id } = await params;
    const project = getProject(id);
    const content = getProjectContent(id);

    if (!project || !content) {
        notFound();
    }

    return <Doc project={project} content={content} />;
}