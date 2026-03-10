"use client";

import { useEffect, useState } from "react";

interface Stats {
    frontend?: string;
    backend?: string;
    today?: string;
    this_month?: string;
    last_year?: string;
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
                    cachedData = {
                        stats: api?.stats || null,
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