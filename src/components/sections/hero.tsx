"use client";

import { FileText, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BlackHoleVortex, collapseBlackHole, ResultScreen } from "@/components/utils/blackhole";
import { useFont } from "@/components/utils/font";
import { useMultiTap } from "@/components/utils/konami";
import { usePdfViewer } from "@/components/utils/viewer";
import { profile } from "@/data/profile";
import { useDraggablePhysics } from "@/hooks/physics";
import { useSparkle } from "@/hooks/sparkle";

/**
 * Simplified hero section.
 * Displays logo, name, description and 3 icons (GitHub, LinkedIn, CV).
 *
 * @returns The rendered hero section
 */
export function Hero() {
    const { openPdf } = usePdfViewer();
    const { setDialogOpen } = useFont();
    const { theme, setTheme } = useTheme();
    const [sucked, setSucked] = useState(false);
    const suckedRef = useRef(false);
    const previousThemeRef = useRef<string | undefined>(undefined);
    const [singularity, setSingularity] = useState({ cx: 0, cy: 0 });

    const triggerBlackHole = useCallback(
        (rect: DOMRect) => {
            if (suckedRef.current) return;
            if (document.body.classList.contains("no-motion")) return;
            suckedRef.current = true;
            previousThemeRef.current = theme;
            setSingularity({
                cx: rect.left + rect.width / 2,
                cy: rect.top + rect.height / 2,
            });
            setSucked(true);
            collapseBlackHole(rect);
        },
        [theme]
    );

    const handleAllEdges = useCallback(
        (rect: DOMRect): boolean => {
            triggerBlackHole(rect);
            return true;
        },
        [triggerBlackHole]
    );

    const {
        ref: logoRef,
        isDragging,
        settle,
    } = useDraggablePhysics({
        onAllEdges: handleAllEdges,
    });
    useSparkle(logoRef, isDragging);
    useMultiTap(logoRef);

    useEffect(() => {
        const onTouch = (e: TouchEvent) => {
            if (e.touches.length < 5 || suckedRef.current) return;
            const logo = logoRef.current;
            if (!logo) return;
            const rect = logo.getBoundingClientRect();
            const touchesLogo = Array.from(e.touches).some(
                (t) =>
                    t.clientX >= rect.left &&
                    t.clientX <= rect.right &&
                    t.clientY >= rect.top &&
                    t.clientY <= rect.bottom
            );
            if (touchesLogo) triggerBlackHole(rect);
        };
        window.addEventListener("touchstart", onTouch, { passive: true });
        return () => window.removeEventListener("touchstart", onTouch);
    }, [logoRef, triggerBlackHole]);

    const handleExpanded = useCallback(() => {
        setTheme("dark");
    }, [setTheme]);

    const handleReset = useCallback(() => {
        suckedRef.current = false;
        setSucked(false);
        if (previousThemeRef.current) {
            setTheme(previousThemeRef.current);
            previousThemeRef.current = undefined;
        }
        settle.current?.();
    }, [settle, setTheme]);

    return (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            {/* Logo */}
            <div ref={logoRef} className="relative inline-block">
                <Image
                    src="/favicon.ico"
                    alt={profile.name}
                    width={120}
                    height={120}
                    className="rounded-full shadow-lg pointer-events-none"
                    draggable={false}
                    priority
                />
            </div>

            {/* Nom & Titre */}
            <div className="mt-6 space-y-1">
                <h1
                    className="text-3xl font-bold cursor-pointer select-none"
                    onClick={() => setDialogOpen(true)}
                >
                    <span className="animate-shine">{profile.name}</span>
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

            {/* Black Hole Easter Egg */}
            {sucked && (
                <>
                    <BlackHoleVortex
                        cx={singularity.cx}
                        cy={singularity.cy}
                        onExpanded={handleExpanded}
                    />
                    <ResultScreen onReset={handleReset} />
                </>
            )}
        </div>
    );
}