"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

import { LazyFontDialog } from "@/components/dialogs/lazy";
import { CursorProvider } from "@/components/utils/cursor";
import { FontProvider } from "@/components/utils/font";
import { KonamiProvider } from "@/components/utils/konami";
import { MotionProvider } from "@/components/utils/motion";
import { NotifProvider } from "@/components/utils/notif";
import { XrayProvider } from "@/components/utils/xray";
import { useSheen } from "@/hooks/sheen";

/**
 * Installs the sheen that follows the pointer over the glass cards.
 *
 * @returns Nothing, the hook does the work
 */
function Sheen() {
    useSheen();
    return null;
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
            <MotionProvider>
                <CursorProvider>
                    <FontProvider>
                        <LazyFontDialog />
                        <KonamiProvider>
                            <XrayProvider>{children}</XrayProvider>
                        </KonamiProvider>
                    </FontProvider>
                    <NotifProvider />
                    <Sheen />
                </CursorProvider>
            </MotionProvider>
        </NextThemesProvider>
    );
}
