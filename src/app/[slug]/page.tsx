import { redirects, getRedirectTitle } from "@/data/redirects";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return Object.keys(redirects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const url = redirects[slug];

    if (!url) return { title: "Page introuvable" };

    return {
        title: `Redirection vers ${getRedirectTitle(slug)}...`,
    };
}

export default async function RedirectPage({ params }: Props) {
    const { slug } = await params;
    const url = redirects[slug];

    if (!url) notFound();
    redirect(url);
}