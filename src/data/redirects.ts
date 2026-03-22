import { projects } from "@/data/projects";

// Mapping project IDs to their API keys
const keyId: Record<string, string> = {
    "python-api": "python_api",
    "old-database": "old_database",
    "drawio-plugin": "drawio_plugin",
};

/**
 * Converts a project identifier to its corresponding API key.
 *
 * @param projectId - The project identifier to convert
 * @returns The mapped API key, or the original identifier if no mapping exists
 */
export function getApiKey(projectId: string): string {
    return keyId[projectId] || projectId;
}

// Mapping PDF file paths to their route slugs
export const pdfs: Record<string, string> = {
    "/CV.pdf": "/cv/",
};

// Non-project redirects
const extraRedirects: Record<string, string> = {
    discord: "https://discord.com/users/607163002755481602",
    git: "https://github.com/20syldev",
    status: "https://status.sylvain.sh",
};

// Redirects from sylvain.sh/[slug] to target URL
export const redirects: Record<string, string> = {
    ...Object.fromEntries(
        projects
            .filter((p) => p.id !== "portfolio")
            .map((p) => [p.id, p.demo || (p.docs ? `/help/${p.docs}` : `/projet/${p.id}`)])
    ),
    ...extraRedirects,
};

/**
 * Retrieves the display name for a redirect slug.
 *
 * @param slug - The redirect slug identifier
 * @returns The display title, or the slug itself if no mapping exists
 */
export function getRedirectTitle(slug: string): string {
    const project = projects.find((p) => p.id === slug);
    if (project) return project.name;
    const extraNames: Record<string, string> = {
        discord: "Discord",
        git: "GitHub",
        status: "Status",
    };
    return extraNames[slug] || slug;
}