import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import { ThemeProvider } from "@/components/provider";

import { CommandProvider } from "../components/utils/command";
import "./globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: "Sylvain L. - Développeur Full Stack",
    description:
        "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans. Portfolio présentant mes projets et compétences.",
    keywords: ["développeur", "full stack", "web", "react", "node.js", "javascript"],
    authors: [{ name: "Sylvain L." }],
    openGraph: {
        title: "Sylvain L. - Développeur Full Stack",
        description: "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans.",
        url: "https://sylvain.pro",
        siteName: "Sylvain L.",
        locale: "fr_FR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sylvain L. - Développeur Full Stack",
        description: "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans.",
    },
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
            <body className={`${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
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