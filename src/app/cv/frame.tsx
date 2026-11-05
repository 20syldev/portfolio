"use client";

import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Site frame of the CV page: navigation, scroll container, back and download buttons.
 * Everything but the sheet is hidden in print, and the scroll container lets the sheet
 * flow onto the paper.
 *
 * @param props - Component props
 * @param props.children - The CV sheet
 * @param props.pdfName - Name of the downloaded PDF, instead of the CV.pdf of its URL
 * @returns The frame holding the sheet between the navigation and the footer
 */
export function Frame({ children, pdfName }: { children: ReactNode; pdfName: string }) {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div
            ref={scrollRef}
            className="flex flex-col h-dvh overflow-y-auto scrollbar-none print:block print:h-auto print:overflow-visible"
        >
            <div className="print:hidden">
                <Nav currentTab={-1} tabs={tabs} links={urls} />
            </div>

            <main className="flex-1 container mx-auto px-4 pt-24 pb-12 print:m-0 print:max-w-none print:p-0">
                <div className="mx-auto mb-6 flex max-w-[794px] items-center justify-between print:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Link href="/" aria-label="Retour à l'accueil">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a href={profile.links.cvPdf} download={pdfName}>
                            <Download className="h-4 w-4" />
                            Télécharger le PDF
                        </a>
                    </Button>
                </div>

                {children}
            </main>

            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
}