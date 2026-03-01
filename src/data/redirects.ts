// Mapping project IDs to their API keys
const ID_TO_API_KEY: Record<string, string> = {
    "2048": "g_2048",
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
    return ID_TO_API_KEY[projectId] || projectId;
}

// Mapping PDF file paths to their route slugs
export const pdfs: Record<string, string> = {
    "/CV.pdf": "/cv/",
};

// Redirects from sylvain.sh/[slug] to target URL
export const redirects: Record<string, string> = {
    "2048": "https://2048.sylvain.sh",
    api: "https://api.sylvain.sh",
    cdn: "https://cdn.sylvain.sh/npm",
    chat: "https://chat.sylvain.sh",
    digit: "https://digit.sylvain.sh",
    discord: "https://discord.com/users/607163002755481602",
    docs: "https://docs.sylvain.sh",
    donut: "https://donut.sylvain.sh",
    flowers: "https://flowers.sylvain.sh",
    git: "https://github.com/20syldev",
    lebonchar: "https://lebonchar.sylvain.sh",
    logs: "https://logs.sylvain.sh",
    morpion: "https://morpion.sylvain.sh",
    password: "https://password.sylvain.sh",
    php: "https://php.sylvain.sh",
    ping: "https://ping.sylvain.sh",
    planning: "https://planning.sylvain.sh",
    readme: "https://readme.sylvain.sh",
    status: "https://status.sylvain.sh",
    terminal: "https://terminal.sylvain.sh",
    timestamp: "https://timestamp.sylvain.sh",
    wrkit: "https://wrkit.sylvain.sh",
};

/**
 * Retrieves the display name for a redirect slug.
 * Maps URL slugs to human-readable titles for redirect pages.
 *
 * @param slug - The redirect slug identifier
 * @returns The display title, or the slug itself if no mapping exists
 */
export function getRedirectTitle(slug: string): string {
    const names: Record<string, string> = {
        "2048": "2048",
        api: "API",
        cdn: "CDN NPM",
        chat: "Chat",
        digit: "Digit",
        discord: "Discord",
        docs: "Documentation",
        donut: "Donut",
        flowers: "Flowers",
        git: "GitHub",
        lebonchar: "Le Bon Char",
        logs: "Logs",
        morpion: "Morpion",
        password: "Password",
        php: "PHP",
        ping: "Ping",
        planning: "Planning",
        readme: "README",
        status: "Status",
        terminal: "Terminal",
        timestamp: "Timestamp",
        wrkit: "Wrkit",
    };
    return names[slug] || slug;
}