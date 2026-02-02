import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Veilles Technologiques - Sylvain L.",
    description:
        "Suivi des dernières actualités technologiques : Node.js, TypeScript, Next.js, Vue.js, Radix UI",
};

/**
 * Layout for the tech watch section providing metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function VeilleLayout({ children }: { children: React.ReactNode }) {
    return children;
}