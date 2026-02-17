import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CV - Sylvain L.",
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