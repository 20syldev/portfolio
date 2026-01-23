import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getRedirectTitle, redirects } from "@/data/redirects";

export const dynamicParams = false;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return Object.keys(redirects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Redirection vers ${getRedirectTitle(slug)}...`,
    };
}

export default async function RedirectPage({ params }: Props) {
    const { slug } = await params;
    redirect(redirects[slug]);
}