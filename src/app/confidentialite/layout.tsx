import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Confidentialité - Sylvain L.",
    description: "Politique de confidentialité du site sylvain.pro.",
    openGraph: {
        title: "Confidentialité - Sylvain L.",
        description: "Politique de confidentialité du site sylvain.pro.",
        type: "website",
    },
};

/**
 * Layout for the privacy policy page providing metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
    return children;
}