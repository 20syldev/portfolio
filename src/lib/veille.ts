import { type Veille, veilles } from "@/data/veille";

/**
 * Retrieves the markdown content of a veille article by its identifier.
 *
 * @param veilleId - The unique veille identifier
 * @returns The veille markdown content, or null if not found
 */
export function getVeilleContent(veilleId: string): string | null {
    const veille = veilles.find((v) => v.id === veilleId);
    return veille?.content ?? null;
}

/**
 * Checks whether a veille article has associated markdown content.
 *
 * @param veilleId - The unique veille identifier
 * @returns True if the veille has content, false otherwise
 */
export function hasVeilleContent(veilleId: string): boolean {
    const veille = veilles.find((v) => v.id === veilleId);
    return veille?.hasContent ?? false;
}

/**
 * Finds a veille article by its identifier.
 *
 * @param veilleId - The unique veille identifier
 * @returns The matching veille, or undefined if not found
 */
export function getVeille(veilleId: string): Veille | undefined {
    return veilles.find((v) => v.id === veilleId);
}

/**
 * Retrieves all veille articles.
 *
 * @returns Array of all veille articles
 */
export function getAllVeilles(): Veille[] {
    return veilles;
}