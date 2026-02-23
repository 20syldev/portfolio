import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDocCategories, getDocsByCategory, getSubcategories } from "@/lib/docs";

import { Listing } from "./listing";

export const dynamicParams = false;

interface Props {
    params: Promise<{ category: string }>;
}

/**
 * Generates static parameters for all doc categories at build time.
 *
 * @returns Array of category parameter objects
 */
export async function generateStaticParams() {
    return getDocCategories().map((category) => ({ category }));
}

/**
 * Generates metadata for the category listing page.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the category
 * @returns Page metadata with title
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params;
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    const description = `Documentation de la catégorie ${capitalized}.`;
    return {
        title: `${capitalized} - Aide - Sylvain L.`,
        description,
        openGraph: {
            title: `${capitalized} - Aide - Sylvain L.`,
            description,
            type: "website",
        },
    };
}

/**
 * Category listing page showing all docs in a category.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing the category
 * @returns The rendered category listing page
 */
export default async function Page({ params }: Props) {
    const { category } = await params;
    const allCategoryDocs = getDocsByCategory(category);

    const categoryDocs = allCategoryDocs.filter((doc) => !doc.slug.includes("/"));

    // Get subcategories for this category
    const subcategories = getSubcategories(category);

    if (categoryDocs.length === 0 && subcategories.length === 0) {
        notFound();
    }

    return <Listing category={category} docs={categoryDocs} subcategories={subcategories} />;
}