import veilleData from "./veille.json";

export interface Veille {
    id: string;
    title: string;
    description: string;
    keywords?: string[];
    url?: string;
    order?: number;
    hasContent: boolean;
    content?: string;
}

// Technology watch entries loaded from veille.json
export const veilles: Veille[] = veilleData as Veille[];