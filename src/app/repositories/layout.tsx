import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projets - Sylvain L.",
    description:
        "Mes projets réalisés chez Zenetys et mes projets personnels, open source ou non, avec leur documentation.",
    alternates: { canonical: "/repositories/" },
    openGraph: {
        title: "Projets - Sylvain L.",
        description:
            "Mes projets réalisés chez Zenetys et mes projets personnels, open source ou non, avec leur documentation.",
        type: "website",
    },
};

/**
 * Layout for the repositories section providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function RepositoriesLayout({ children }: { children: React.ReactNode }) {
    return children;
}