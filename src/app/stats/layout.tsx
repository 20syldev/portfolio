import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Statistiques - Sylvain L.",
    description:
        "Découvrez quelques statistiques intéressantes sur mon portfolio, mes contributions et mon activité en ligne.",
    openGraph: {
        title: "Statistiques - Sylvain L.",
        description:
            "Découvrez quelques statistiques intéressantes sur mon portfolio, mes contributions et mon activité en ligne.",
        type: "website",
    },
};

/**
 * Layout for the stats page providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function StatsLayout({ children }: { children: React.ReactNode }) {
    return children;
}