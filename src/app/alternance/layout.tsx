import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Redirection - Sylvain L.",
    robots: { index: false },
};

/**
 * Layout for the former alternance page providing metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function AlternanceLayout({ children }: { children: React.ReactNode }) {
    return children;
}
