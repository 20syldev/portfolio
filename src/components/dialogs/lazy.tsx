"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

import type { ContactDialog } from "@/components/dialogs/contact";
import type { ShortcutsDialog } from "@/components/dialogs/shortcuts";
import { useFont } from "@/components/utils/font";
import { useOnce } from "@/hooks/once";

const loadContact = () => import("@/components/dialogs/contact").then((m) => m.ContactDialog);
const loadShortcuts = () => import("@/components/dialogs/shortcuts").then((m) => m.ShortcutsDialog);
const loadFont = () => import("@/components/dialogs/font").then((m) => m.FontDialog);

const Contact = dynamic(loadContact, { ssr: false });

const Shortcuts = dynamic(loadShortcuts, { ssr: false });

const Font = dynamic(loadFont, { ssr: false });

/**
 * Fetches the three lazy dialogs ahead of their first opening.
 * Touch screens have no hover to warm them up, so the first tap would wait for the network.
 */
export function preloadDialogs() {
    void loadContact();
    void loadShortcuts();
    void loadFont();
}

/**
 * Contact dialog fetched on its first opening.
 *
 * @param props - Props of the contact dialog
 * @returns The contact dialog once it has been opened, null before
 */
export function LazyContactDialog(props: ComponentProps<typeof ContactDialog>) {
    const loaded = useOnce(props.open);

    return loaded ? <Contact {...props} /> : null;
}

/**
 * Shortcuts dialog fetched on its first opening.
 *
 * @param props - Props of the shortcuts dialog
 * @returns The shortcuts dialog once it has been opened, null before
 */
export function LazyShortcutsDialog(props: ComponentProps<typeof ShortcutsDialog>) {
    const loaded = useOnce(props.open);

    return loaded ? <Shortcuts {...props} /> : null;
}

/**
 * Font dialog fetched on its first opening.
 * Follows the open state of the font context, which the shortcut and the palette toggle.
 *
 * @returns The font dialog once it has been opened, null before
 */
export function LazyFontDialog() {
    const { dialogOpen } = useFont();
    const loaded = useOnce(dialogOpen);

    return loaded ? <Font /> : null;
}
