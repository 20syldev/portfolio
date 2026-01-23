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

const ID_TO_API_KEY: Record<string, string> = {
    "2048": "g_2048",
    "python-api": "python_api",
    "old-database": "old_database",
    "drawio-plugin": "drawio_plugin",
};

export function getApiKey(projectId: string): string {
    return ID_TO_API_KEY[projectId] || projectId;
}

interface CachedData {
    stats: Stats | null;
    versions: Versions | null;
    patchedProjects: string[];
    updatedProjects: string[];
    newProjects: string[];
}

let cachedData: CachedData | null = null;

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