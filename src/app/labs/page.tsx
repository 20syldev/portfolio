"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { labs, totalLabs } from "@/data/achievements";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Labs page listing all codelabs and learning activities.
 *
 * @returns The rendered labs page
 */
export default function LabsPage() {
    const router = useRouter();
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />
            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-3xl">
                        {/* Navigation */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => router.push("/badges")}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Header */}
                        <div className="mb-12 text-center">
                            <h1 className="mb-2 text-4xl font-bold">Labs</h1>
                            <p className="text-xl text-muted-foreground">
                                {totalLabs} codelabs & apprentissages Google
                            </p>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col gap-8">
                            {labs.map((category) => (
                                <div key={category.name}>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                        {category.name}
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {category.items.map((item) => (
                                            <a
                                                key={item.url}
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between gap-4 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
                                            >
                                                <span className="text-sm leading-tight">
                                                    {item.name}
                                                </span>
                                                <div className="flex items-center shrink-0">
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.date}
                                                    </span>
                                                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:ml-4 group-hover:opacity-100 transition-all" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}