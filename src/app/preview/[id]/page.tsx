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
        title: `${project.name} - ${profile.name}`,
        description: project.description,
        openGraph: {
            title: `${project.name} - ${profile.name}`,
            description: project.description,
            type: "article",
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const project = getProject(id);

    if (!project || !project.hasContent) {
        notFound();
    }

    return <Preview projectId={id} />;
}