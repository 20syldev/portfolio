"use client";

import { type MouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { popConfetti } from "@/lib/confetti";

// How long a tip opened by touch stays up before closing by itself (ms)
const touchDuration = 3500;

interface FavoriteTipProps {
    name: string;
    href: string;
    className?: string;
    label?: string;
    children: ReactNode;
}

/**
 * External link to a favorite technology, with a golden tooltip and a burst of confetti.
 * With a mouse the tip opens on hover and focus. On touch screens, where hover does not exist,
 * the first tap opens the tip and the second one follows the link. A tip opened by touch
 * closes by itself after a few seconds or on a tap elsewhere, never through the tooltip's own
 * pointer logic.
 *
 * @param props - Component props
 * @param props.name - Technology name shown in the tooltip
 * @param props.href - Link target, opened in a new tab
 * @param props.className - Classes of the link
 * @param props.label - Accessible name of the link, when its content is only an icon
 * @param props.children - Content of the link
 * @returns The rendered link with its tooltip
 */
export function FavoriteTip({ name, href, className, label, children }: FavoriteTipProps) {
    const anchorRef = useRef<HTMLAnchorElement>(null);
    const pointerType = useRef("mouse");
    const byTouch = useRef(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [open, setOpen] = useState(false);
    const [touch, setTouch] = useState(false);

    const pop = useCallback(() => {
        if (anchorRef.current) popConfetti(anchorRef.current);
    }, []);

    const close = useCallback(() => {
        clearTimeout(timer.current);
        byTouch.current = false;
        setTouch(false);
        setOpen(false);
    }, []);

    const handleOpenChange = (next: boolean) => {
        if (byTouch.current) return;
        setOpen(next);
        if (next) pop();
    };

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (pointerType.current !== "touch") return;
        pointerType.current = "mouse";

        if (byTouch.current) {
            close();
            return;
        }

        e.preventDefault();
        byTouch.current = true;
        setTouch(true);
        setOpen(true);
        pop();
        timer.current = setTimeout(close, touchDuration);
    };

    useEffect(() => {
        if (!open) return;
        const dismiss = (e: PointerEvent) => {
            if (byTouch.current && !anchorRef.current?.contains(e.target as Node)) close();
        };
        document.addEventListener("pointerdown", dismiss);
        return () => document.removeEventListener("pointerdown", dismiss);
    }, [open, close]);

    useEffect(() => () => clearTimeout(timer.current), []);

    return (
        <Tooltip open={open} onOpenChange={handleOpenChange}>
            <TooltipTrigger asChild>
                <a
                    ref={anchorRef}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    aria-label={label}
                    data-favorite=""
                    onPointerDown={(e) => {
                        pointerType.current = e.pointerType;
                    }}
                    onClick={handleClick}
                >
                    {children}
                </a>
            </TooltipTrigger>
            <TooltipContent
                sideOffset={6}
                className="favorite-tip flex flex-col items-center gap-0.5 font-semibold"
            >
                <span>{name}</span>
                {touch && (
                    <span className="text-[10px] opacity-70">Touchez à nouveau pour ouvrir</span>
                )}
            </TooltipContent>
        </Tooltip>
    );
}
