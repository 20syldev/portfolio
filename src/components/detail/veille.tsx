"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "./mdx";

interface SourceCategory {
    title: string;
    links: Array<{
        text: string;
        url: string;
    }>;
}

interface VeilleContentProps {
    content: string | null;
}

/**
 * Parse source categories from markdown content
 */
function parseSourceCategories(content: string): SourceCategory[] {
    const categories: SourceCategory[] = [];
    const sourcesSection = content.match(/## Sources.*?\n([\s\S]*?)$/);

    if (!sourcesSection) return categories;

    // Match h4 titles and their lists
    const categoryPattern = /#### (.*?)\n\n((?:- \[.*?\]\(.*?\)\n?)+)/g;
    let match;

    while ((match = categoryPattern.exec(sourcesSection[1])) !== null) {
        const title = match[1];
        const linksText = match[2];
        const links: Array<{ text: string; url: string }> = [];

        // Extract individual links
        const linkPattern = /- \[(.*?)\]\((.*?)\)/g;
        let linkMatch;

        while ((linkMatch = linkPattern.exec(linksText)) !== null) {
            links.push({
                text: linkMatch[1],
                url: linkMatch[2],
            });
        }

        categories.push({ title, links });
    }

    return categories;
}

/**
 * Remove news and sources sections from content
 */
function removeSpecialSections(content: string): string {
    return content.replace(/## Sources.*?\n[\s\S]*?$/, "");
}

/**
 * Veille article content display with parsed sources grid.
 * Renders markdown content and transforms source references into a categorized grid.
 *
 * @param props - Component props
 * @param props.content - Markdown content of the veille article
 * @returns The rendered veille content with sources
 */
export function VeilleContent({ content }: VeilleContentProps) {
    if (!content) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Chargement...
            </div>
        );
    }

    const sourceCategories = parseSourceCategories(content);
    const mainContent = removeSpecialSections(content);

    return (
        <article className="prose-custom mt-2">
            {/* Main Content */}
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents} skipHtml={false}>
                {mainContent}
            </ReactMarkdown>

            {/* Sources Grid */}
            {sourceCategories.length > 0 && (
                <>
                    <h2
                        id="sources"
                        className="text-2xl font-semibold mt-10 mb-4 pt-6 border-t border-border scroll-mt-20"
                    >
                        Sources
                    </h2>
                    <h3 className="text-lg font-medium mt-6 mb-4">Références bibliographiques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {sourceCategories.map((category, index) => (
                            <div
                                key={index}
                                className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                            >
                                <h4 className="text-base font-medium mb-3 mt-0">
                                    {category.title}
                                </h4>
                                <ul className="space-y-2 m-0 list-none">
                                    {category.links.map((link, linkIndex) => (
                                        <li key={linkIndex} className="leading-7">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors text-sm"
                                            >
                                                {link.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </article>
    );
}