import type { Metadata } from "next";

import { VeilleList } from "./list";

export const metadata: Metadata = {
    title: "Veilles Technologiques - Sylvain L.",
    description:
        "Suivi des dernières actualités technologiques : Node.js, TypeScript, Next.js, Vue.js, Radix UI",
};

export default function VeillePage() {
    return <VeilleList />;
}