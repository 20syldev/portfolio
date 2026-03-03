"use client";

import * as React from "react";

import { Notification } from "@/components/ui/notification";
import { useApi } from "@/hooks/api";

/**
 * Renders the API-driven notification banner when active.
 * Reads notification state from the API hook and dismisses on user interaction.
 *
 * @returns A dismissible {@link Notification} with the active tag content, or null
 */
export function NotifProvider() {
    const { notifTag, notifActive } = useApi();
    const [dismissed, setDismissed] = React.useState(false);

    if (!notifActive || !notifTag || dismissed) return null;

    return <Notification onDismiss={() => setDismissed(true)}>{notifTag}</Notification>;
}