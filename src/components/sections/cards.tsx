"use client";

import {
    LucideBookOpenText,
    GraduationCap,
    Briefcase,
    Github,
    BriefcaseBusiness,
    Award,
    GitPullRequest,
    Download,
    Plane,
    Database,
    CalendarDays,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { profile, badges, contributions, projects } from "@/data/profile";
import Link from "next/link";
import { useApi } from "@/hooks/api";

const iconMap = {
    calendar: CalendarDays,
    database: Database,
    plane: Plane,
};

export function InfoCards() {
    const { stats } = useApi();

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {/* Parcours */}
            <Card className="card-hover">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <GraduationCap className="h-4 w-4 text-primary"/>
                        Parcours
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">
                                {profile.education.school}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {profile.education.degree} (
                                {profile.education.duration})
                            </p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                    Projets
                                    <LucideBookOpenText className="ml-1 h-3 w-3"/>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Projets Ensitech</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                    {projects.map((project) => {
                                        const Icon = iconMap[project.icon as keyof typeof iconMap];
                                        return (
                                            <div key={project.repo} className="flex items-center gap-4 p-3 rounded-lg border">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                                                    <Icon className="h-5 w-5 text-primary"/>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{project.name}</p>
                                                    <p className="text-xs text-muted-foreground">{project.desc}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                                                        <a href={`https://github.com/20syldev/${project.repo}`} target="_blank" rel="noopener noreferrer">
                                                            <Github className="h-4 w-4"/>
                                                        </a>
                                                    </Button>
                                                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                                                        <a href={`https://github.com/20syldev/${project.repo}/archive/refs/heads/${project.branch}.zip`} download>
                                                            <Download className="h-4 w-4"/>
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground"/>
                                <span className="font-medium">
                                    {profile.work.company}
                                </span>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                            >
                                <Link href="/alternance">
                                    Projets
                                    <BriefcaseBusiness className="ml-1 h-3 w-3"/>
                                </Link>
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {profile.work.role}
                        </p>
                    </div>
                    <div className="border-t pt-3 space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Front-End</span>
                            <span className="font-medium">
                                {stats?.frontend || "8 ans"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Back-End</span>
                            <span className="font-medium">
                                {stats?.backend || "5 ans"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* GitHub + Expérience */}
            <Card className="card-hover">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Github className="h-4 w-4 text-primary"/>
                        GitHub
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <a
                        href="https://github.com/20syldev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium hover:text-primary"
                    >
                        @20syldev
                    </a>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Aujourd'hui</span>
                            <span className="font-medium">{stats?.today || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Ce mois</span>
                            <span className="font-medium">{stats?.this_month || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">L'an dernier</span>
                            <span className="font-medium">{stats?.last_year || "—"}</span>
                        </div>
                    </div>
                    <div className="border-t pt-3 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                            <GitPullRequest className="h-3 w-3"/>
                            <span>Contributions importantes</span>
                        </div>
                        {contributions.map((pr) => (
                            <a
                                key={pr.url}
                                href={pr.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block truncate hover:text-primary"
                            >
                                <span className="text-muted-foreground">{pr.repo}:</span> {pr.title}
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="card-hover flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Award className="h-4 w-4 text-primary"/>
                        Certifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center">
                    <TooltipProvider>
                        <div className="grid grid-cols-4 gap-2 place-items-center w-full">
                            {badges.map((badge) => (
                                <Tooltip key={badge.name}>
                                    <TooltipTrigger asChild>
                                        <a
                                            href={badge.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Image
                                                src={`/icons/${badge.icon}.svg`}
                                                alt={badge.name}
                                                width={44}
                                                height={44}
                                            />
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{badge.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </TooltipProvider>
                </CardContent>
            </Card>
        </div>
    );
}