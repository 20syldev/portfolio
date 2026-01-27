"use client";

import {
    Archive,
    Briefcase,
    FilePenLine,
    FileText,
    FolderOpen,
    Home,
    LayoutList,
    Mail,
    Monitor,
    Moon,
    Newspaper,
    RefreshCw,
    Search,
    Sparkles,
    Sun,
    Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { projects as alternanceProjects } from "@/data/alternance";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useApi } from "@/hooks/api";
import { useProjectDetail } from "@/hooks/detail";

/**
 * Command menu accessible via Ctrl+K / Cmd+K.
 * Enables quick navigation, project access, external links and theme switching.
 */
type ProjectStatus = "new" | "updated" | "patched" | null;

const statusIcon: Record<Exclude<ProjectStatus, null>, React.ElementType> = {
    new: Sparkles,
    updated: RefreshCw,
    patched: Wrench,
};

const statusLabel: Record<Exclude<ProjectStatus, null>, string> = {
    new: "Nouveau projet",
    updated: "Mis à jour récemment",
    patched: "Correctif récent",
};

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const router = useRouter();
    const { setTheme } = useTheme();
    const { newProjects, updatedProjects, patchedProjects } = useApi();
    const { openProject } = useProjectDetail();

    const getProjectStatus = (projectId: string): ProjectStatus => {
        if (newProjects.includes(projectId)) return "new";
        if (updatedProjects.includes(projectId)) return "updated";
        if (patchedProjects.includes(projectId)) return "patched";
        return null;
    };

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            {/* Search button in header */}
            <button
                onClick={() => setOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
                <Search className="h-4 w-4" />
            </button>

            <CommandDialog
                open={open}
                onOpenChange={(open) => {
                    setOpen(open);
                    if (!open) setSearch("");
                }}
            >
                <CommandInput
                    placeholder="Rechercher..."
                    value={search}
                    onValueChange={setSearch}
                />
                <CommandList>
                    <CommandEmpty>Aucun résultat.</CommandEmpty>

                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
                            <Home className="mr-2 h-4 w-4" />
                            Accueil
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/repositories"))}
                        >
                            <LayoutList className="mr-2 h-4 w-4" />
                            Tous les projets
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/legacy"))}>
                            <Archive className="mr-2 h-4 w-4" />
                            Version précédente
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Liens">
                        <CommandItem
                            onSelect={() => runCommand(() => window.open("/CV.pdf", "_blank"))}
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            CV
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() => {
                                    location.href = `mailto:${profile.links.email}`;
                                })
                            }
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            Contact
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() =>
                                    window.open("/E5 - Tableau Synthèse - Sylvain L.pdf", "_blank")
                                )
                            }
                        >
                            <FilePenLine className="mr-2 h-4 w-4" />
                            Tableau de sythèse E5
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Projets récents">
                        {projects
                            .filter((p) => getProjectStatus(p.id) !== null)
                            .map((project) => {
                                const status = getProjectStatus(project.id)!;
                                const Icon = statusIcon[status];
                                return (
                                    <CommandItem
                                        key={project.id}
                                        onSelect={() =>
                                            runCommand(() =>
                                                openProject(project.id, {
                                                    onClose: () => setOpen(true),
                                                })
                                            )
                                        }
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="mr-2 inline-flex">
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="left">
                                                {statusLabel[status]}
                                            </TooltipContent>
                                        </Tooltip>
                                        {project.name}
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            {project.tags.join(", ")}
                                        </span>
                                    </CommandItem>
                                );
                            })}
                    </CommandGroup>

                    {search.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="Pages">
                                <CommandItem
                                    value="alternance zenetys développement web"
                                    onSelect={() => runCommand(() => router.push("/alternance/"))}
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    Alternance
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        Zenetys
                                    </span>
                                </CommandItem>
                                <CommandItem
                                    value="veille technologique node.js javascript"
                                    onSelect={() => runCommand(() => router.push("/veille/"))}
                                >
                                    <Newspaper className="mr-2 h-4 w-4" />
                                    Veille technologique
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        Node.js
                                    </span>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator />
                            <CommandGroup heading="Tous les projets">
                                {projects
                                    .filter((p) => getProjectStatus(p.id) === null)
                                    .map((project) => (
                                        <CommandItem
                                            key={project.id}
                                            value={`${project.name} ${project.description} ${project.tags.join(" ")}`}
                                            onSelect={() =>
                                                runCommand(() =>
                                                    openProject(project.id, {
                                                        onClose: () => setOpen(true),
                                                    })
                                                )
                                            }
                                        >
                                            <FolderOpen className="mr-2 h-4 w-4" />
                                            {project.name}
                                            <span className="ml-2 text-xs text-muted-foreground truncate">
                                                {project.tags.slice(0, 3).join(", ")}
                                            </span>
                                        </CommandItem>
                                    ))}
                            </CommandGroup>

                            <CommandSeparator />
                            <CommandGroup heading="Projets d'alternance">
                                {alternanceProjects.map((project) => (
                                    <CommandItem
                                        key={project.id}
                                        value={`${project.title} ${project.description} ${project.technologies.join(" ")}`}
                                        onSelect={() =>
                                            runCommand(() =>
                                                router.push(`/alternance/#${project.id}`)
                                            )
                                        }
                                    >
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        {project.title}
                                        <span className="ml-2 text-xs text-muted-foreground truncate">
                                            {project.technologies.slice(0, 3).join(", ")}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}

                    <CommandSeparator />

                    <CommandGroup heading="Thème">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                            <Sun className="mr-2 h-4 w-4" />
                            Thème clair
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                            <Moon className="mr-2 h-4 w-4" />
                            Thème sombre
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                            <Monitor className="mr-2 h-4 w-4" />
                            Thème système
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}