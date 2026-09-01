import { Newspaper } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { type Article } from "@/data/articles";

const MONTHS = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
];

/**
 * Formats an ISO date as a French month and year.
 * Kept deterministic so the server and the client render the same string.
 *
 * @param date - ISO date string (YYYY-MM-DD)
 * @returns The formatted month and year
 */
function formatDate(date: string): string {
    const [year, month] = date.split("-");
    return `${MONTHS[Number(month) - 1]} ${year}`;
}

/**
 * Renders the list of blog articles laid out for Zenetys, newest first.
 *
 * @param props - Component props
 * @param props.articles - Articles to display
 * @param props.note - Line clarifying the role held on these articles
 * @returns The rendered article list
 */
export function ArticleList({ articles, note }: { articles: Article[]; note: string }) {
    return (
        <div className="rounded-lg border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{note}</span>
                <Badge variant="secondary" className="text-xs shrink-0">
                    {articles.length}
                </Badge>
            </div>
            <div className="divide-y divide-border">
                {articles.map((article) => (
                    <a
                        key={article.url}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-2.5 px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                        <Newspaper className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                        <span className="flex-1 min-w-0 text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                            {article.title}
                        </span>
                        <time
                            dateTime={article.date}
                            className="text-xs text-muted-foreground shrink-0 pt-0.5"
                        >
                            {formatDate(article.date)}
                        </time>
                    </a>
                ))}
            </div>
        </div>
    );
}