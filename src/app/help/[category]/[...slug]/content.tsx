"use client";

import { Documentation } from "@/components/detail/documentation";
import type { ContentImage } from "@/data/projects";

interface HelpDocProps {
    title: string;
    description: string;
    content: string;
    images?: ContentImage[];
}

/**
 * Help documentation page with sidebar navigation and markdown content.
 *
 * @param props - Component props
 * @param props.title - Document title
 * @param props.description - Document description
 * @param props.content - Markdown content to render
 * @param props.images - Images placed in the content, resolved at build time
 * @returns The rendered help page
 */
export function HelpDoc({ title, description, content, images }: HelpDocProps) {
    const header = (
        <>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
        </>
    );

    return <Documentation header={header} content={content} images={images} />;
}
