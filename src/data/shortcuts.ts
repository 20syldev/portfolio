import { Eye, Keyboard, MousePointer2, Palette, Search, Sparkles, Type } from "lucide-react";

export type ShortcutConfig = {
    id: string;
    keys: string[];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
};

export const shortcuts: ShortcutConfig[] = [
    { id: "cursor", keys: ["Alt", "C"], label: "Curseur personnalisé", icon: MousePointer2 },
    { id: "font", keys: ["Alt", "P"], label: "Police de caractères", icon: Type },
    { id: "theme", keys: ["Alt", "T"], label: "Changer de thème", icon: Palette },
    { id: "motion", keys: ["Alt", "M"], label: "Animations", icon: Sparkles },
    { id: "xray", keys: ["Alt", "X"], label: "X-Ray", icon: Eye },
    { id: "shortcuts", keys: ["Alt", "/"], label: "Raccourcis clavier", icon: Keyboard },
    { id: "command", keys: ["Ctrl", "K"], label: "Rechercher", icon: Search },
];

/**
 * Format keys array into display string, e.g. ["Alt", "C"] -> "Alt + C"
 */
export function formatShortcut(keys: string[]): string {
    return keys.join(" + ");
}

/**
 * Find a shortcut config by id.
 */
export function getShortcut(id: string): ShortcutConfig | undefined {
    return shortcuts.find((s) => s.id === id);
}