import docsData from "./docs.json";

export interface Doc {
    id: string;
    title: string;
    description: string;
    category: string;
    slug: string;
    order?: number;
    hasContent: boolean;
    content?: string;
}

// Documentation entries loaded from docs.json
export const docs: Doc[] = docsData as Doc[];