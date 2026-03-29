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
    frontend?: string;
    backend?: string;
    today?: string;
    month?: string;
    year?: string;
    activity?: ActivityWeek[];
}

type Versions = Record<string, string>;

interface CachedData {
    stats: Stats | null;
    versions: Versions | null;
    patchedProjects: string[];
    updatedProjects: string[];
    newProjects: string[];
    notifTag: string | null;
    notifActive: boolean;
}

let cachedData: CachedData | null = null;
let fetchPromise: Promise<CachedData> | null = null;

const defaultData: CachedData = {
    stats: null,
    versions: null,
    patchedProjects: [],
    updatedProjects: [],
    newProjects: [],
    notifTag: null,
    notifActive: false,
};

/**
 * Fetches and caches portfolio API data including stats, versions and project updates.
 * Concurrent callers share a single in-flight request to avoid duplicate fetches.
 *
 * @returns API data with stats, versions, project lists and loading state
 */
export function useApi(): CachedData & { loading: boolean } {
    const [data, setData] = useState<CachedData>(cachedData || defaultData);
    const [loading, setLoading] = useState(!cachedData);

    useEffect(() => {
        if (cachedData) return;

        if (!fetchPromise) {
            fetchPromise = fetch("https://api.sylvain.sh/latest/website")
                .then((res) => res.json())
                .then((api) => {
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
                                  frontend: raw[2] || undefined,
                                  backend: raw[3] || undefined,
                                  today: String(todayCount),
                                  month: String(monthCount),
                                  year: String(yearCount),
                                  activity,
                              }
                            : null,
                        versions: api?.versions || null,
                        patchedProjects: api?.patched_projects || [],
                        updatedProjects: api?.updated_projects || [],
                        newProjects: api?.new_projects || [],
                        notifTag: api?.tag || null,
                        notifActive: api?.active || false,
                    };
                    return cachedData;
                })
                .catch(() => defaultData);
        }

        fetchPromise.then((result) => setData(result)).finally(() => setLoading(false));
    }, []);

    return { ...data, loading };
}