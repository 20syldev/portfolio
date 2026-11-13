import docsData from "./docs-index.json";
import type { ContentImage } from "./projects";

export interface Doc {
    id: string;
    title: string;
    description: string;
    category: string;
    slug: string;
    order?: number;
    images?: ContentImage[];
    hasContent: boolean;
}

// Documentation entries loaded from docs-index.json
export const docs: Doc[] = docsData as Doc[];
