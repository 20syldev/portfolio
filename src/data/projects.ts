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
    image?: string;
    featured?: boolean;
    archived?: boolean;
    paused?: boolean;
    subtitle?: string;
    lastUpdated?: string;
    version?: string;
    hasContent: boolean;
    content?: string;
}

export interface ProjectSection {
    id: string;
    title: string;
}

export const PROJECT_SECTIONS: ProjectSection[] = [
    { id: "about", title: "À propos" },
    { id: "features", title: "Fonctionnalités" },
    { id: "stack", title: "Stack technique" },
    { id: "screenshots", title: "Captures" },
];

export const projects: Project[] = projectsData as Project[];