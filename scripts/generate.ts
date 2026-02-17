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

interface DocMeta {
    id: string;
    title: string;
    description: string;
    category: string;
    slug: string;
    order?: number;
}

interface GeneratedDoc extends DocMeta {
    hasContent: boolean;
    content?: string;
}

const projectsSource = path.join(process.cwd(), "projects");
const projectsOutput = path.join(process.cwd(), "src", "data", "projects.json");

const veilleSource = path.join(process.cwd(), "veille");
const veilleOutput = path.join(process.cwd(), "src", "data", "veille.json");

const docsSource = path.join(process.cwd(), "docs");
const docsOutput = path.join(process.cwd(), "src", "data", "docs.json");

/**
 * Generates the projects JSON file from markdown sources.
 * Reads all .md files from the projects directory, parses frontmatter and content,
 * sorts by archived status and order, and outputs to src/data/projects.json.
 *
 * @returns void
 */
function generateProjects(): void {
    const projects: GeneratedProject[] = [];

    // Check that the source directory exists
    if (!fs.existsSync(projectsSource)) {
        console.error(`Error: ${projectsSource} does not exist`);
        process.exit(1);
    }

    // Read all project .md files
    const projectFiles = fs.readdirSync(projectsSource).filter((file) => file.endsWith(".md"));

    for (const filename of projectFiles) {
        const projectId = filename.replace(".md", "");
        const filePath = path.join(projectsSource, filename);

        // Read and parse the file with gray-matter
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

        // Detect if content exists (after frontmatter)
        const hasContent = content.length > 0;

        projects.push({
            id: projectId,
            ...meta,
            hasContent,
            ...(hasContent && { content }),
        } as GeneratedProject);
    }

    // Sort: archived last, then by order
    projects.sort((a, b) => {
        if (a.archived && !b.archived) return 1;
        if (!a.archived && b.archived) return -1;
        return (a.order ?? 999) - (b.order ?? 999);
    });

    // Write the JSON file
    fs.writeFileSync(projectsOutput, JSON.stringify(projects, null, 4), "utf-8");

    console.log(`Generated ${projects.length} projects to ${projectsOutput}`);
    console.log(`  - ${projects.filter((p) => p.hasContent).length} with content`);
    console.log(`  - ${projects.filter((p) => p.archived).length} archived`);
}

/**
 * Generates the veille (tech watch) JSON file from markdown sources.
 * Reads all .md files from the veille directory, parses frontmatter and content,
 * sorts by order, and outputs to src/data/veille.json.
 *
 * @returns void
 */
function generateVeilles(): void {
    const veilles: GeneratedVeille[] = [];

    // Check that the source directory exists
    if (!fs.existsSync(veilleSource)) {
        console.error(`Error: ${veilleSource} does not exist`);
        process.exit(1);
    }

    // Read all veille .md files
    const veilleFiles = fs.readdirSync(veilleSource).filter((file) => file.endsWith(".md"));

    for (const filename of veilleFiles) {
        const veilleId = filename.replace(".md", "");
        const filePath = path.join(veilleSource, filename);

        // Read and parse the file with gray-matter
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

        // Detect if content exists (after frontmatter)
        const hasContent = content.length > 0;

        veilles.push({
            id: veilleId,
            ...meta,
            hasContent,
            ...(hasContent && { content }),
        } as GeneratedVeille);
    }

    // Sort by order
    veilles.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    // Write the JSON file
    fs.writeFileSync(veilleOutput, JSON.stringify(veilles, null, 4), "utf-8");

    console.log(`Generated ${veilles.length} veille entries to ${veilleOutput}`);
    console.log(`  - ${veilles.filter((v) => v.hasContent).length} with content`);
}

/**
 * Recursively finds all .md files in a directory and its subdirectories.
 *
 * @param dir - The directory to search
 * @param fileList - Accumulator for found files
 * @returns Array of file paths
 */
function findMarkdownFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findMarkdownFiles(filePath, fileList);
        } else if (file.endsWith(".md")) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

/**
 * Generates the documentation JSON file from markdown sources.
 * Reads all .md files from the docs directory recursively, parses frontmatter and content,
 * automatically detects category from folder structure, sorts by category and order,
 * and outputs to src/data/docs.json.
 *
 * Structure expected: docs/<category>/<slug>.md
 *
 * @returns void
 */
function generateDocs(): void {
    const docs: GeneratedDoc[] = [];

    // Check that the source directory exists
    if (!fs.existsSync(docsSource)) {
        console.error(`Error: ${docsSource} does not exist`);
        process.exit(1);
    }

    // Recursively read all documentation .md files
    const docFiles = findMarkdownFiles(docsSource);

    for (const filePath of docFiles) {
        // Extract category and slug from the file path
        const relativePath = path.relative(docsSource, filePath);
        const parts = relativePath.split(path.sep);

        // If the file is in a subdirectory, use the folder name as category
        const category = parts.length > 1 ? parts[0] : "general";
        const filename = parts[parts.length - 1];
        const slug = filename.replace(".md", "");

        // Generate a unique ID: category-slug
        const docId = `${category}-${slug}`;

        // Read and parse the file with gray-matter
        const fileContent = fs.readFileSync(filePath, "utf-8");
        let parsed;

        try {
            parsed = matter(fileContent);
        } catch (e) {
            console.error(`Error parsing ${relativePath}:`, e);
            continue;
        }

        const meta = parsed.data as Partial<Omit<DocMeta, "id">>;
        const content = parsed.content.trim();

        // Detect if content exists (after frontmatter)
        const hasContent = content.length > 0;

        // Frontmatter metadata takes priority over inferred values
        docs.push({
            id: docId,
            category: meta.category ?? category,
            slug: meta.slug ?? slug,
            title: meta.title ?? slug,
            description: meta.description ?? "",
            order: meta.order,
            hasContent,
            ...(hasContent && { content }),
        });
    }

    // Sort by category then by order
    docs.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return (a.order ?? 999) - (b.order ?? 999);
    });

    // Write the JSON file
    fs.writeFileSync(docsOutput, JSON.stringify(docs, null, 4), "utf-8");

    console.log(`Generated ${docs.length} docs to ${docsOutput}`);
    console.log(`  - ${docs.filter((d) => d.hasContent).length} with content`);

    // Display found categories
    const categories = [...new Set(docs.map((d) => d.category))];
    console.log(`  - Categories: ${categories.join(", ")}`);
}

generateProjects();
generateVeilles();
generateDocs();