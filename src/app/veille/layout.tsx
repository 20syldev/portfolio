import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Veilles Technologiques - Sylvain L.",
    description:
        "Suivi des dernières actualités technologiques : Node.js, TypeScript, Next.js, Vue.js, Radix UI",
};

export default function VeilleLayout({ children }: { children: React.ReactNode }) {
    return children;
}