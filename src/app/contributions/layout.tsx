import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contributions - Sylvain L.",
    description: "Mes contributions open source — pull requests sur des projets externes.",
    openGraph: {
        title: "Contributions - Sylvain L.",
        description: "Mes contributions open source — pull requests sur des projets externes.",
        type: "website",
    },
};

/**
 * Layout for the contributions page providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function ContributionsLayout({ children }: { children: React.ReactNode }) {
    return children;
}