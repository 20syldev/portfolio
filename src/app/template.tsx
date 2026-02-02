"use client";

import { type ReactNode } from "react";

interface TemplateProps {
    children: ReactNode;
}

/**
 * Route template that applies a page-in animation to all route transitions.
 *
 * @param props - Template props
 * @param props.children - Page content to animate
 * @returns The rendered template with animation wrapper
 */
export default function Template({ children }: TemplateProps) {
    return <div className="animate-page-in">{children}</div>;
}