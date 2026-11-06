"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

import type { ContactDialog } from "@/components/dialogs/contact";
import type { ShortcutsDialog } from "@/components/dialogs/shortcuts";
import { useFont } from "@/components/utils/font";
import { useOnce } from "@/hooks/once";

const Contact = dynamic(() => import("@/components/dialogs/contact").then((m) => m.ContactDialog), {
    ssr: false,
});

const Shortcuts = dynamic(
    () => import("@/components/dialogs/shortcuts").then((m) => m.ShortcutsDialog),
    { ssr: false }
);

const Font = dynamic(() => import("@/components/dialogs/font").then((m) => m.FontDialog), {
    ssr: false,
});

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