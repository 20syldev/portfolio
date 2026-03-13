import type { Metadata } from "next";
import {
    DM_Sans,
    Fira_Code,
    Fredoka,
    Inter,
    Lexend,
    Montserrat,
    Outfit,
    Plus_Jakarta_Sans,
    Poppins,
    Raleway,
} from "next/font/google";

import { ThemeProvider } from "@/components/provider";
import { CommandProvider } from "@/components/utils/command";
import "./globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    style: ["normal", "italic"],
});

const raleway = Raleway({
    variable: "--font-raleway",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    style: ["normal", "italic"],
});

const dm = DM_Sans({
    variable: "--font-dm",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
    variable: "--font-jakarta",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    style: ["normal", "italic"],
});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    style: ["normal", "italic"],
});

const fredoka = Fredoka({
    variable: "--font-fredoka",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const fira = Fira_Code({
    variable: "--font-fira-code",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://sylvain.sh"),
    title: "Sylvain L. - Développeur Full Stack",
    description:
        "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans. Portfolio présentant mes projets et compétences.",
    keywords: ["développeur", "full stack", "web", "react", "node.js", "javascript"],
    authors: [{ name: "Sylvain L." }],
    alternates: {
        canonical: "/",
    },
    icons: {
        icon: [
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
    openGraph: {
        title: "Sylvain L. - Développeur Full Stack",
        description: "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans.",
        url: "https://sylvain.sh",
        siteName: "Sylvain L.",
        locale: "fr_FR",
        type: "website",
        images: [{ url: "/images/card.png" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sylvain L. - Développeur Full Stack",
        description: "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans.",
        images: ["/images/card.png"],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": "https://sylvain.sh/#website",
            url: "https://sylvain.sh",
            name: "Sylvain L.",
            description:
                "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans. Portfolio présentant mes projets et compétences.",
            inLanguage: "fr-FR",
        },
        {
            "@type": "Person",
            "@id": "https://sylvain.sh/#person",
            name: "Sylvain L.",
            url: "https://sylvain.sh",
            jobTitle: "Développeur Full Stack",
        },
    ],
};

/**
 * Root layout wrapping the entire application with theme provider and fonts.
 *
 * @param props - Layout props
 * @param props.children - Page content
 * @returns The rendered root HTML layout
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body
                className={`${outfit.variable} ${inter.variable} ${lexend.variable} ${montserrat.variable} ${raleway.variable} ${dm.variable} ${jakarta.variable} ${poppins.variable} ${fredoka.variable} ${fira.variable} font-sans antialiased`}
                suppressHydrationWarning
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <CommandProvider>{children}</CommandProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}