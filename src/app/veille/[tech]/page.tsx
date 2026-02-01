import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { veilles } from "@/data/veille";
import { getVeille, getVeilleContent } from "@/lib/veille";

import { Doc } from "./doc";

export const dynamicParams = false;

interface Props {
    params: Promise<{ tech: string }>;
}

export async function generateStaticParams() {
    return veilles.filter((v) => v.hasContent).map((v) => ({ tech: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tech } = await params;
    const veille = getVeille(tech);

    if (!veille) {
        return { title: "Veille non trouvée" };
    }

    return {
        title: `Veille ${veille.title} - Sylvain L.`,
        description: veille.description,
        openGraph: {
            title: `Veille ${veille.title}`,
            description: veille.description,
            type: "article",
        },
    };
}

export default async function Page({ params }: Props) {
    const { tech } = await params;
    const veille = getVeille(tech);
    const content = getVeilleContent(tech);

    if (!veille || !content) {
        notFound();
    }

    return <Doc veille={veille} content={content} />;
}