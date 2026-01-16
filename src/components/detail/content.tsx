"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./mdx";

interface ProjectDetailContentProps {
    content: string | null;
}

export function ProjectDetailContent({ content }: ProjectDetailContentProps) {
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