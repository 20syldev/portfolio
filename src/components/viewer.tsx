"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronLeft, ChevronRight, ExternalLink, Minus, Plus, XIcon } from "lucide-react";
import * as React from "react";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import type { DocumentProps, PageProps } from "react-pdf";

import { Button } from "@/components/ui/button";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useContainerSmoothScroll } from "@/hooks/scroll";
import { cn } from "@/lib/utils";

type ReactPdfModule = {
    Document: React.ComponentType<DocumentProps>;
    Page: React.ComponentType<PageProps>;
};

function useReactPdf() {
    const [mod, setMod] = React.useState<ReactPdfModule | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        Promise.all([
            import("react-pdf"),
            // @ts-expect-error css modules have no type declarations
            import("react-pdf/dist/Page/AnnotationLayer.css"),
            // @ts-expect-error css modules have no type declarations
            import("react-pdf/dist/Page/TextLayer.css"),
        ]).then(([reactPdf]) => {
            if (cancelled) return;
            reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.mjs",
                import.meta.url
            ).toString();
            setMod({ Document: reactPdf.Document, Page: reactPdf.Page });
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return mod;
}

interface PdfViewerContextValue {
    openPdf: (url: string, title: string, event?: { shiftKey: boolean }) => void;
    closePdf: () => void;
}

const PdfViewerContext = createContext<PdfViewerContextValue | null>(null);

/**
 * Provider for the PDF viewer dialog.
 * Manages open/close state and renders the viewer overlay.
 *
 * @param props - Provider props
 * @param props.children - Child elements to wrap
 * @returns The rendered provider with PDF viewer dialog
 */
export function PdfViewerProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [pdf, setPdf] = useState<{ url: string; title: string } | null>(null);

    const openPdf = useCallback((url: string, title: string, event?: { shiftKey: boolean }) => {
        if (event?.shiftKey) {
            window.open(url, "_blank");
            return;
        }
        setPdf({ url, title });
        setOpen(true);
    }, []);

    const closePdf = useCallback(() => {
        setOpen(false);
        setPdf(null);
    }, []);

    return (
        <PdfViewerContext.Provider value={{ openPdf, closePdf }}>
            {children}
            <PdfViewerDialog
                url={pdf?.url ?? null}
                title={pdf?.title ?? null}
                open={open}
                onOpenChange={(isOpen) => {
                    if (!isOpen) closePdf();
                }}
            />
        </PdfViewerContext.Provider>
    );
}

/**
 * Hook to access the PDF viewer context.
 * Provides openPdf and closePdf methods.
 *
 * @returns The PDF viewer context value
 */
export function usePdfViewer() {
    const context = useContext(PdfViewerContext);
    if (!context) {
        throw new Error("usePdfViewer must be used within a PdfViewerProvider");
    }
    return context;
}

const ZOOM_STEP = 0.2;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

interface PdfViewerDialogProps {
    url: string | null;
    title: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function PdfViewerDialog({ url, title, open, onOpenChange }: PdfViewerDialogProps) {
    const [numPages, setNumPages] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [scale, setScale] = React.useState(1);
    const [containerWidth, setContainerWidth] = React.useState<number | undefined>();
    const scrollRef = useContainerSmoothScroll<HTMLDivElement>(open);
    const reactPdf = useReactPdf();

    // Détection du type d'appareil pour le zoom initial
    const getInitialScale = React.useCallback(() => {
        if (typeof window === "undefined") return 1;
        const width = window.innerWidth;
        if (width < 768) return 0.6; // Mobile: 60%
        if (width < 1024) return 0.8; // Tablette: 80%
        return 1; // Desktop: 100%
    }, []);

    React.useEffect(() => {
        if (!open) {
            setPage(1);
            setScale(getInitialScale());
            setNumPages(0);
        }
    }, [open, getInitialScale]);

    React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [open, scrollRef]);

    const zoomIn = () => setScale((s) => Math.min(ZOOM_MAX, s + ZOOM_STEP));
    const zoomOut = () => setScale((s) => Math.max(ZOOM_MIN, s - ZOOM_STEP));
    const prevPage = () => setPage((p) => Math.max(1, p - 1));
    const nextPage = () => setPage((p) => Math.min(numPages, p + 1));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    className={cn(
                        "fixed z-50 bg-background border border-border sm:rounded-xl shadow-2xl",
                        "inset-0 sm:inset-8 md:inset-14 lg:inset-16",
                        "flex flex-col overflow-hidden",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "duration-200"
                    )}
                >
                    <VisuallyHidden>
                        <DialogPrimitive.Title>{title ?? "PDF"}</DialogPrimitive.Title>
                    </VisuallyHidden>

                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b">
                        <h2 className="pl-1 text-lg font-semibold truncate">{title}</h2>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={url ?? "#"} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">Ouvrir dans un nouvel onglet</span>
                                </a>
                            </Button>
                            <DialogPrimitive.Close asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <XIcon className="h-4 w-4" />
                                    <span className="sr-only">Fermer</span>
                                </Button>
                            </DialogPrimitive.Close>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center justify-center gap-2 px-6 py-2 border-b text-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={prevPage}
                            disabled={page <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="tabular-nums text-muted-foreground min-w-[4rem] text-center">
                            {page} / {numPages || "–"}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={nextPage}
                            disabled={page >= numPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <div className="w-px h-4 bg-border mx-1" />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={zoomOut}
                            disabled={scale <= ZOOM_MIN}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="tabular-nums text-muted-foreground min-w-[3rem] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={zoomIn}
                            disabled={scale >= ZOOM_MAX}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* PDF content */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto bg-muted/30">
                        <div className="flex justify-center">
                            {url && reactPdf ? (
                                <reactPdf.Document
                                    file={url}
                                    onLoadSuccess={({ numPages: total }) => setNumPages(total)}
                                    loading={
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            Chargement…
                                        </div>
                                    }
                                    error={
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            Impossible de charger le PDF.
                                        </div>
                                    }
                                >
                                    <reactPdf.Page
                                        pageNumber={page}
                                        scale={scale}
                                        width={
                                            containerWidth && scale === 1
                                                ? Math.min(containerWidth - 48, 900)
                                                : undefined
                                        }
                                        className="my-4 shadow-lg"
                                        loading={null}
                                    />
                                </reactPdf.Document>
                            ) : (
                                url && (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                        Chargement…
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}