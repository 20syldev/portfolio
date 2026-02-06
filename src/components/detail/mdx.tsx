import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Extracts custom identifier from markdown heading (format: Title {#id}).
 *
 * @param children - Heading content to parse
 * @returns Object containing extracted id and text without identifier
 */
function parseHeadingId(children: ReactNode): { id: string | null; text: ReactNode } {
    if (typeof children === "string") {
        const match = children.match(/^(.+?)\s*\{#([a-z0-9-]+)\}\s*$/i);
        if (match) {
            return { id: match[2], text: match[1].trim() };
        }
    }
    // Handle array of children (e.g., text + other elements)
    if (Array.isArray(children)) {
        const lastChild = children[children.length - 1];
        if (typeof lastChild === "string") {
            const match = lastChild.match(/^(.+?)\s*\{#([a-z0-9-]+)\}\s*$/i);
            if (match) {
                return {
                    id: match[2],
                    text: [...children.slice(0, -1), match[1].trim()],
                };
            }
        }
    }
    return { id: null, text: children };
}

export const mdxComponents = {
    h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => {
        const { id, text } = parseHeadingId(children);
        return (
            <h2
                id={id ?? undefined}
                className="text-2xl font-semibold mt-10 mb-4 pt-6 border-t border-border first:border-t-0 first:mt-0 first:pt-0 scroll-mt-20"
                {...props}
            >
                {text}
            </h2>
        );
    },
    h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => {
        const { id, text } = parseHeadingId(children);
        return (
            <h3
                id={id ?? undefined}
                className="text-lg font-medium mt-6 mb-3 first:mt-0"
                {...props}
            >
                {text}
            </h3>
        );
    },
    h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => {
        const { id, text } = parseHeadingId(children);
        return (
            <h4 id={id ?? undefined} className="text-base font-medium mt-4 mb-2" {...props}>
                {text}
            </h4>
        );
    },
    h5: ({ children, ...props }: ComponentPropsWithoutRef<"h5">) => {
        const { id, text } = parseHeadingId(children);
        return (
            <h5 id={id ?? undefined} className="text-sm font-medium mt-4 mb-2" {...props}>
                {text}
            </h5>
        );
    },
    p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
        <p className="text-muted-foreground leading-7 mb-4 last:mb-0" {...props}>
            {children}
        </p>
    ),
    ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground" {...props}>
            {children}
        </ul>
    ),
    ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
        <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground" {...props}>
            {children}
        </ol>
    ),
    li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
        <li className="leading-7 [&>p]:mb-0 [&>p]:inline" {...props}>
            {children}
        </li>
    ),
    strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
        <strong className="text-foreground font-medium" {...props}>
            {children}
        </strong>
    ),
    a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            {...props}
        >
            {children}
        </a>
    ),
    table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
        <div className="overflow-x-auto mb-6 rounded-lg border border-border">
            <table className="w-full text-sm" {...props}>
                {children}
            </table>
        </div>
    ),
    thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
        <thead className="bg-muted/50" {...props}>
            {children}
        </thead>
    ),
    th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
        <th className="text-left p-3 font-medium border-b border-border" {...props}>
            {children}
        </th>
    ),
    td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
        <td className="p-3 border-b border-border last:border-b-0" {...props}>
            {children}
        </td>
    ),
    tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
        <tr className="last:border-b-0" {...props}>
            {children}
        </tr>
    ),
    img: ({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) => (
        <figure className="my-6">
            <img
                src={src}
                alt={alt}
                className="rounded-lg border border-border shadow-sm max-w-full"
                {...props}
            />
            {alt && (
                <figcaption className="text-center text-xs text-muted-foreground mt-2">
                    {alt}
                </figcaption>
            )}
        </figure>
    ),
    code: ({ children, className, ...props }: ComponentPropsWithoutRef<"code">) => {
        const isInline = !className;
        if (isInline) {
            return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                </code>
            );
        }
        return (
            <code className={cn("font-mono text-sm", className)} {...props}>
                {children}
            </code>
        );
    },
    pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
        <pre
            className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-sm border border-border"
            {...props}
        >
            {children}
        </pre>
    ),
    blockquote: ({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
        <blockquote
            className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
            {...props}
        >
            {children}
        </blockquote>
    ),
    hr: ({ ...props }: ComponentPropsWithoutRef<"hr">) => (
        <hr className="my-8 border-border" {...props} />
    ),
    div: ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => {
        // Handle veille articles grid
        if (className === "veille-grid" || className === "veille-articles-grid") {
            return (
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                    {...props}
                >
                    {children}
                </div>
            );
        }
        // Handle individual veille article cards
        if (className === "veille-card" || className === "veille-article-card") {
            return (
                <div
                    className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors flex flex-col gap-2"
                    {...props}
                >
                    {children}
                </div>
            );
        }
        // Handle article meta info
        if (className === "veille-article-meta") {
            return (
                <div className="text-xs text-muted-foreground mb-2" {...props}>
                    {children}
                </div>
            );
        }
        return (
            <div className={className} {...props}>
                {children}
            </div>
        );
    },
};