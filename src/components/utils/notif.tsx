"use client";

import * as React from "react";

import { Notification } from "@/components/ui/notification";
import { useApi } from "@/hooks/api";

export function NotifProvider() {
    const { notifTag, notifActive } = useApi();
    const [dismissed, setDismissed] = React.useState(false);

    if (!notifActive || !notifTag || dismissed) return null;

    return <Notification onDismiss={() => setDismissed(true)}>{notifTag}</Notification>;
}