"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TagsProps {
    tags: string[];
    maxVisible?: number;
}

export function Tags({ tags, maxVisible = 3 }: TagsProps) {
    const [expanded, setExpanded] = useState(false);
    const visibleTags = expanded ? tags : tags.slice(0, maxVisible);
    const hiddenCount = tags.length - maxVisible;

    return (
        <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-1.5 py-0"
                >
                    {tag}
                </Badge>
            ))}
            {!expanded && hiddenCount > 0 && (
                <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0 cursor-pointer hover:bg-muted"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(true);
                    }}
                >
                    +{hiddenCount}
                </Badge>
            )}
        </div>
    );
}
