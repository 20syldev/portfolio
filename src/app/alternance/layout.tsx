import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Alternance - Sylvain L.",
};

/**
 * Layout for the alternance section providing metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function AlternanceLayout({ children }: { children: React.ReactNode }) {
    return children;
}