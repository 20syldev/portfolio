"use client";

import { FileText, Github, Linkedin } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFont } from "@/components/utils/font";
import { usePdfViewer } from "@/components/utils/viewer";
import { profile } from "@/data/profile";

/**
 * Simplified hero section.
 * Displays logo, name, description and 3 icons (GitHub, LinkedIn, CV).
 *
 * @returns The rendered hero section
 */
export function Hero() {
    const { openPdf } = usePdfViewer();
    const { setDialogOpen } = useFont();

    return (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            {/* Logo */}
            <Image
                src="/favicon.ico"
                alt={profile.name}
                width={120}
                height={120}
                className="rounded-full shadow-lg"
                priority
            />

            {/* Nom & Titre */}
            <div className="mt-6 space-y-1">
                <h1
                    className="text-3xl font-bold cursor-pointer select-none"
                    onClick={() => setDialogOpen(true)}
                >
                    {profile.name}
                </h1>
                <p className="text-lg text-muted-foreground">{profile.title}</p>
            </div>

            {/* Description */}
            <p className="mt-4 max-w-md text-sm text-muted-foreground">{profile.description}</p>

            {/* Icônes */}
            <TooltipProvider>
                <div className="mt-8 flex">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                size="icon"
                                variant="ghost"
                                className="h-12 w-12 rounded-full"
                            >
                                <a
                                    href={profile.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-5 w-5" />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>GitHub</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                size="icon"
                                variant="ghost"
                                className="h-12 w-12 rounded-full"
                            >
                                <a
                                    href={profile.links.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>LinkedIn</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-12 w-12 rounded-full"
                                onClick={(e) => openPdf(profile.links.cv, "CV", e)}
                            >
                                <FileText className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>CV</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}