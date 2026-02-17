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

export const docs: Doc[] = docsData as Doc[];