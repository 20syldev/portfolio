"use client";

import { type ComponentPropsWithoutRef, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Video } from "@/components/ui/video";
import type { ContentImage } from "@/data/projects";

import { mdxComponents } from "./mdx";
import { Figure, Lightbox } from "./showcase";

interface DetailContentProps {
    content: string | null;
    images?: ContentImage[];
}

/**
 * Project markdown content display component.
 * Uses ReactMarkdown with custom MDX components. Images resolved at build time are shown
 * in the variant of the active theme and open a full-size view of every image of the page.
 * An image whose path ends in `.mp4` is a video, shown with the poster `<name>-poster.webp`
 * next to `<name>-demo.mp4`.
 *
 * @param props - Component props
 * @param props.content - Markdown content to display
 * @param props.images - Images placed in the content, resolved at build time
 * @returns The rendered markdown content
 */
export function DetailContent({ content, images }: DetailContentProps) {
    const [index, setIndex] = useState<number | null>(null);

    const components = useMemo(() => {
        const DefaultImage = mdxComponents.img;
        return {
            ...mdxComponents,
            img: ({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) => {
                if (typeof src === "string" && src.endsWith(".mp4")) {
                    return (
                        <Video
                            src={src}
                            poster={src.replace(/-demo\.mp4$/, "-poster.webp")}
                            title={alt ?? ""}
                            className="my-6"
                        />
                    );
                }
                const i = images?.findIndex((image) => image.ref === src) ?? -1;
                if (!images || i === -1) return <DefaultImage src={src} alt={alt} {...props} />;
                return <Figure image={images[i]} onOpen={() => setIndex(i)} eager={i === 0} />;
            },
        };
    }, [images]);

    if (!content) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Chargement...
            </div>
        );
    }

    return (
        <article className="prose-custom mt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml={false}>
                {content}
            </ReactMarkdown>
            {images?.length ? (
                <Lightbox images={images} index={index} onIndexChange={setIndex} />
            ) : null}
        </article>
    );
}
