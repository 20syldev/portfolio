"use client";

import { useRef } from "react";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Project } from "@/data/projects";
import { ProjectDetailContent } from "./content";
import { ProjectDetailNav } from "./nav";
import { ProjectDetailHeader } from "./header";
import { cn } from "@/lib/utils";

interface ProjectDetailModalProps {
    project: Project | null;
    content: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProjectDetailModal({
    project,
    content,
    open,
    onOpenChange,
}: ProjectDetailModalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="bg-background/80 backdrop-blur-sm"/>
                <DialogPrimitive.Content
                    className={cn(
                        "fixed z-50 bg-background border border-border rounded-xl shadow-2xl",
                        "inset-4 sm:inset-8 md:inset-14 lg:inset-20",
                        "flex flex-col overflow-hidden",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    )}
                >
                    <VisuallyHidden>
                        <DialogPrimitive.Title>
                            {project?.name ?? "Project Details"}
                        </DialogPrimitive.Title>
                    </VisuallyHidden>
                    <div className="flex flex-col h-full p-6">
                        <ProjectDetailHeader
                            project={project}
                            onClose={() => onOpenChange(false)}
                        />

                        <div className="flex flex-1 overflow-hidden mt-4 -mx-6">
                            {/* Desktop sidebar */}
                            <ProjectDetailNav
                                className="hidden md:flex"
                                scrollContainerRef={scrollRef}
                                content={content}
                            />

                            {/* Scrollable content */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto px-6 scroll-smooth"
                            >
                                {/* Mobile navigation */}
                                <ProjectDetailNav
                                    className="md:hidden sticky top-0 z-10 -mt-2 mb-4"
                                    mobile
                                    scrollContainerRef={scrollRef}
                                    content={content}
                                />

                                <ProjectDetailContent content={content}/>
                            </div>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}