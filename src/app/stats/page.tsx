"use client";

import {
    Award,
    BookOpen,
    Box,
    Clock,
    Code2,
    Cpu,
    FileText,
    Gauge,
    Github,
    GraduationCap,
    Layers,
    Monitor,
    Newspaper,
    Package,
    Tag,
    Trophy,
    Zap,
} from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { ActivityChart } from "@/components/stats/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    totalCertifications,
    totalCompletionBadges,
    totalGdevBadges,
    totalLabs,
} from "@/data/achievements";
import { docs } from "@/data/docs";
import { projects } from "@/data/projects";
import { techCategories } from "@/data/technologies";
import { veilles } from "@/data/veille";
import { useApi } from "@/hooks/api";
import { useBrowserStats } from "@/hooks/browser";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

const totalTech = techCategories.reduce((acc, cat) => acc + cat.items.length, 0);
const uniqueTags = new Set(projects.flatMap((p) => p.tags)).size;

type StatItem = {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    loading?: boolean;
    href?: string;
};

/**
 * Single stat card, optionally wrapped in a link.
 *
 * @param props - Stat item props
 * @returns The rendered stat card
 */
function StatCard({ label, value, icon: Icon, loading, href }: StatItem) {
    const card = (
        <Card className="card-hover h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-normal">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <p className="text-3xl font-bold">{value}</p>
                )}
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href}>{card}</Link>;
    }

    return card;
}

/**
 * Stats page.
 * Displays portfolio metrics: projects, veilles, docs, technologies, certifications and GitHub activity.
 *
 * @returns The rendered stats page
 */
export default function StatsPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();
    const { stats, loading } = useApi();
    const { browserStats, loading: browserLoading } = useBrowserStats();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />
            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="mb-2 text-4xl font-bold">Statistiques</h1>
                        <p className="text-xl text-muted-foreground">Vue d'ensemble du portfolio</p>
                    </div>

                    {/* GitHub activity */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                            Activité GitHub
                        </h2>
                        <ActivityChart data={stats?.activity} loading={loading} />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                            <StatCard
                                label="Contributions aujourd'hui"
                                value={stats?.today ?? "—"}
                                icon={Github}
                                loading={loading || stats?.today == null}
                            />
                            <StatCard
                                label="Contributions ce mois"
                                value={stats?.month ?? "—"}
                                icon={Github}
                                loading={loading || stats?.month == null}
                            />
                            <StatCard
                                label="Contributions l'an dernier"
                                value={stats?.year ?? "—"}
                                icon={Github}
                                loading={loading || stats?.year == null}
                            />
                        </div>
                    </section>

                    {/* Portfolio */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                            Portfolio
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard
                                label="Projets"
                                value={projects.length}
                                icon={Package}
                                href="/repositories"
                            />
                            <StatCard
                                label="Veilles"
                                value={veilles.length}
                                icon={Newspaper}
                                href="/veille/"
                            />
                            <StatCard
                                label="Documentations"
                                value={docs.length}
                                icon={FileText}
                                href="/help/"
                            />
                            <StatCard label="Tags uniques" value={uniqueTags} icon={Tag} />
                        </div>
                    </section>

                    {/* Technologies */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                            Technologies
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <StatCard
                                label="Technologies"
                                value={totalTech}
                                icon={Code2}
                                href="/tech"
                            />
                            <StatCard
                                label="Catégories"
                                value={techCategories.length}
                                icon={Layers}
                                href="/tech"
                            />
                            <StatCard
                                label="Langages"
                                value={
                                    techCategories.find((c) => c.name === "Langages")?.items
                                        .length ?? 0
                                }
                                icon={BookOpen}
                                href="/tech"
                            />
                        </div>
                    </section>

                    {/* Certifications */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                            Certifications & Badges
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard
                                label="Certifications"
                                value={totalCertifications}
                                icon={Award}
                                href="/certifications"
                            />
                            <StatCard
                                label="Badges Google"
                                value={totalGdevBadges}
                                icon={Trophy}
                                href="/badges"
                            />
                            <StatCard
                                label="Complétion Cloud"
                                value={totalCompletionBadges}
                                icon={GraduationCap}
                                href="/completion"
                            />
                            <StatCard
                                label="Labs Google"
                                value={totalLabs}
                                icon={BookOpen}
                                href="/labs"
                            />
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                            Expérience
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard
                                label="Expérience Front-End"
                                value={stats?.frontend ?? "8 ans"}
                                icon={Code2}
                                loading={loading}
                            />
                            <StatCard
                                label="Expérience Back-End"
                                value={stats?.backend ?? "5 ans"}
                                icon={Code2}
                                loading={loading}
                            />
                        </div>
                    </section>

                    {/* Browser */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                            Navigateur
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <StatCard
                                label="Latence API"
                                value={
                                    browserStats?.apiLatency != null
                                        ? `${browserStats.apiLatency}ms`
                                        : "—"
                                }
                                icon={Zap}
                                loading={browserLoading || browserStats?.apiLatency == null}
                            />
                            <StatCard
                                label="Chargement"
                                value={
                                    browserStats?.pageLoadTime != null
                                        ? `${browserStats.pageLoadTime}ms`
                                        : "—"
                                }
                                icon={Clock}
                                loading={browserLoading || browserStats?.pageLoadTime == null}
                            />
                            <StatCard
                                label="TTFB"
                                value={browserStats?.ttfb != null ? `${browserStats.ttfb}ms` : "—"}
                                icon={Gauge}
                                loading={browserLoading || browserStats?.ttfb == null}
                            />
                            <StatCard
                                label="FPS"
                                value={browserStats?.fps ?? "—"}
                                icon={Monitor}
                                loading={browserLoading || browserStats?.fps == null}
                            />
                            <StatCard
                                label="Nodes DOM"
                                value={browserStats?.domNodes ?? "—"}
                                icon={Box}
                                loading={browserLoading || browserStats?.domNodes == null}
                            />
                            <StatCard
                                label="Mémoire JS"
                                value={
                                    browserStats?.jsHeapMB != null
                                        ? `${browserStats.jsHeapMB} MB`
                                        : "—"
                                }
                                icon={Cpu}
                                loading={browserLoading || browserStats?.jsHeapMB == null}
                            />
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}