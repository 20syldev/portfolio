import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact - Sylvain L.",
    description:
        "Différentes façons de me contacter pour discuter, collaborer ou poser des questions sur mes projets.",
    openGraph: {
        title: "Contact - Sylvain L.",
        description:
            "Différentes façons de me contacter pour discuter, collaborer ou poser des questions sur mes projets.",
        type: "website",
    },
};

/**
 * Layout for the contact section providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function MeLayout({ children }: { children: React.ReactNode }) {
    return children;
}