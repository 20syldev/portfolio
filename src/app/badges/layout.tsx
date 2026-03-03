import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Badges - Sylvain L.",
    description: "Mes badges Google Developer.",
    openGraph: {
        title: "Badges - Sylvain L.",
        description: "Mes badges Google Developer.",
        type: "website",
    },
};

/**
 * Layout for the badges page providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function BadgesLayout({ children }: { children: React.ReactNode }) {
    return children;
}