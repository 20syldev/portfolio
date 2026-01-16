"use client";

import { useState, useEffect } from "react";

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
    loading: boolean;
}

// Mapping des IDs de projets vers les clés de l'API
const ID_TO_API_KEY: Record<string, string> = {
    "2048": "g_2048",
    "python-api": "python_api",
    "old-database": "old_database",
};

export function getApiKey(projectId: string): string {
    return ID_TO_API_KEY[projectId] || projectId;
}

let cachedData: { stats: Stats | null; versions: Versions | null } | null =
    null;

export function useApi(): ApiData {
    const [data, setData] = useState<{
        stats: Stats | null;
        versions: Versions | null;
    }>(cachedData || { stats: null, versions: null });
    const [loading, setLoading] = useState(!cachedData);

    useEffect(() => {
        if (cachedData) return;

        fetch("https://api.sylvain.pro/latest/website")
            .then((res) => res.json())
            .then((apiData) => {
                const newData = {
                    stats: apiData?.stats || null,
                    versions: apiData?.versions || null,
                };
                cachedData = newData;
                setData(newData);
            })
            .catch(() => {
                setData({ stats: null, versions: null });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { ...data, loading };
}