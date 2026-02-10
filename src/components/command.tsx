"use client";

import {
    Archive,
    Briefcase,
    FilePenLine,
    FileText,
    FolderOpen,
    Home,
    LayoutList,
    Monitor,
    Moon,
    MousePointer,
    Newspaper,
    RefreshCw,
    Search,
    Sparkles,
    Sun,
    UserRound,
    Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { ContactDialog } from "@/components/contact";
import { useCursor } from "@/components/cursor";
import { Button } from "@/components/ui/button";
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
import { usePdfViewer } from "@/components/viewer";
import { projects as alternanceProjects } from "@/data/alternance";
import { projects } from "@/data/projects";
import { veilles } from "@/data/veille";
import { useApi } from "@/hooks/api";
import { useProjectDetail } from "@/hooks/detail";

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

/**
 * Context for sharing command dialog state
 */
const CommandContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
} | null>(null);

/**
 * Hook to access command dialog state
 */
export function useCommand() {
    const context = React.useContext(CommandContext);
    if (!context) {
        throw new Error("useCommand must be used within a CommandProvider");
    }
    return context;
}

/**
 * Provider for command dialog state
 */
export function CommandProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);

    const setOpenWrapper = React.useCallback((value: boolean | ((prev: boolean) => boolean)) => {
        if (typeof value === "function") {
            setOpen(value);
        } else {
            setOpen(value);
        }
    }, []);

    return (
        <CommandContext.Provider value={{ open, setOpen: setOpenWrapper }}>
            {children}
        </CommandContext.Provider>
    );
}

/**
 * Search button that opens the command dialog
 */
export function SearchButton() {
    const { setOpen } = useCommand();

    return (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="h-9 w-9">
            <Search className="h-4 w-4" />
        </Button>
    );
}

/**
 * Command menu dialog accessible via Ctrl+K / Cmd+K.
 * Enables quick navigation, project access, external links and theme switching.
 *
 * @returns The rendered command dialog
 */
export function CommandMenu() {
    const { open, setOpen } = useCommand();
    const [search, setSearch] = React.useState("");
    const [contactOpen, setContactOpen] = React.useState(false);
    const router = useRouter();
    const { setTheme } = useTheme();
    const { enabled: cursorEnabled, setEnabled: setCursorEnabled } = useCursor();
    const { newProjects, updatedProjects, patchedProjects } = useApi();
    const { openProject } = useProjectDetail();
    const { openPdf } = usePdfViewer();

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
                setOpen((prevOpen) => !prevOpen);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [setOpen]);

    const runCommand = React.useCallback(
        (command: () => void) => {
            setOpen(false);
            command();
        },
        [setOpen]
    );

    return (
        <>
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
                            onSelect={() =>
                                runCommand(() =>
                                    openPdf(
                                        "/E5 - Tableau Synthèse - Sylvain L.pdf",
                                        "Tableau de synthèse E5"
                                    )
                                )
                            }
                        >
                            <FilePenLine className="mr-2 h-4 w-4" />
                            Tableau de synthèse E5
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => openPdf("/CV.pdf", "CV"))}>
                            <FileText className="mr-2 h-4 w-4" />
                            CV
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setContactOpen(true))}>
                            <UserRound className="mr-2 h-4 w-4" />À propos de moi
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
                                    value="veilles technologiques node.js typescript radix next.js vue.js"
                                    onSelect={() => runCommand(() => router.push("/veilles/"))}
                                >
                                    <Newspaper className="mr-2 h-4 w-4" />
                                    Veilles technologiques
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        Node.js
                                    </span>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator />
                            <CommandGroup heading="Toutes les veilles">
                                {veilles.map((veille) => (
                                    <CommandItem
                                        key={veille.id}
                                        value={`${veille.title} ${veille.description} ${veille.keywords?.join(" ") || ""} veille veilles technologique technologiques`}
                                        onSelect={() =>
                                            runCommand(() => router.push(`/veilles/#${veille.id}`))
                                        }
                                    >
                                        <Newspaper className="mr-2 h-4 w-4" />
                                        {veille.title}
                                        <span className="ml-2 text-xs text-muted-foreground truncate">
                                            {veille.keywords?.slice(0, 3).join(", ") || ""}
                                        </span>
                                    </CommandItem>
                                ))}
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

                    <CommandGroup heading="Curseur">
                        <CommandItem
                            onSelect={() => runCommand(() => setCursorEnabled(!cursorEnabled))}
                        >
                            <MousePointer className="mr-2 h-4 w-4" />
                            {cursorEnabled ? "Désactiver" : "Activer"} le curseur personnalisé
                        </CommandItem>
                    </CommandGroup>

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
            <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
        </>
    );
}