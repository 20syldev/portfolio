import { type CSSProperties, isValidElement, type ReactNode } from "react";

/**
 * Shared class list for inline prose links.
 *
 * Renders as a plain underlined link, then inverts into a rounded bubble on hover and on
 * keyboard focus. Negative margins cancel the horizontal padding so the bubble never shifts
 * the surrounding text, and `relative` lifts the link into the positioned paint layer so the
 * bubble covers the characters on both of its sides instead of only the one before it.
 *
 * A link wrapping inline code leaves the code chip untouched and drops its own padding
 * instead, so the bubble lands exactly on the chip the reader already sees. The nested
 * `<code>` only gives up its background on hover, which leaves the bubble a single solid box
 * with no second background inside it and no geometry change between the two states.
 *
 * The bubble colour reads from `--link-tint`, which {@link linkTint} sets per keyword.
 */
export const linkStyles = [
    "relative text-primary underline underline-offset-4",
    "-mx-1.5 px-1.5 py-0.5 rounded-sm transition-colors",
    "has-[code]:mx-0 has-[code]:p-0 has-[code]:rounded",
    "hover:[&_code]:bg-transparent focus-visible:[&_code]:bg-transparent",
    "hover:bg-[var(--link-tint,var(--color-primary))]",
    "hover:text-[var(--link-tint-fg,var(--color-primary-foreground))]",
    "hover:no-underline",
    "focus-visible:bg-[var(--link-tint,var(--color-primary))]",
    "focus-visible:text-[var(--link-tint-fg,var(--color-primary-foreground))]",
    "focus-visible:no-underline focus-visible:outline-none",
].join(" ");

/**
 * Signature violet, shared with the selection highlight and the sparkle trail.
 * Text colour for the tints that are too light to carry white.
 */
const own = "oklch(0.55 0.2 280)";
const ink = "#101010";

/**
 * Bubble colour per keyword, matched case-insensitively against the link label *and* its
 * hostname, so "TypeScript Handbook" is tinted wherever it points and a prose label such as
 * "la doc" still picks up its tint from `docs.sylvain.sh`.
 *
 * Matched in order, so the first entry wins for a link naming several ("Vue.js GitHub
 * Repository"). Every colour is the real brand colour: an approximation would not be
 * recognised, and an unrecognised tint is only noise. Names whose brand *is* neutral —
 * GitHub, Next.js — keep the default bubble on purpose.
 *
 * Foregrounds are picked from the measured WCAG contrast against each background, never
 * assumed: #42b883 and #17b8ce fail badly under white and need dark ink instead.
 */
const tints: ReadonlyArray<readonly [keyword: string, color: string, ink: string]> = [
    ["sylvain.sh", own, "#fff"],
    ["@20syldev", own, "#fff"],
    ["zenetys", "#17b8ce", ink],
    ["typescript", "#3178c6", "#fff"],
    ["vue", "#42b883", ink],
    ["node", "#43853d", "#fff"],
    ["react", "#087ea4", "#fff"],
    ["php", "#777bb3", ink],
    ["npm", "#cb3837", "#fff"],
];

/**
 * Flattens a React node to its text content.
 *
 * @param node - Node to read
 * @returns Concatenated text of the node and its descendants
 */
function textOf(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(textOf).join("");
    if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
    return "";
}

/**
 * Resolves the bubble tint for a link from the words it shows and the host it points at.
 *
 * @param label - Link content, plain text or React nodes
 * @param href - Link destination, used when the label itself names nothing
 * @returns Style object carrying the tint variables, or undefined for the neutral bubble
 */
export function linkTint(label: ReactNode, href?: string): CSSProperties | undefined {
    let host = "";
    if (href && !href.startsWith("#")) {
        try {
            host = new URL(href, "https://sylvain.sh").hostname;
        } catch {
            host = "";
        }
    }

    const haystack = `${textOf(label)} ${host}`.toLowerCase();
    const match = tints.find(([keyword]) => haystack.includes(keyword));
    if (!match) return undefined;

    return { "--link-tint": match[1], "--link-tint-fg": match[2] } as CSSProperties;
}