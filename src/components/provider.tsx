"use client";

import Lenis from "lenis";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { useEffect } from "react";

import { FontDialog } from "@/components/dialogs/font";
import { CursorProvider } from "@/components/utils/cursor";
import { FontProvider } from "@/components/utils/font";
import { NotifProvider } from "@/components/utils/notif";
import { PdfViewerProvider } from "@/components/utils/viewer";
import { ProjectDetailProvider } from "@/hooks/detail";

/**
 * Provider for Lenis smooth scrolling functionality.
 * Integrates smooth scroll behavior with React and Next.js routing.
 *
 * @param props - Provider props
 * @param props.children - Child components to wrap with smooth scroll context
 * @returns The rendered provider with smooth scroll functionality
 */
function LenisProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}

/**
 * Theme provider for the application.
 * Wraps next-themes to handle light/dark/system themes.
 *
 * @param props - Props passed to NextThemesProvider
 * @returns The rendered theme provider wrapping children
 */
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props}>
            <LenisProvider>
                <CursorProvider>
                    <FontProvider>
                        <FontDialog />
                        <PdfViewerProvider>
                            <ProjectDetailProvider>{children}</ProjectDetailProvider>
                        </PdfViewerProvider>
                    </FontProvider>
                    <NotifProvider />
                </CursorProvider>
            </LenisProvider>
        </NextThemesProvider>
    );
}