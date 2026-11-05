import { projects } from "@/data/projects";

// Former project IDs mapped to their current ID
export const renamedProjects: Record<string, string> = {
    api: "moxon",
    digit: "neuron",
    readme: "peek",
    whiteboard: "wispen",
};

// Non-project redirects
const extraRedirects: Record<string, string> = {
    discord: "https://discord.com/users/607163002755481602",
    git: "https://github.com/20syldev",
    status: "https://status.sylvain.sh",
};

const currentRedirects: Record<string, string> = Object.fromEntries(
    projects
        .filter((p) => p.id !== "portfolio")
        .map((p) => [p.id, p.demo || (p.docs ? `/help/${p.docs}` : `/projet/${p.id}`)])
);

// Redirects from sylvain.sh/[slug] to target URL
export const redirects: Record<string, string> = {
    ...currentRedirects,
    ...Object.fromEntries(
        Object.entries(renamedProjects).map(([oldId, id]) => [oldId, currentRedirects[id]])
    ),
    ...extraRedirects,
};

/**
 * Retrieves the display name for a redirect slug.
 * A former project ID resolves to the name of the project that replaced it.
 *
 * @param slug - The redirect slug identifier
 * @returns The display title, or the slug itself if no mapping exists
 */
export function getRedirectTitle(slug: string): string {
    const project = projects.find((p) => p.id === (renamedProjects[slug] ?? slug));
    if (project) return project.name;
    const extraNames: Record<string, string> = {
        discord: "Discord",
        git: "GitHub",
        status: "Status",
    };
    return extraNames[slug] || slug;
}