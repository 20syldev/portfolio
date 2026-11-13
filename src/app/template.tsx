"use client";

import { type ReactNode } from "react";

import { useFirstVisit } from "@/hooks/entrance";

interface TemplateProps {
    children: ReactNode;
}

/**
 * Route template that animates the page in. The first page of a visit only slides up, so that
 * nothing is hidden while the browser paints its largest element, and later route transitions
 * fade, slide and zoom in.
 *
 * @param props - Template props
 * @param props.children - Page content to animate
 * @returns The rendered template with animation wrapper
 */
export default function Template({ children }: TemplateProps) {
    const first = useFirstVisit();

    return <div className={first ? "animate-page-first" : "animate-page-in"}>{children}</div>;
}
