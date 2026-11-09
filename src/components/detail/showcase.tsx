"use client";

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sideways, sidewaysFrame } from "@/components/ui/sideways";
import type { ContentImage } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ShotProps {
    image: ContentImage;
    className?: string;
    eager?: boolean;
}

/**
 * Image rendered in its light and dark variants.
 * Both are lazy by default and the browser never fetches a lazy image hidden with display: none,
 * so only the variant of the active theme is downloaded; an eager image downloads both.
 *
 * @param props - Component props
 * @param props.image - Image read for its src, optional dark variant, alt and intrinsic size
 * @param props.className - Classes applied to each variant
 * @param props.eager - Loads the image right away, which suits the first image of a page (its LCP)
 * @returns The light image, followed by the dark one when the image has a dark variant
 */
function Shot({ image, className, eager = false }: ShotProps) {
    const loading = eager ? "eager" : "lazy";

    return (
        <>
            <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading={loading}
                fetchPriority={eager ? "high" : undefined}
                draggable={false}
                className={cn(className, image.dark && "dark:hidden")}
            />
            {image.dark && (
                <Image
                    src={image.dark}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading={loading}
                    draggable={false}
                    className={cn(className, "hidden dark:block")}
                />
            )}
        </>
    );
}

interface FigureProps {
    image: ContentImage;
    onOpen: () => void;
    className?: string;
    eager?: boolean;
}

/**
 * Image placed in the content, with its caption. A click opens the full-size view.
 *
 * @param props - Component props
 * @param props.image - Image to show, its alt text serving as caption and zoom label
 * @param props.onOpen - Opens the full-size view on this image
 * @param props.className - Classes of the figure, e.g. to replace the prose margin
 * @param props.eager - Loads the image right away, for the first image of a page
 * @returns The figure with its zoom button and caption
 */
export function Figure({ image, onOpen, className, eager }: FigureProps) {
    return (
        <figure className={cn("my-8", className)}>
            <button
                type="button"
                onClick={onOpen}
                aria-label={`Agrandir : ${image.alt}`}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border bg-muted"
            >
                <Shot image={image} className="h-auto w-full" eager={eager} />
                <span className="absolute top-3 right-3 rounded-md bg-background/80 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Maximize2 className="h-4 w-4" />
                </span>
            </button>
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                {image.alt}
            </figcaption>
        </figure>
    );
}

interface LightboxProps {
    images: ContentImage[];
    index: number | null;
    onIndexChange: (index: number | null) => void;
}

/**
 * Full-size view of the images of a page, paged with the arrow keys or the toolbar buttons.
 * The last image is kept while the dialog closes, so the exit animation has one to show, and
 * focus returns by hand to the opener, as there is no DialogTrigger.
 *
 * @param props - Component props
 * @param props.images - Every image of the page, in reading order
 * @param props.index - Index of the image shown, or null when closed
 * @param props.onIndexChange - Called with the new index, or null to close
 * @returns The rendered dialog, or nothing without images
 */
export function Lightbox({ images, index, onIndexChange }: LightboxProps) {
    const [shown, setShown] = useState(0);
    const opener = useRef<HTMLElement | null>(null);

    if (index !== null && index !== shown) setShown(index);

    const count = images.length;
    const current = images[index ?? shown] ?? images[0];
    if (!current) return null;

    const sideways = current.width > current.height;

    const step = (delta: number) => {
        if (index !== null) onIndexChange((index + delta + count) % count);
    };

    return (
        <Dialog open={index !== null} onOpenChange={(open) => !open && onIndexChange(null)}>
            <DialogContent
                aria-describedby={undefined}
                autoFocusClose
                showCloseButton={false}
                className={cn(
                    "grid-cols-[minmax(0,1fr)] gap-3 p-2 sm:max-w-[min(92vw,1400px)] sm:gap-3 sm:p-3",
                    sideways && sidewaysFrame
                )}
                onOpenAutoFocus={() => {
                    opener.current = document.activeElement as HTMLElement | null;
                }}
                onCloseAutoFocus={(e) => {
                    e.preventDefault();
                    opener.current?.focus({ preventScroll: true });
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowRight") step(1);
                    if (e.key === "ArrowLeft") step(-1);
                }}
            >
                <DialogTitle className="sr-only">{current.alt}</DialogTitle>
                <Sideways ratio={current.width / current.height} reserve="5rem" active={sideways}>
                    <Shot
                        image={current}
                        className={cn(
                            "mx-auto h-auto max-h-[calc(100dvh-8rem)] w-auto max-w-full rounded-lg",
                            sideways &&
                                "max-sm:portrait:mx-0 max-sm:portrait:max-h-none max-sm:portrait:w-full"
                        )}
                    />
                </Sideways>
                <div className="flex items-center gap-2 pl-2 text-sm text-muted-foreground">
                    <span aria-live="polite" className="min-w-0 flex-1 truncate">
                        {current.alt}
                    </span>
                    {count > 1 && (
                        <div className="flex shrink-0 items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => step(-1)}
                                aria-label="Image précédente"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center text-xs tabular-nums">
                                {(index ?? shown) + 1} / {count}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => step(1)}
                                aria-label="Image suivante"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <DialogClose
                        aria-label="Fermer"
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "shrink-0"
                        )}
                    >
                        <X className="h-4 w-4" />
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
