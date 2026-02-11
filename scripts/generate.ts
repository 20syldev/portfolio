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

interface VeilleMeta {
    id: string;
    title: string;
    description: string;
    keywords?: string[];
    url?: string;
    order?: number;
}

interface GeneratedVeille extends VeilleMeta {
    hasContent: boolean;
    content?: string;
}

const projectsSource = path.join(process.cwd(), "projects");
const projectsOutput = path.join(process.cwd(), "src", "data", "projects.json");

const veilleSource = path.join(process.cwd(), "veille");
const veilleOutput = path.join(process.cwd(), "src", "data", "veille.json");

function generateProjects(): void {
    const projects: GeneratedProject[] = [];

    // Vérifier que le dossier source existe
    if (!fs.existsSync(projectsSource)) {
        console.error(`Error: ${projectsSource} does not exist`);
        process.exit(1);
    }

    // Lire tous les fichiers .md de projets
    const projectFiles = fs.readdirSync(projectsSource).filter((file) => file.endsWith(".md"));

    for (const filename of projectFiles) {
        const projectId = filename.replace(".md", "");
        const filePath = path.join(projectsSource, filename);

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
    fs.writeFileSync(projectsOutput, JSON.stringify(projects, null, 4), "utf-8");

    console.log(`Generated ${projects.length} projects to ${projectsOutput}`);
    console.log(`  - ${projects.filter((p) => p.hasContent).length} with content`);
    console.log(`  - ${projects.filter((p) => p.archived).length} archived`);
}

function generateVeilles(): void {
    const veilles: GeneratedVeille[] = [];

    // Vérifier que le dossier source existe
    if (!fs.existsSync(veilleSource)) {
        console.error(`Error: ${veilleSource} does not exist`);
        process.exit(1);
    }

    // Lire tous les fichiers .md de veille
    const veilleFiles = fs.readdirSync(veilleSource).filter((file) => file.endsWith(".md"));

    for (const filename of veilleFiles) {
        const veilleId = filename.replace(".md", "");
        const filePath = path.join(veilleSource, filename);

        // Lire et parser le fichier avec gray-matter
        const fileContent = fs.readFileSync(filePath, "utf-8");
        let parsed;

        try {
            parsed = matter(fileContent);
        } catch (e) {
            console.error(`Error parsing ${filename}:`, e);
            continue;
        }

        const meta = parsed.data as Omit<VeilleMeta, "id">;
        const content = parsed.content.trim();

        // Détecter si le contenu existe (après le frontmatter)
        const hasContent = content.length > 0;

        veilles.push({
            id: veilleId,
            ...meta,
            hasContent,
            ...(hasContent && { content }),
        } as GeneratedVeille);
    }

    // Trier par order
    veilles.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    // Écrire le fichier JSON
    fs.writeFileSync(veilleOutput, JSON.stringify(veilles, null, 4), "utf-8");

    console.log(`Generated ${veilles.length} veille entries to ${veilleOutput}`);
    console.log(`  - ${veilles.filter((v) => v.hasContent).length} with content`);
}

generateProjects();
generateVeilles();