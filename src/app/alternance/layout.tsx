import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Alternance - Sylvain L.",
};

export default function AlternanceLayout({ children }: { children: React.ReactNode }) {
    return children;
}