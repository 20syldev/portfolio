"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Expand } from "@/components/ui/expand";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityWeek } from "@/hooks/api";
import { cn } from "@/lib/utils";

const monthsFr = [
    "Jan",
    "Fev",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Aou",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const pad = { top: 20, right: 20, bottom: 30, left: 45 };
const W = 800;
const H = 300;
const chartW = W - pad.left - pad.right;
const chartH = H - pad.top - pad.bottom;

/**
 * Prepare chart data: drop incomplete last week, compute paths and labels.
 */
function prepareChartData(data?: ActivityWeek[]) {
    if (!data || data.length === 0) return null;

    const lastWeek = data[data.length - 1];
    const weeks = lastWeek.days.length < 7 ? data.slice(0, -1) : data;
    if (weeks.length === 0) return null;

    const maxY = Math.max(...weeks.map((w) => w.total), 1);
    const ticks = 4;

    function x(i: number) {
        return pad.left + (i / (weeks.length - 1)) * chartW;
    }

    function y(val: number) {
        return pad.top + chartH - (val / maxY) * chartH;
    }

    const linePath = weeks.map((w, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(w.total)}`).join(" ");
    const areaPath = `${linePath} L ${x(weeks.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

    const minLabelGap = 40;
    const monthLabels: { x: number; label: string }[] = [];
    let lastMonth = -1;
    let lastLabelX = -Infinity;
    for (let i = 0; i < weeks.length; i++) {
        const month = new Date(weeks[i].week).getMonth();
        if (month !== lastMonth && x(i) - lastLabelX >= minLabelGap) {
            monthLabels.push({ x: x(i), label: monthsFr[month] });
            lastMonth = month;
            lastLabelX = x(i);
        }
    }

    function formatDate(dateStr: string) {
        const d = new Date(dateStr);
        return `${d.getDate()} ${monthsFr[d.getMonth()]}`;
    }

    function formatWeekRange(week: (typeof weeks)[number]) {
        const start = week.days[0]?.date ?? week.week;
        const end = week.days[week.days.length - 1]?.date ?? week.week;
        return `${formatDate(start)} — ${formatDate(end)}`;
    }

    return { weeks, maxY, ticks, x, y, linePath, areaPath, monthLabels, formatWeekRange };
}

/**
 * The SVG chart rendering, used both inline and inside the dialog.
 */
function ChartSvg({
    chart,
    hovered,
    setHovered,
}: {
    chart: NonNullable<ReturnType<typeof prepareChartData>>;
    hovered: number | null;
    setHovered: (i: number | null) => void;
}) {
    const { weeks, maxY, ticks, x, y, linePath, areaPath, monthLabels, formatWeekRange } = chart;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {Array.from({ length: ticks + 1 }, (_, i) => {
                const val = Math.round((maxY / ticks) * i);
                const yPos = y(val);
                return (
                    <g key={i}>
                        <line
                            x1={pad.left}
                            x2={W - pad.right}
                            y1={yPos}
                            y2={yPos}
                            className="stroke-border"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                        />
                        <text
                            x={pad.left - 8}
                            y={yPos + 4}
                            textAnchor="end"
                            fontSize={11}
                            className="fill-muted-foreground"
                        >
                            {val}
                        </text>
                    </g>
                );
            })}

            {/* X-axis month labels */}
            {monthLabels.map(({ x: mx, label }) => (
                <text
                    key={`${label}-${mx}`}
                    x={mx}
                    y={H - 6}
                    textAnchor="middle"
                    fontSize={11}
                    className="fill-muted-foreground"
                >
                    {label}
                </text>
            ))}

            {/* Area fill */}
            <path d={areaPath} fill="var(--color-chart-1)" opacity={0.15} />

            {/* Line stroke */}
            <path d={linePath} fill="none" stroke="var(--color-chart-1)" strokeWidth={2} />

            {/* Data points on hover */}
            {hovered !== null && (
                <>
                    <line
                        x1={x(hovered)}
                        x2={x(hovered)}
                        y1={pad.top}
                        y2={pad.top + chartH}
                        stroke="var(--color-chart-1)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        opacity={0.5}
                    />
                    <circle
                        cx={x(hovered)}
                        cy={y(weeks[hovered].total)}
                        r={4}
                        fill="var(--color-chart-1)"
                    />
                    {/* Tooltip background + text */}
                    {(() => {
                        const tooltipW = 220;
                        const tooltipH = 36;
                        const tx = Math.max(
                            pad.left,
                            Math.min(x(hovered) - tooltipW / 2, W - pad.right - tooltipW)
                        );
                        const ty = Math.max(pad.top, y(weeks[hovered].total) - tooltipH - 12);
                        return (
                            <g>
                                <rect
                                    x={tx}
                                    y={ty}
                                    width={tooltipW}
                                    height={tooltipH}
                                    rx={6}
                                    className="fill-card stroke-border"
                                />
                                <text
                                    x={tx + tooltipW / 2}
                                    y={ty + 14}
                                    textAnchor="middle"
                                    fontSize={10}
                                    className="fill-muted-foreground"
                                >
                                    {formatWeekRange(weeks[hovered])}
                                </text>
                                <text
                                    x={tx + tooltipW / 2}
                                    y={ty + 28}
                                    textAnchor="middle"
                                    fontSize={11}
                                    fontWeight={500}
                                    className="fill-foreground"
                                >
                                    {weeks[hovered].total} contributions
                                </text>
                            </g>
                        );
                    })()}
                </>
            )}

            {/* Invisible hover rects */}
            {weeks.map((_, i) => (
                <rect
                    key={i}
                    x={x(i) - chartW / weeks.length / 2}
                    y={pad.top}
                    width={chartW / weeks.length}
                    height={chartH}
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                />
            ))}
        </svg>
    );
}

/**
 * Pure SVG area chart showing GitHub contributions over ~52 weeks.
 * Clickable to open a larger dialog view.
 *
 * @param props - Chart props
 * @param props.data - Weekly activity data from API
 * @param props.loading - Whether data is still loading
 * @returns The rendered activity chart
 */
export function ActivityChart({ data, loading }: { data?: ActivityWeek[]; loading: boolean }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [dialogHovered, setDialogHovered] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    if (loading || !data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Contributions GitHub</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[320px] w-full rounded-lg" />
                </CardContent>
            </Card>
        );
    }

    const chart = prepareChartData(data);
    if (!chart) return null;

    return (
        <>
            <Card
                className="group relative max-sm:cursor-pointer"
                onClick={() => {
                    if (window.innerWidth < 640) setOpen(true);
                }}
            >
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Contributions GitHub</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-2 lg:p-0">
                    <ChartSvg chart={chart} hovered={hovered} setHovered={setHovered} />
                </CardContent>
                <Expand className="rounded-xl sm:hidden" />
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className={cn(
                        "flex items-center justify-center",
                        "w-[100dvh] h-[100vw]",
                        "p-0",
                        "max-w-none max-h-none",
                        "rotate-90 origin-center"
                    )}
                    showCloseButton
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Contributions GitHub</DialogTitle>
                    </DialogHeader>
                    <div className="w-full flex-1">
                        <ChartSvg
                            chart={chart}
                            hovered={dialogHovered}
                            setHovered={setDialogHovered}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

/**
 * Tiny sparkline SVG for inline display.
 * Shows the last N weeks of activity as a small area chart.
 *
 * @param props - Sparkline props
 * @param props.data - Weekly activity data
 * @param props.className - Optional wrapper class
 * @param props.interactive - Enable hover tooltip
 * @returns The rendered sparkline
 */
export function Sparkline({
    data,
    className,
    interactive,
}: {
    data?: ActivityWeek[];
    className?: string;
    interactive?: boolean;
}) {
    const [hovered, setHovered] = useState<number | null>(null);

    if (!data || data.length === 0) return null;

    const lastW = data[data.length - 1];
    const weeks = lastW.days.length < 7 ? data.slice(0, -1) : data;

    if (weeks.length === 0) return null;

    const w = 400;
    const h = 50;
    const inset = 2;

    const maxY = Math.max(...weeks.map((d) => d.total), 1);

    function sx(i: number) {
        return inset + (i / (weeks.length - 1)) * (w - inset * 2);
    }

    function sy(val: number) {
        return inset + (h - inset * 2) - (val / maxY) * (h - inset * 2);
    }

    const line = weeks.map((d, i) => `${i === 0 ? "M" : "L"} ${sx(i)} ${sy(d.total)}`).join(" ");
    const area = `${line} L ${sx(weeks.length - 1)} ${sy(0)} L ${sx(0)} ${sy(0)} Z`;

    return (
        <div className={`relative ${className || ""}`}>
            <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
                <path d={area} fill="var(--color-chart-1)" opacity={0.15} />
                <path d={line} fill="none" stroke="var(--color-chart-1)" strokeWidth={1.5} />
                {interactive && hovered !== null && (
                    <>
                        <line
                            x1={sx(hovered)}
                            x2={sx(hovered)}
                            y1={0}
                            y2={h}
                            stroke="var(--color-chart-1)"
                            strokeWidth={1}
                            opacity={0.4}
                        />
                        <circle
                            cx={sx(hovered)}
                            cy={sy(weeks[hovered].total)}
                            r={3}
                            fill="var(--color-chart-1)"
                        />
                    </>
                )}
                {interactive &&
                    weeks.map((_, i) => (
                        <rect
                            key={i}
                            x={sx(i) - (w - inset * 2) / weeks.length / 2}
                            y={0}
                            width={(w - inset * 2) / weeks.length}
                            height={h}
                            fill="transparent"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}
            </svg>
            {interactive && hovered !== null && (
                <div
                    className="absolute -top-8 pointer-events-none bg-card border rounded-md px-2 py-1 text-[10px] text-foreground shadow-sm whitespace-nowrap"
                    style={{
                        left: `${(hovered / (weeks.length - 1)) * 100}%`,
                        transform: "translateX(-50%)",
                    }}
                >
                    {weeks[hovered].total} contributions
                </div>
            )}
        </div>
    );
}