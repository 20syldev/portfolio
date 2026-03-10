import projectsData from "./projects.json";

export interface Project {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    tags: string[];
    github?: string;
    demo?: string;
    npm?: string;
    docs?: string;
    image?: string;
    archived?: boolean;
    paused?: boolean;
    lastUpdated?: string;
    version?: string;
    hasContent: boolean;
    content?: string;
}

// Project entries loaded from projects.json
export const projects: Project[] = projectsData as Project[];