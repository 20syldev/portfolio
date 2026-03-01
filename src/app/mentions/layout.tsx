import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions légales - Sylvain L.",
    description: "Mentions légales du site sylvain.sh.",
    openGraph: {
        title: "Mentions légales - Sylvain L.",
        description: "Mentions légales du site sylvain.sh.",
        type: "website",
    },
};

/**
 * Layout for the legal notices page providing metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function MentionsLayout({ children }: { children: React.ReactNode }) {
    return children;
}