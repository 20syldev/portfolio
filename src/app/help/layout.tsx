import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aide - Sylvain L.",
};

/**
 * Layout for help pages providing metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function HelpLayout({ children }: { children: React.ReactNode }) {
    return children;
}