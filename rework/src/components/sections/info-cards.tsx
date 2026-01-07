"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Briefcase, Activity, Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profile } from "@/data/profile";
import Link from "next/link";

interface Stats {
    frontend?: string;
    backend?: string;
    hours?: string;
    today?: string;
    this_month?: string;
    last_year?: string;
}

const rotatingStats = [
    { label: "Heures de code", key: "hours" },
    { label: "Contributions aujourd'hui", key: "today" },
    { label: "Contributions ce mois", key: "this_month" },
    { label: "Contributions l'an dernier", key: "last_year" },
] as const;

export function InfoCards() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [rotateIndex, setRotateIndex] = useState(0);

    useEffect(() => {
        fetch("https://api.sylvain.pro/latest/website")
            .then((res) => res.json())
            .then((data) => setStats(data?.stats))
            .catch(() => setStats(null));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotateIndex((i) => (i + 1) % rotatingStats.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentRotating = rotatingStats[rotateIndex];
    const rotatingValue = stats?.[currentRotating.key as keyof Stats] || "—";

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {/* Parcours */}
            <Card className="card-hover">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        Parcours
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <p className="font-medium">{profile.education.school}</p>
                        <p className="text-xs text-muted-foreground">
                            {profile.education.degree} ({profile.education.duration})
                        </p>
                    </div>
                    <div className="border-t pt-3">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{profile.work.company}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{profile.work.role}</p>
                        <Link
                            href="/alternance"
                            className="text-xs text-primary hover:underline"
                        >
                            Voir les projets →
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <Card className="card-hover">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4 text-primary" />
                        Expérience
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Front-End</span>
                        <span className="font-medium">{stats?.frontend || "8 ans"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Back-End</span>
                        <span className="font-medium">{stats?.backend || "5 ans"}</span>
                    </div>
                    <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-xs transition-opacity duration-300">
                                {currentRotating.label}
                            </span>
                            <a
                                href="https://github.com/20syldev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline transition-all duration-300"
                            >
                                {rotatingValue}
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* GitHub Activity */}
            <Card className="card-hover">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Github className="h-4 w-4 text-primary" />
                        GitHub
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <a
                        href="https://github.com/20syldev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium hover:text-primary"
                    >
                        @20syldev
                    </a>
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Aujourd'hui</span>
                            <span className="text-foreground">{stats?.today || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Ce mois</span>
                            <span className="text-foreground">{stats?.this_month || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>L'an dernier</span>
                            <span className="text-foreground">{stats?.last_year || "—"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}