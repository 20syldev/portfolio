import * as fs from "fs";
import * as path from "path";

import matter from "gray-matter";

interface ProjectMeta {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    tags: string[];
    github?: string;
    demo?: string;
    npm?: string;
    image?: string;
    archived?: boolean;
    paused?: boolean;
    lastUpdated?: string;
    version?: string;
    order?: number;
}

interface GeneratedProject extends ProjectMeta {
    hasContent: boolean;
    content?: string;
}

const source = path.join(process.cwd(), "projects");
const output = path.join(process.cwd(), "src", "data", "projects.json");

function generateProjects(): void {
    const projects: GeneratedProject[] = [];

    // Vérifier que le dossier source existe
    if (!fs.existsSync(source)) {
        console.error(`Error: ${source} does not exist`);
        process.exit(1);
    }

    // Lire tous les fichiers .md de projets
    const projectFiles = fs.readdirSync(source).filter((file) => file.endsWith(".md"));

    for (const filename of projectFiles) {
        const projectId = filename.replace(".md", "");
        const filePath = path.join(source, filename);

        // Lire et parser le fichier avec gray-matter
        const fileContent = fs.readFileSync(filePath, "utf-8");
        let parsed;

        try {
            parsed = matter(fileContent);
        } catch (e) {
            console.error(`Error parsing ${filename}:`, e);
            continue;
        }

        const meta = parsed.data as Omit<ProjectMeta, "id">;
        const content = parsed.content.trim();

        // Détecter si le contenu existe (après le frontmatter)
        const hasContent = content.length > 0;

        projects.push({
            id: projectId,
            ...meta,
            hasContent,
            ...(hasContent && { content }),
        } as GeneratedProject);
    }

    // Trier : archived en dernier, puis par order
    projects.sort((a, b) => {
        if (a.archived && !b.archived) return 1;
        if (!a.archived && b.archived) return -1;
        return (a.order ?? 999) - (b.order ?? 999);
    });

    // Écrire le fichier JSON
    fs.writeFileSync(output, JSON.stringify(projects, null, 4), "utf-8");

    console.log(`Generated ${projects.length} projects to ${output}`);
    console.log(`  - ${projects.filter((p) => p.hasContent).length} with content`);
    console.log(`  - ${projects.filter((p) => p.archived).length} archived`);
}

generateProjects();