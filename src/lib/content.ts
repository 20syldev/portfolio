import docsContent from "@/data/docs-content.json";
import projectsContent from "@/data/projects-content.json";
import veilleContent from "@/data/veille-content.json";

const docsText: Record<string, string> = docsContent;
const projectsText: Record<string, string> = projectsContent;
const veilleText: Record<string, string> = veilleContent;

/**
 * Retrieves the markdown content of a doc by its identifier.
 * Kept apart from the doc index so that only the server pages, which pass one page on, import it.
 *
 * @param docId - The unique doc identifier
 * @returns The doc markdown content, or null if the doc has none
 */
export function getDocContent(docId: string): string | null {
    return docsText[docId] ?? null;
}

/**
 * Retrieves the markdown content of a project by its identifier.
 *
 * @param projectId - The unique project identifier
 * @returns The project markdown content, or null if the project has none
 */
export function getProjectContent(projectId: string): string | null {
    return projectsText[projectId] ?? null;
}

/**
 * Retrieves the markdown content of a veille article by its identifier.
 *
 * @param veilleId - The unique veille identifier
 * @returns The veille markdown content, or null if the article has none
 */
export function getVeilleContent(veilleId: string): string | null {
    return veilleText[veilleId] ?? null;
}