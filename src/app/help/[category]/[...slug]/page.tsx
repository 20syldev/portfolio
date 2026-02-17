import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { docs } from "@/data/docs";
import { getDoc, getDocContent, getDocsBySubcategory } from "@/lib/docs";

import { Listing } from "../listing";

import { HelpDoc } from "./content";

export const dynamicParams = false;

interface Props {
    params: Promise<{ category: string; slug: string[] }>;
}

/**
 * Generates static parameters for all doc pages and subcategory listings at build time.
 *
 * @returns Array of category/slug parameter objects
 */
export async function generateStaticParams() {
    const params: { category: string; slug: string[] }[] = [];

    // Generate params for all docs with content
    docs.filter((d) => d.hasContent).forEach((d) => {
        const slugParts = d.slug.split("/");
        params.push({ category: d.category, slug: slugParts });
    });

    // Generate params for subcategory listing pages
    const subcategories = new Map<string, Set<string>>();
    docs.filter((d) => d.slug.includes("/")).forEach((d) => {
        const subcatName = d.slug.split("/")[0];
        if (!subcategories.has(d.category)) {
            subcategories.set(d.category, new Set());
        }
        subcategories.get(d.category)!.add(subcatName);
    });

    subcategories.forEach((subcats, category) => {
        subcats.forEach((subcat) => {
            params.push({ category, slug: [subcat] });
        });
    });

    return params;
}

/**
 * Generates metadata for the doc or subcategory page.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters
 * @returns Page metadata with title and description
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, slug } = await params;
    const slugStr = slug.join("/");
    const doc = getDoc(category, slugStr);

    if (doc) {
        return {
            title: `${doc.title} - Aide - Sylvain L.`,
            description: doc.description,
        };
    }

    // Check if it's a subcategory listing
    const subcategoryDocs = getDocsBySubcategory(category, slug[0]);
    if (subcategoryDocs.length > 0) {
        return {
            title: `${slug[0].charAt(0).toUpperCase() + slug[0].slice(1)} - ${category} - Aide - Sylvain L.`,
        };
    }

    return { title: "Documentation non trouvée" };
}

/**
 * Documentation page - shows either a doc or a subcategory listing.
 *
 * @param props - Page props
 * @param props.params - Dynamic route parameters containing category and slug
 * @returns The rendered doc page or subcategory listing
 */
export default async function Page({ params }: Props) {
    const { category, slug } = await params;
    const slugStr = slug.join("/");

    // Try to find a doc with this exact slug
    const doc = getDoc(category, slugStr);
    if (doc && doc.hasContent) {
        const content = getDocContent(category, slugStr);
        if (content) {
            return <HelpDoc title={doc.title} description={doc.description} content={content} />;
        }
    }

    // If not a doc, check if it's a subcategory (only for single-level slugs)
    if (slug.length === 1) {
        const subcategoryDocs = getDocsBySubcategory(category, slug[0]);
        if (subcategoryDocs.length > 0) {
            return <Listing category={slug[0]} docs={subcategoryDocs} />;
        }
    }

    notFound();
}