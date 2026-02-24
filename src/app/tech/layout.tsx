import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Technologies - Sylvain L.",
    description: "Liste des technologies que j'utilise.",
    openGraph: {
        title: "Technologies - Sylvain L.",
        description: "Liste des technologies que j'utilise.",
        type: "website",
    },
};

/**
 * Layout for the tech section providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function TechLayout({ children }: { children: React.ReactNode }) {
    return children;
}