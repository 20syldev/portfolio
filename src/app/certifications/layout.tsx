import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Certifications - Sylvain L.",
    description: "Mes certifications Cisco Netacad et Google Cloud.",
    openGraph: {
        title: "Certifications - Sylvain L.",
        description: "Mes certifications Cisco Netacad et Google Cloud.",
        type: "website",
    },
};

/**
 * Layout for the certifications page providing page metadata.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered layout
 */
export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
    return children;
}