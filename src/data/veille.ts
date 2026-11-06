import veilleData from "./veille-index.json";

export interface Veille {
    id: string;
    title: string;
    description: string;
    keywords?: string[];
    url?: string;
    order?: number;
    hasContent: boolean;
}

// Technology watch entries loaded from veille-index.json
export const veilles: Veille[] = veilleData as Veille[];