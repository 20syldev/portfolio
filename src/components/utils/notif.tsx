"use client";

import * as React from "react";

import { Notification } from "@/components/ui/notification";
import { useApi } from "@/hooks/api";

/**
 * Parses markdown syntax in a string and returns React nodes.
 * Supports `**bold**`, `__italic__`, and `[text](url)` links.
 *
 * @param text - The string containing inline markdown
 * @returns An array of React nodes with formatted elements
 */
function parseMarkdown(text: string): React.ReactNode[] {
    const pattern = /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\))/g;

    return text.split(pattern).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("__") && part.endsWith("__")) {
            return <em key={i}>{part.slice(2, -2)}</em>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
            return (
                <a
                    key={i}
                    href={linkMatch[2]}
                    className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                >
                    {linkMatch[1]}
                </a>
            );
        }
        return part;
    });
}

/**
 * Renders the API-driven notification banner when active.
 * Reads notification state from the API hook and dismisses on user interaction.
 *
 * @returns A dismissible {@link Notification} with the active tag content, or null
 */
export function NotifProvider() {
    const { notifTag, notifActive } = useApi();
    const [dismissed, setDismissed] = React.useState(false);
    const [cached, setCached] = React.useState(false);
    const [hiding, setHiding] = React.useState(false);
    const [gone, setGone] = React.useState(false);

    React.useEffect(() => {
        if (!notifActive || !notifTag || dismissed) return;
        const timer = setTimeout(() => setCached(true), 10000);
        return () => clearTimeout(timer);
    }, [notifActive, notifTag, dismissed]);

    React.useEffect(() => {
        const observer = new MutationObserver(() => {
            const active = document.body.classList.contains("hole-active");
            if (active && !hiding) {
                setHiding(true);
                setTimeout(() => setGone(true), 300);
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, [hiding]);

    if (!notifActive || !notifTag || dismissed || cached || gone) return null;

    return (
        <Notification isHiding={hiding} onDismiss={() => setDismissed(true)}>
            {parseMarkdown(notifTag)}
        </Notification>
    );
}