import projectsData from "./projects-index.json";

/**
 * Image placed in a markdown page, resolved at build time by scripts/generate.ts.
 * `ref` is the path written in the markdown. When `dark` is set, `src` is the light
 * variant and the page shows the one matching the theme.
 */
export interface ContentImage {
    ref: string;
    src: string;
    dark?: string;
    alt: string;
    width: number;
    height: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    tags: string[];
    github?: string;
    demo?: string;
    article?: string;
    npm?: string;
    docs?: string;
    image?: string;
    images?: ContentImage[];
    archived?: boolean;
    paused?: boolean;
    work?: boolean;
    lastUpdated?: string;
    version?: string;
    hasContent: boolean;
}

// Project entries loaded from projects-index.json
export const projects: Project[] = projectsData as Project[];
