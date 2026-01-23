import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { projects } from "@/data/projects";
import { getProject } from "@/lib/projects";

import { Card } from "./card";

export const dynamicParams = false;

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return projects.map((p) => ({ id: p.id }));
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

    if (!project) {
        notFound();
    }

    return <Card projectId={id} />;
}