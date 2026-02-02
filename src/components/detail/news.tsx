import type { ReactNode } from "react";

interface NewsWrapperProps {
    children: ReactNode;
}

/**
 * Wrapper component that transforms the "Actualités récentes" section into a grid layout.
 * Detects h3 elements after the #news h2 and wraps them in a grid.
 *
 * @param props - Component props
 * @param props.children - Content to wrap in the news grid layout
 * @returns The rendered news wrapper
 */
export function NewsWrapper({ children }: NewsWrapperProps) {
    // This is a simple wrapper that will apply grid styles via CSS
    // The actual grid transformation happens in global CSS
    return <div className="veille-news-wrapper">{children}</div>;
}