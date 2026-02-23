import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CV - Sylvain L.",
    description:
        "Mon curriculum vitæ, présentant mon parcours et mes technologies maîtrisées en tant que développeur Full Stack.",
    openGraph: {
        title: "CV - Sylvain L.",
        description:
            "Mon curriculum vitæ, présentant mon parcours et mes technologies maîtrisées en tant que développeur Full Stack.",
        type: "website",
    },
};

/**
 * Layout for the CV section providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function CvLayout({ children }: { children: React.ReactNode }) {
    return children;
}