import * as fs from "fs";
import * as path from "path";

import matter from "gray-matter";
import sharp from "sharp";

import { projectOrder } from "../src/lib/order";

import { buildIco } from "./ico";

interface ProjectMeta {
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

    // Sort: archived last, then by position
    projects.sort((a, b) => {
        if (a.archived && !b.archived) return 1;
        if (!a.archived && b.archived) return -1;
        const ai = projectOrder.indexOf(a.id);
        const bi = projectOrder.indexOf(b.id);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
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

const sitemapOutput = path.join(process.cwd(), "public", "sitemap.xml");

/**
 * Builds a single XML <url> entry for the sitemap.
 *
 * @param loc - Full URL
 * @param lastmod - ISO date string
 * @param priority - Priority value (0.0 to 1.0)
 * @param changefreq - Change frequency
 * @returns XML string for the URL entry
 */
function buildUrlEntry(loc: string, lastmod: string, priority: string, changefreq: string): string {
    return `    <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
}

/**
 * Generates the sitemap.xml file from static pages and generated data.
 * Reads the previously generated JSON files and builds a complete sitemap.
 *
 * @returns void
 */
function generateSitemap(): void {
    const baseUrl = "https://sylvain.sh";
    const now = new Date().toISOString();

    const staticPages = [
        { path: "/", priority: "1.0", changefreq: "weekly" },
        { path: "/repositories/", priority: "0.8", changefreq: "monthly" },
        { path: "/alternance/", priority: "0.8", changefreq: "monthly" },
        { path: "/help/", priority: "0.7", changefreq: "weekly" },
        { path: "/cv/", priority: "0.7", changefreq: "monthly" },
        { path: "/me/", priority: "0.7", changefreq: "monthly" },
        { path: "/tech/", priority: "0.6", changefreq: "monthly" },
        { path: "/veille/", priority: "0.6", changefreq: "monthly" },
        { path: "/badges/", priority: "0.5", changefreq: "monthly" },
        { path: "/certifications/", priority: "0.5", changefreq: "monthly" },
        { path: "/labs/", priority: "0.4", changefreq: "monthly" },
        { path: "/mentions/", priority: "0.3", changefreq: "yearly" },
        { path: "/confidentialite/", priority: "0.3", changefreq: "yearly" },
    ];

    const projects: GeneratedProject[] = JSON.parse(fs.readFileSync(projectsOutput, "utf-8"));
    const veilles: GeneratedVeille[] = JSON.parse(fs.readFileSync(veilleOutput, "utf-8"));
    const docs: GeneratedDoc[] = JSON.parse(fs.readFileSync(docsOutput, "utf-8"));

    const urls: string[] = [];

    for (const page of staticPages) {
        urls.push(buildUrlEntry(baseUrl + page.path, now, page.priority, page.changefreq));
    }

    for (const project of projects.filter((p) => p.hasContent)) {
        const lastmod = project.lastUpdated ? new Date(project.lastUpdated).toISOString() : now;
        urls.push(buildUrlEntry(`${baseUrl}/projet/${project.id}/`, lastmod, "0.7", "monthly"));
    }

    for (const veille of veilles.filter((v) => v.hasContent)) {
        urls.push(buildUrlEntry(`${baseUrl}/veille/${veille.id}/`, now, "0.6", "monthly"));
    }

    const categories = [...new Set(docs.map((d) => d.category))];
    for (const category of categories) {
        urls.push(buildUrlEntry(`${baseUrl}/help/${category}/`, now, "0.5", "weekly"));
    }

    for (const doc of docs.filter((d) => d.hasContent)) {
        urls.push(
            buildUrlEntry(`${baseUrl}/help/${doc.category}/${doc.slug}/`, now, "0.5", "monthly")
        );
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    fs.writeFileSync(sitemapOutput, sitemap, "utf-8");

    console.log(`Generated sitemap with ${urls.length} URLs to ${sitemapOutput}`);
}

const faviconSource = path.join(process.cwd(), "public", "images", "logo.png");
const publicDir = path.join(process.cwd(), "public");

/**
 * Generates favicon variants from the source logo image.
 * Creates properly sized PNG favicons, apple touch icon, and android chrome icons
 * from the high-resolution source logo.
 *
 * @returns Promise that resolves when all favicons are generated
 */
async function generateFavicons(): Promise<void> {
    if (!fs.existsSync(faviconSource)) {
        console.error(`Error: ${faviconSource} does not exist`);
        process.exit(1);
    }

    const variants = [
        { name: "favicon-16x16.png", size: 16 },
        { name: "favicon-32x32.png", size: 32 },
        { name: "apple-touch-icon.png", size: 180 },
        { name: "android-chrome-192x192.png", size: 192 },
        { name: "android-chrome-512x512.png", size: 512 },
    ];

    for (const variant of variants) {
        await sharp(faviconSource)
            .resize(variant.size, variant.size)
            .png()
            .toFile(path.join(publicDir, variant.name));
    }

    // Generate a true multi-resolution favicon.ico
    fs.writeFileSync(
        path.join(publicDir, "favicon.ico"),
        buildIco(
            await Promise.all(
                [16, 32, 48, 256].map(async (size) => ({
                    size,
                    buffer: await sharp(faviconSource).resize(size, size).png().toBuffer(),
                }))
            )
        )
    );

    console.log(`Generated ${variants.length} favicon variants + favicon.ico to ${publicDir}`);
}

generateProjects();
generateVeilles();
generateDocs();
generateSitemap();
generateFavicons();