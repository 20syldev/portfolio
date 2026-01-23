"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "./mdx";

interface DetailContentProps {
    content: string | null;
}

/**
 * Project markdown content display component.
 * Uses ReactMarkdown with custom MDX components.
 *
 * @param props - Component props
 * @param props.content - Markdown content to display
 */
export function DetailContent({ content }: DetailContentProps) {
    if (!content) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Chargement...
            </div>
        );
    }

    return (
        <article className="prose-custom mt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
                {content}
            </ReactMarkdown>
        </article>
    );
}