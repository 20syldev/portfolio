import * as fs from "fs";

import sharp from "sharp";

// Signature style of the mail icons: dark pink glyph centered on a soft pink disc
const glyphColor = "#a12c88";
const circleColor = "#fbe9f6";
const canvas = 512; // Working resolution, downscaled on write
const glyphBox = 0.54; // Glyph fits in 54% of the disc
const output = 128;

interface Glyph {
    tag: string;
    inner: string;
}

/**
 * Converts a React style attribute name to its SVG spelling.
 *
 * @param name - Attribute name, camelCase or already kebab-case
 * @returns The SVG attribute name
 */
function attribute(name: string): string {
    return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/**
 * Rebuilds the markup of a Lucide icon from its exported node definition.
 *
 * @param name - Lucide icon name in kebab-case, e.g. "file-user"
 * @returns The glyph root tag and its inner markup
 */
async function lucideGlyph(name: string): Promise<Glyph> {
    const icon = await import(`lucide-react/dist/esm/icons/${name}.js`).catch(() => null);
    if (!icon) throw new Error(`Unknown Lucide icon: ${name}`);

    const nodes = icon.__iconNode as [string, Record<string, string>][];
    const inner = nodes
        .map(([tag, attrs]) => {
            const props = Object.entries(attrs)
                .filter(([key]) => key !== "key")
                .map(([key, value]) => `${attribute(key)}="${value}"`);
            return `<${tag} ${props.join(" ")}/>`;
        })
        .join("");

    return {
        tag:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
            'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        inner,
    };
}

/**
 * Turns every painted color of a markup into the inherited ink.
 * Transparent parts are left alone, as they carve the shape of the glyph.
 *
 * @param markup - SVG markup to repaint
 * @returns The markup painted with currentColor
 */
function ink(markup: string): string {
    return markup.replace(/(fill|stroke)="(?!none")[^"]*"/g, '$1="currentColor"');
}

/**
 * Reads a glyph from an SVG file and makes it follow the signature color.
 * Icons carrying no color of their own (Simple Icons) are filled instead.
 *
 * @param file - Path to the SVG file
 * @returns The glyph root tag and its inner markup
 */
function fileGlyph(file: string): Glyph {
    const svg = fs.readFileSync(file, "utf8");
    const [, tag, inner] = svg.match(/(<svg[^>]*>)([\s\S]*)<\/svg>/) ?? [];
    if (!tag || !inner) throw new Error(`No SVG content found in ${file}`);
    if (!tag.includes("viewBox")) throw new Error(`No viewBox found in ${file}`);
    if (svg.includes("currentColor")) return { tag, inner };

    const painted = { tag: ink(tag), inner: ink(inner) };
    if (painted.tag.includes("currentColor") || painted.inner.includes("currentColor")) {
        return painted;
    }

    return { tag: tag.replace("<svg", '<svg fill="currentColor"'), inner };
}

/**
 * Renders a round mail-signature icon from a Lucide name or an SVG file.
 *
 * @param source - Lucide icon name in kebab-case, or a path to an SVG file
 * @param out - Path of the PNG file to write
 */
async function build(source: string, out: string) {
    const glyph = source.endsWith(".svg") ? fileGlyph(source) : await lucideGlyph(source);
    const box = Math.round(canvas * glyphBox);
    const offset = (canvas - box) / 2;

    const tag = glyph.tag
        .replace(/\s(width|height|x|y)="[^"]*"/g, "")
        .replace(
            "<svg",
            `<svg x="${offset}" y="${offset}" width="${box}" height="${box}" color="${glyphColor}"`
        );

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}">
        <circle cx="${canvas / 2}" cy="${canvas / 2}" r="${canvas / 2}" fill="${circleColor}"/>
        ${tag}${glyph.inner}</svg>
    </svg>`;

    await sharp(Buffer.from(svg)).resize(output, output).png({ compressionLevel: 9 }).toFile(out);

    console.log(`✓ ${out}`);
}

const [source, out] = process.argv.slice(2);

if (!source || !out) {
    console.error("Usage: npm run icon -- <lucide-name|glyph.svg> <out.png>");
    process.exit(1);
}

build(source, out).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});