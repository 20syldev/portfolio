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

interface ApiData {
    stats: Stats | null;
    versions: Versions | null;
    patchedProjects: string[];
    updatedProjects: string[];
    newProjects: string[];
    loading: boolean;
}

interface CachedData {
    stats: Stats | null;
    versions: Versions | null;
    patchedProjects: string[];
    updatedProjects: string[];
    newProjects: string[];
}

let cachedData: CachedData | null = null;

/**
 * Fetches and caches portfolio API data including stats, versions and project updates.
 * Data is fetched once and cached globally for subsequent calls.
 *
 * @returns API data with stats, versions, project lists and loading state
 */
export function useApi(): ApiData {
    const [data, setData] = useState<CachedData>(
        cachedData || {
            stats: null,
            versions: null,
            patchedProjects: [],
            updatedProjects: [],
            newProjects: [],
        }
    );
    const [loading, setLoading] = useState(!cachedData);

    useEffect(() => {
        if (cachedData) return;

        fetch("https://api.sylvain.pro/latest/website")
            .then((res) => res.json())
            .then((apiData) => {
                const newData: CachedData = {
                    stats: apiData?.stats || null,
                    versions: apiData?.versions || null,
                    patchedProjects: apiData?.patched_projects || [],
                    updatedProjects: apiData?.updated_projects || [],
                    newProjects: apiData?.new_projects || [],
                };
                cachedData = newData;
                setData(newData);
            })
            .catch(() => {
                setData({
                    stats: null,
                    versions: null,
                    patchedProjects: [],
                    updatedProjects: [],
                    newProjects: [],
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { ...data, loading };
}