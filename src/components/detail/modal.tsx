"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import type { Project } from "@/data/projects";
import { useSmoothScroll } from "@/hooks/scroll";
import { cn } from "@/lib/utils";

import { DetailContent } from "./content";
import { DetailHeader } from "./header";
import { DetailNav } from "./nav";

interface DetailModalProps {
    project: Project | null;
    content: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Project detail modal.
 * Displays full markdown content with sidebar navigation and header.
 *
 * @param props - Component props
 * @param props.project - Project to display
 * @param props.content - Project markdown content
 * @param props.open - Modal open state
 * @param props.onOpenChange - Callback on open state change
 * @returns The rendered detail modal dialog
 */
export function DetailModal({ project, content, open, onOpenChange }: DetailModalProps) {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>({ enabled: open, delayed: true });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    className={cn(
                        "fixed z-50 bg-background border border-border sm:rounded-xl shadow-2xl",
                        "inset-0 sm:inset-8 md:inset-14 lg:inset-20",
                        "flex flex-col overflow-hidden",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "duration-200"
                    )}
                >
                    <VisuallyHidden>
                        <DialogPrimitive.Title>
                            {project?.name ?? "Project Details"}
                        </DialogPrimitive.Title>
                    </VisuallyHidden>
                    <div className="flex flex-col h-full p-6">
                        <DetailHeader project={project} onClose={() => onOpenChange(false)} />

                        <div className="flex flex-1 overflow-hidden mt-4 -mx-6">
                            {/* Desktop sidebar */}
                            <DetailNav
                                className="hidden md:flex"
                                scrollContainerRef={scrollRef}
                                content={content}
                            />

                            {/* Scrollable content */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6">
                                <div>
                                    {/* Mobile navigation */}
                                    <DetailNav
                                        className="md:hidden sticky top-0 z-10 -mt-2 mb-4"
                                        mobile
                                        scrollContainerRef={scrollRef}
                                        content={content}
                                    />

                                    <DetailContent content={content} />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}