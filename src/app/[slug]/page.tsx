import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getRedirectTitle, redirects } from "@/data/redirects";

export const dynamicParams = false;

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Generates static parameters for all redirect slugs at build time.
 *
 * @returns Array of slug parameter objects
 */
export async function generateStaticParams() {
    return Object.keys(redirects).map((slug) => ({ slug }));
}

/**
 * Generates metadata for the redirect page.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the slug
 * @returns Page metadata with redirect title
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Redirection vers ${getRedirectTitle(slug)}...`,
    };
}

/**
 * Redirect page that forwards to the target URL based on the slug.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the slug
 * @returns Never renders, redirects immediately
 */
export default async function RedirectPage({ params }: Props) {
    const { slug } = await params;
    redirect(redirects[slug]);
}