import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Complétion - Sylvain L.",
    description: "Mes badges de complétion Google Cloud Skills Boost.",
    openGraph: {
        title: "Complétion - Sylvain L.",
        description: "Mes badges de complétion Google Cloud Skills Boost.",
        type: "website",
    },
};

/**
 * Layout for the completion page providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function CompletionLayout({ children }: { children: React.ReactNode }) {
    return children;
}