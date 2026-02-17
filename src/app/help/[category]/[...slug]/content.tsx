"use client";

import { DocumentationLayout } from "@/components/detail/layout";

interface HelpDocProps {
    title: string;
    description: string;
    content: string;
}

/**
 * Help documentation page with sidebar navigation and markdown content.
 *
 * @param props - Component props
 * @param props.title - Document title
 * @param props.description - Document description
 * @param props.content - Markdown content to render
 * @returns The rendered help page
 */
export function HelpDoc({ title, description, content }: HelpDocProps) {
    const header = (
        <>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
        </>
    );

    return <DocumentationLayout header={header} content={content} />;
}