import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";

import { cvTitle } from "@/data/cv";
import { profile } from "@/data/profile";

const display = Funnel_Display({
    variable: "--font-funnel-display",
    subsets: ["latin"],
    weight: ["600", "700", "800"],
});
const sans = Funnel_Sans({
    variable: "--font-funnel-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const title = cvTitle;
const description =
    "Mon curriculum vitæ, présentant mon parcours et mes technologies maîtrisées en tant que développeur Full Stack.";

// The social cards replace the root ones as a whole, so they carry the card image again
export const metadata: Metadata = {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: "/cv/", types: { "application/pdf": "/CV.pdf" } },
    openGraph: {
        title,
        description,
        url: "https://sylvain.sh/cv/",
        siteName: profile.name,
        locale: "fr_FR",
        type: "website",
        images: [{ url: "/images/card.png" }],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/card.png"],
    },
};

/**
 * Layout for the CV section providing page metadata and the CV fonts.
 * The fonts load here and not in the root layout, so only /cv/ preloads them.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The page content inside the wrapper that exposes the font variables
 */
export default function CvLayout({ children }: { children: React.ReactNode }) {
    return <div className={`${display.variable} ${sans.variable}`}>{children}</div>;
}