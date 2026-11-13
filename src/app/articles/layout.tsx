import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Articles - Sylvain L.",
    description:
        "Les articles du blog Zenetys que j'ai mis en forme et intégrés sur le site de l'entreprise.",
    alternates: { canonical: "/articles/" },
    openGraph: {
        title: "Articles - Sylvain L.",
        description:
            "Les articles du blog Zenetys que j'ai mis en forme et intégrés sur le site de l'entreprise.",
        type: "website",
    },
};

/**
 * Layout for the articles page providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
