export interface ApiStats {
    os?: string;
    frontend?: string;
    backend?: string;
    hours?: string;
    today?: string;
    this_month?: string;
    last_year?: string;
}

export interface ApiResponse {
    versions?: Record<string, string>;
    stats?: ApiStats;
    new_projects?: string[];
    updated_projects?: string[];
    patched_projects?: string[];
    notif_tag?: string;
    active?: string;
}

export async function getWebsiteData(): Promise<ApiResponse | null> {
    try {
        const res = await fetch('https://api.sylvain.pro/latest/website', {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch API data');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching API data:', error);
        return null;
    }
}