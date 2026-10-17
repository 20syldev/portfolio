"use client";

import { useEffect, useState } from "react";

interface ActivityDay {
    date: string;
    count: number;
}

export interface ActivityWeek {
    week: string;
    total: number;
    days: ActivityDay[];
}

interface Stats {
    today?: string;
    month?: string;
    year?: string;
    activity?: ActivityWeek[];
}

type Versions = Record<string, string>;

/**
 * Statuses the site draws as a badge.
 * "archived" also exists in the API but is read from the project frontmatter at build time,
 * where it drives the sort order and the inactive style.
 */
const statusNames = ["new", "patched", "updated", "wip"] as const;

export type StatusName = (typeof statusNames)[number];

interface ApiProject {
    label?: string;
    status?: string;
}

interface ApiNotice {
    tag?: string;
    active?: boolean;
}

interface ApiResponse {
    stats?: { activity?: ActivityWeek[] };
    projects?: Record<string, ApiProject | null>;
    notice?: ApiNotice;
}

interface CachedData {
    stats: Stats | null;
    versions: Versions | null;
    statuses: Record<string, StatusName>;
    notifTag: string | null;
    notifActive: boolean;
}

let cachedData: CachedData | null = null;
let fetchPromise: Promise<CachedData> | null = null;

const defaultData: CachedData = {
    stats: null,
    versions: null,
    statuses: {},
    notifTag: null,
    notifActive: false,
};

/**
 * Narrows a raw value from the API to a known status.
 *
 * @param value - Raw status name from the API
 * @returns Whether the value is a known status
 */
function isStatus(value: unknown): value is StatusName {
    return statusNames.some((name) => name === value);
}

/**
 * Reads the version labels and statuses from the `projects` map of the API response.
 * Entries without a label or with an unknown status simply contribute nothing.
 *
 * @param projects - Raw `projects` map, keyed by API project key
 * @returns Version labels and statuses, both keyed by API project key
 */
function readProjects(
    projects: ApiResponse["projects"]
): Pick<CachedData, "versions" | "statuses"> {
    const versions: Versions = {};
    const statuses: Record<string, StatusName> = {};

    for (const [key, project] of Object.entries(projects ?? {})) {
        if (typeof project?.label === "string") versions[key] = project.label;
        if (isStatus(project?.status)) statuses[key] = project.status;
    }
    return { versions, statuses };
}

/**
 * Fetches and caches portfolio API data including stats, versions, project statuses and the notice.
 * Concurrent callers share a single in-flight request to avoid duplicate fetches.
 *
 * @returns API data with stats, versions, project statuses, notice and loading state
 */
export function useApi(): CachedData & { loading: boolean } {
    const [data, setData] = useState<CachedData>(cachedData || defaultData);
    const [loading, setLoading] = useState(!cachedData);

    useEffect(() => {
        if (cachedData) return;

        if (!fetchPromise) {
            fetchPromise = fetch("https://api.sylvain.sh/latest/website")
                .then((res) => res.json())
                .then((api: ApiResponse | null) => {
                    const raw = api?.stats;
                    const activity: ActivityWeek[] = raw?.activity || [];

                    // Derive contribution counts from activity data
                    const today = new Date().toISOString().split("T")[0];
                    const monthStart = today.slice(0, 8) + "01";
                    const allDays = activity.flatMap((w) => w.days);

                    const todayCount = allDays
                        .filter((d) => d.date === today)
                        .reduce((s, d) => s + d.count, 0);
                    const monthCount = allDays
                        .filter((d) => d.date >= monthStart)
                        .reduce((s, d) => s + d.count, 0);
                    const yearCount = activity.reduce((s, w) => s + w.total, 0);

                    cachedData = {
                        stats: raw
                            ? {
                                  today: String(todayCount),
                                  month: String(monthCount),
                                  year: String(yearCount),
                                  activity,
                              }
                            : null,
                        ...readProjects(api?.projects),
                        notifTag: api?.notice?.tag || null,
                        notifActive: api?.notice?.active || false,
                    };
                    return cachedData;
                })
                .catch(() => defaultData);
        }

        fetchPromise.then((result) => setData(result)).finally(() => setLoading(false));
    }, []);

    return { ...data, loading };
}