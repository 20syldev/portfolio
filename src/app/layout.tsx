import type { Metadata } from "next";
import {
    DM_Sans,
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

export const metadata: Metadata = {
    title: "Sylvain L. - Développeur Full Stack",
    description:
        "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans. Portfolio présentant mes projets et compétences.",
    keywords: ["développeur", "full stack", "web", "react", "node.js", "javascript"],
    authors: [{ name: "Sylvain L." }],
    openGraph: {
        title: "Sylvain L. - Développeur Full Stack",
        description: "Développeur Front-end depuis 8 ans et Back-end depuis 5 ans.",
        url: "https://sylvain.sh",
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
            <body
                className={`${outfit.variable} ${inter.variable} ${lexend.variable} ${montserrat.variable} ${raleway.variable} ${dm.variable} ${jakarta.variable} ${poppins.variable} ${fredoka.variable} font-sans antialiased`}
                suppressHydrationWarning
            >
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