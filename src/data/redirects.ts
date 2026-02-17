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

// Redirects from sylvain.pro/[slug] to target URL
export const redirects: Record<string, string> = {
    "2048": "https://2048.sylvain.pro",
    api: "https://api.sylvain.pro",
    cdn: "https://cdn.sylvain.pro/npm",
    chat: "https://chat.sylvain.pro",
    digit: "https://digit.sylvain.pro",
    discord: "https://discord.com/users/607163002755481602",
    docs: "https://docs.sylvain.pro",
    donut: "https://donut.sylvain.pro",
    flowers: "https://flowers.sylvain.pro",
    git: "https://github.com/20syldev",
    lebonchar: "https://lebonchar.site",
    logs: "https://logs.sylvain.pro",
    morpion: "https://morpion.sylvain.pro",
    password: "https://password.sylvain.pro",
    php: "https://php.sylvain.pro",
    ping: "https://ping.sylvain.pro",
    planning: "https://planning.sylvain.pro",
    readme: "https://readme.sylvain.pro",
    status: "https://status.sylvain.pro",
    terminal: "https://terminal.sylvain.pro",
    timestamp: "https://timestamp.sylvain.pro",
    wrkit: "https://wrkit.sylvain.pro",
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