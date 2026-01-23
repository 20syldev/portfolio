"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";

interface TagsProps {
    tags: string[];
    maxVisible?: number;
}

/**
 * Tags display component with expansion.
 * Shows a limited number of tags with a button to see more.
 *
 * @param props - Component properties
 * @param props.tags - List of tags to display
 * @param props.maxVisible - Max visible tags before expansion (default: 3)
 */
export function Tags({ tags, maxVisible = 3 }: TagsProps) {
    const [expanded, setExpanded] = useState(false);
    const visibleTags = expanded ? tags : tags.slice(0, maxVisible);
    const hiddenCount = tags.length - maxVisible;

    return (
        <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] xl:text-xs px-1.5 py-0">
                    {tag}
                </Badge>
            ))}
            {!expanded && hiddenCount > 0 && (
                <Badge
                    variant="outline"
                    className="text-[10px] xl:text-xs px-1.5 py-0 cursor-pointer hover:bg-muted"
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