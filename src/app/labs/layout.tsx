import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Labs - Sylvain L.",
    description: "Mes codelabs et apprentissages Google Developer.",
    openGraph: {
        title: "Labs - Sylvain L.",
        description: "Mes codelabs et apprentissages Google Developer.",
        type: "website",
    },
};

/**
 * Layout for the labs page providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function LabsLayout({ children }: { children: React.ReactNode }) {
    return children;
}