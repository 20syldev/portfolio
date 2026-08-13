import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Parcours - Sylvain L.",
    description: "Mon parcours de formation : BTS SIO SLAM à Ensitech, Bachelor CDA à l'IPSSI.",
    openGraph: {
        title: "Parcours - Sylvain L.",
        description: "Mon parcours de formation : BTS SIO SLAM à Ensitech, Bachelor CDA à l'IPSSI.",
        type: "website",
    },
};

/**
 * Layout for the parcours page providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function ParcoursLayout({ children }: { children: React.ReactNode }) {
    return children;
}