import { type Doc, docs } from "@/data/docs";

/**
 * Finds a doc by its category and slug.
 *
 * @param category - The doc category (e.g. "github")
 * @param slug - The doc slug (e.g. "pages") or slug array (e.g. ["configuration", "namecheap"])
 * @returns The matching doc, or undefined if not found
 */
export function getDoc(category: string, slug: string | string[]): Doc | undefined {
    const slugStr = Array.isArray(slug) ? slug.join("/") : slug;
    return docs.find((d) => d.category === category && d.slug === slugStr);
}

/**
 * Retrieves the markdown content of a doc by category and slug.
 *
 * @param category - The doc category
 * @param slug - The doc slug or slug array
 * @returns The doc markdown content, or null if not found
 */
export function getDocContent(category: string, slug: string | string[]): string | null {
    const doc = getDoc(category, slug);
    return doc?.content ?? null;
}

/**
 * Retrieves all docs for a given category.
 *
 * @param category - The category to filter by
 * @returns Array of docs in that category
 */
export function getDocsByCategory(category: string): Doc[] {
    return docs.filter((d) => d.category === category);
}

/**
 * Retrieves all docs for a given category and subcategory.
 *
 * @param category - The category to filter by
 * @param subcategory - The subcategory prefix (e.g. "configuration")
 * @returns Array of docs in that subcategory
 */
export function getDocsBySubcategory(category: string, subcategory: string): Doc[] {
    return docs.filter((d) => d.category === category && d.slug.startsWith(subcategory + "/"));
}

/**
 * Retrieves all unique subcategories for a given category.
 *
 * @param category - The category to get subcategories for
 * @returns Array of subcategory names
 */
export function getSubcategories(category: string): string[] {
    const subcats = new Set<string>();
    docs.filter((d) => d.category === category && d.slug.includes("/")).forEach((d) => {
        const parts = d.slug.split("/");
        if (parts.length > 1) {
            subcats.add(parts[0]);
        }
    });
    return Array.from(subcats);
}

/**
 * Retrieves all unique doc categories.
 *
 * @returns Array of unique category names
 */
export function getDocCategories(): string[] {
    return [...new Set(docs.map((d) => d.category))];
}