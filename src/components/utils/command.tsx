"use client";

import {
    Award,
    BadgeCheck,
    BookOpen,
    Briefcase,
    ChartBar,
    FilePenLine,
    FileText,
    FolderOpen,
    Home,
    Keyboard,
    LayoutList,
    Monitor,
    Moon,
    MousePointer2,
    Newspaper,
    RefreshCw,
    Search,
    Smile,
    Sparkles,
    Sun,
    Trophy,
    Type,
    UserRound,
    Wrench,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import ReactDOM from "react-dom";

import { ContactDialog } from "@/components/dialogs/contact";
import { ShortcutsDialog } from "@/components/dialogs/shortcuts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useCursor } from "@/components/utils/cursor";
import { useFont } from "@/components/utils/font";
import { useMotion } from "@/components/utils/motion";
import { useViewer } from "@/components/utils/viewer";
import { useXray } from "@/components/utils/xray";
import { projects as alternanceProjects } from "@/data/alternance";
import { docs } from "@/data/docs";
import { projects } from "@/data/projects";
import { formatShortcut, getShortcut } from "@/data/shortcuts";
import { veilles } from "@/data/veille";
import { type ProjectStatus, useStatus } from "@/hooks/status";
import { getCategoryName } from "@/lib/docs";
import { cn } from "@/lib/utils";

const statusIcon: Record<Exclude<ProjectStatus, null>, React.ElementType> = {
    new: Sparkles,
    updated: RefreshCw,
    patched: Wrench,
};

type CommandItemConfig = {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    value?: string;
    keywords?: string[];
    shortcut?: string;
};

/**
 * Normalize a string for accent-insensitive comparison.
 * Strips diacritics and lowercases.
 */
function normalize(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

/**
 * Custom filter for the command palette.
 * Prioritizes exact matches on value (name/title) over keyword matches.
 *
 * @param value - The item value (name/title) to match against
 * @param search - The current search query
 * @param keywords - Optional additional keywords for the item
 * @returns Score between 0 (no match) and 1 (exact match)
 */
function commandFilter(value: string, search: string, keywords?: string[]): number {
    const v = normalize(value);
    const s = normalize(search);

    if (!s) return 1;

    // Exact match on value
    if (v === s) return 1;

    // Value starts with search
    if (v.startsWith(s)) return 0.9;

    // Any word in value starts with search
    const valueWords = v.split(/\s+/);
    if (valueWords.some((word) => word.startsWith(s))) return 0.85;

    // Value contains search as substring
    if (v.includes(s)) return 0.75;

    // Check keywords
    if (keywords && keywords.length > 0) {
        const kw = keywords.map(normalize).join(" ");
        if (kw.includes(s)) return 0.5;
    }

    return 0;
}

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
/**
 * Tooltip card shown on hover for command items with rich data.
 *
 * @param props - Tooltip content props
 * @param props.title - Item title
 * @param props.description - Item description
 * @param props.tags - Optional tag list
 * @returns The rendered tooltip content
 */
type HoverPreview = {
    title: string;
    description?: string;
    tags?: string[];
    rect: DOMRect;
} | null;

function CommandPreviewCard({ preview }: { preview: HoverPreview }) {
    if (!preview) return null;

    const { title, description, tags, rect } = preview;

    return ReactDOM.createPortal(
        <div
            className="fixed z-[200] p-0 bg-background text-foreground border rounded-xl shadow-xl w-[220px] animate-in fade-in-0 zoom-in-95 duration-150 hidden md:block"
            style={{
                top: rect.top,
                left: rect.right + 8,
            }}
        >
            <div className="flex flex-col gap-2 p-4">
                <p className="font-medium text-sm leading-tight">{title}</p>
                {description && (
                    <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>
                )}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px] py-0">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

export function CommandMenu() {
    const { open, setOpen } = useCommand();
    const [search, setSearch] = React.useState("");
    const [contactOpen, setContactOpen] = React.useState(false);
    const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const [hoverPreview, setHoverPreview] = React.useState<HoverPreview>(null);
    const scrollReadyRef = React.useRef(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { enabled: cursorEnabled, setEnabled: setCursorEnabled } = useCursor();
    const { dialogOpen: fontDialogOpen, setDialogOpen: setFontDialogOpen } = useFont();
    const { enabled: motionEnabled, setEnabled: setMotionEnabled } = useMotion();
    const { enabled: xrayEnabled, setEnabled: setXrayEnabled } = useXray();
    const { openPdf } = useViewer();
    const getProjectStatus = useStatus();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prevOpen) => !prevOpen);
                return;
            }
            if (e.altKey) {
                switch (e.key) {
                    case "/":
                    case ":":
                        e.preventDefault();
                        setShortcutsOpen((prev) => !prev);
                        break;
                    case "c":
                        e.preventDefault();
                        setCursorEnabled(!cursorEnabled);
                        break;
                    case "p":
                        e.preventDefault();
                        setFontDialogOpen(!fontDialogOpen);
                        break;
                    case "t":
                        e.preventDefault();
                        setTheme(
                            theme === "system" ? "light" : theme === "light" ? "dark" : "system"
                        );
                        break;
                    case "m":
                        e.preventDefault();
                        setMotionEnabled(!motionEnabled);
                        break;
                    case "x":
                        e.preventDefault();
                        setXrayEnabled(!xrayEnabled);
                        break;
                }
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [
        setOpen,
        cursorEnabled,
        setCursorEnabled,
        fontDialogOpen,
        setFontDialogOpen,
        motionEnabled,
        setMotionEnabled,
        theme,
        setTheme,
        xrayEnabled,
        setXrayEnabled,
    ]);

    /**
     * Manages scroll readiness to ignore cmdk's initial scrollIntoView calls.
     * Enables scroll detection after a short delay once the dialog opens.
     */
    React.useEffect(() => {
        if (!open) {
            setScrolled(false);
            scrollReadyRef.current = false;
            return;
        }
        const timer = setTimeout(() => {
            scrollReadyRef.current = true;
        }, 150);
        return () => {
            clearTimeout(timer);
            scrollReadyRef.current = false;
        };
    }, [open]);

    const scroll = React.useCallback(() => {
        if (scrollReadyRef.current) {
            setScrolled(true);
            if ("ontouchstart" in window) {
                (document.activeElement as HTMLElement)?.blur();
            }
        }
    }, []);

    const runCommand = React.useCallback(
        (command: () => void) => {
            setOpen(false);
            command();
        },
        [setOpen]
    );

    const navigationItems: CommandItemConfig[] = [
        { label: "Accueil", icon: Home, action: () => router.push("/") },
        { label: "Tous les projets", icon: LayoutList, action: () => router.push("/repositories") },
        { label: "Documentations", icon: BookOpen, action: () => router.push("/help") },
        { label: "Mes technologies", icon: Wrench, action: () => router.push("/tech") },
        {
            label: "Statistiques",
            icon: ChartBar,
            action: () => router.push("/stats"),
            keywords: ["stats", "statistiques", "métriques", "projets", "certifications"],
        },
    ];

    const profilItems: CommandItemConfig[] = [
        { label: "À propos de moi", icon: UserRound, action: () => setContactOpen(true) },
        {
            label: "Tableau de synthèse E5",
            icon: FilePenLine,
            action: () =>
                openPdf("/E5 - Tableau Synthèse - Sylvain L.pdf", "Tableau de synthèse E5"),
        },
        { label: "CV", icon: FileText, action: () => openPdf("/CV.pdf", "CV") },
    ];

    const shortcutsCommandItem = (
        <CommandItem
            key="shortcuts"
            value="Raccourcis clavier Actions"
            onSelect={() => runCommand(() => setShortcutsOpen(true))}
        >
            <Keyboard className="mr-2 h-4 w-4 max-md:hidden" />
            <Zap className="mr-2 h-4 w-4 md:hidden" />
            <span className="max-md:hidden">Raccourcis clavier</span>
            <span className="md:hidden">Actions</span>
            <CommandShortcut>{formatShortcut(getShortcut("shortcuts")!.keys)}</CommandShortcut>
        </CommandItem>
    );

    const themeShortcut = formatShortcut(getShortcut("theme")!.keys);

    const personnalisationItems: CommandItemConfig[] = [
        {
            label: `${cursorEnabled ? "Désactiver" : "Activer"} le curseur personnalisé`,
            icon: MousePointer2,
            action: () => setCursorEnabled(!cursorEnabled),
            shortcut: formatShortcut(getShortcut("cursor")!.keys),
        },
        {
            label: `${motionEnabled ? "Désactiver" : "Activer"} les animations`,
            icon: Sparkles,
            action: () => setMotionEnabled(!motionEnabled),
            keywords: ["animation", "motion", "mouvement", "effet"],
            shortcut: formatShortcut(getShortcut("motion")!.keys),
        },
        {
            label: "Changer la police",
            icon: Type,
            action: () => setFontDialogOpen(true),
            value: "Changer la police",
            keywords: ["font", "police", "typographie", "écriture"],
            shortcut: formatShortcut(getShortcut("font")!.keys),
        },
        ...(theme !== "light"
            ? [
                  {
                      label: "Thème clair",
                      icon: Sun,
                      action: () => setTheme("light"),
                      shortcut: themeShortcut,
                  },
              ]
            : []),
        ...(theme !== "dark"
            ? [
                  {
                      label: "Thème sombre",
                      icon: Moon,
                      action: () => setTheme("dark"),
                      shortcut: themeShortcut,
                  },
              ]
            : []),
        ...(theme !== "system"
            ? [
                  {
                      label: "Thème système",
                      icon: Monitor,
                      action: () => setTheme("system"),
                      shortcut: themeShortcut,
                  },
              ]
            : []),
    ];

    const realisationsItems: CommandItemConfig[] = [
        {
            label: "Certifications",
            icon: Award,
            action: () => router.push("/certifications"),
            keywords: ["google", "cisco", "netacad", "credly", "certification"],
        },
        {
            label: "Badges",
            icon: BadgeCheck,
            action: () => router.push("/badges"),
            keywords: ["google", "developer", "badge", "machine learning", "communauté"],
        },
        {
            label: "Completion",
            icon: Trophy,
            action: () => router.push("/completion"),
            keywords: ["google", "cloud", "skills", "boost", "ai", "workspace"],
        },
    ];

    const renderItems = (items: CommandItemConfig[]) =>
        items.map((item) => (
            <CommandItem
                key={item.label}
                value={item.value}
                keywords={item.keywords}
                onSelect={() => runCommand(item.action)}
            >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
        ));

    // Max projects to balance the scrolled two-column layout
    const maxRecentProjects =
        personnalisationItems.length +
        profilItems.length +
        realisationsItems.length -
        navigationItems.length +
        1;

    const statusProjects = projects.filter((p) => getProjectStatus(p.id) !== null);
    const fillerProjects = projects
        .filter((p) => getProjectStatus(p.id) === null)
        .slice(0, maxRecentProjects - statusProjects.length);

    const handleHover = (
        e: React.MouseEvent,
        data: { title: string; description?: string; tags?: string[] }
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverPreview({ ...data, rect });
    };

    const clearHover = () => setHoverPreview(null);

    const recentProjectItems = [...statusProjects, ...fillerProjects]
        .slice(0, maxRecentProjects)
        .map((project) => {
            const status = getProjectStatus(project.id);
            const Icon = status ? statusIcon[status] : FolderOpen;
            return (
                <CommandItem
                    key={project.id}
                    value={project.name}
                    keywords={[project.description, ...project.tags]}
                    onSelect={() => runCommand(() => router.push(`/projet/${project.id}`))}
                    onMouseEnter={(e) =>
                        handleHover(e, {
                            title: project.name,
                            description: project.longDescription || project.description,
                            tags: project.tags,
                        })
                    }
                    onMouseLeave={clearHover}
                >
                    <Icon className="mr-2 h-4 w-4" />
                    {project.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                        {project.tags.join(", ")}
                    </span>
                </CommandItem>
            );
        });

    const pageItems = (
        <>
            <CommandItem
                value="Alternance"
                keywords={["zenetys", "développement", "web"]}
                onSelect={() => runCommand(() => router.push("/alternance/"))}
            >
                <Briefcase className="mr-2 h-4 w-4" />
                Alternance
                <span className="ml-2 text-xs text-muted-foreground">Zenetys</span>
            </CommandItem>
            <CommandItem
                value="Veilles technologiques"
                keywords={["node.js", "typescript", "radix", "next.js", "vue.js"]}
                onSelect={() => runCommand(() => router.push("/veilles/"))}
            >
                <Newspaper className="mr-2 h-4 w-4" />
                Veilles technologiques
                <span className="ml-2 text-xs text-muted-foreground">Node.js</span>
            </CommandItem>
        </>
    );

    const docItems = docs.map((doc) => (
        <CommandItem
            key={doc.id}
            value={doc.title}
            keywords={[doc.description, doc.category, "documentation", "aide", "help", "guide"]}
            onSelect={() => runCommand(() => router.push(`/help/${doc.category}/${doc.slug}`))}
            onMouseEnter={(e) =>
                handleHover(e, {
                    title: doc.title,
                    description: doc.description,
                    tags: [getCategoryName(doc.category)],
                })
            }
            onMouseLeave={clearHover}
        >
            <FileText className="mr-2 h-4 w-4" />
            {doc.title}
            <span className="ml-2 text-xs text-muted-foreground truncate">
                {getCategoryName(doc.category)}
            </span>
        </CommandItem>
    ));

    const veilleItems = veilles.map((veille) => (
        <CommandItem
            key={veille.id}
            value={veille.title}
            keywords={[
                veille.description,
                ...(veille.keywords || []),
                "veille",
                "veilles",
                "technologique",
                "technologiques",
            ]}
            onSelect={() => runCommand(() => router.push(`/veilles/#${veille.id}`))}
            onMouseEnter={(e) =>
                handleHover(e, {
                    title: veille.title,
                    description: veille.description,
                    tags: veille.keywords,
                })
            }
            onMouseLeave={clearHover}
        >
            <Newspaper className="mr-2 h-4 w-4" />
            {veille.title}
            <span className="ml-2 text-xs text-muted-foreground truncate">
                {veille.keywords?.slice(0, 3).join(", ") || ""}
            </span>
        </CommandItem>
    ));

    const remainingProjectItems = projects
        .filter((p) => getProjectStatus(p.id) === null)
        .map((project) => (
            <CommandItem
                key={project.id}
                value={project.name}
                keywords={[project.description, ...project.tags]}
                onSelect={() => runCommand(() => router.push(`/projet/${project.id}`))}
                onMouseEnter={(e) =>
                    handleHover(e, {
                        title: project.name,
                        description: project.longDescription || project.description,
                        tags: project.tags,
                    })
                }
                onMouseLeave={clearHover}
            >
                <FolderOpen className="mr-2 h-4 w-4" />
                {project.name}
                <span className="ml-2 text-xs text-muted-foreground truncate">
                    {project.tags.slice(0, 3).join(", ")}
                </span>
            </CommandItem>
        ));

    const alternanceItems = alternanceProjects.map((project) => (
        <CommandItem
            key={project.id}
            value={project.title}
            keywords={[project.description, ...project.technologies]}
            onSelect={() => runCommand(() => router.push(`/alternance/#${project.id}`))}
            onMouseEnter={(e) =>
                handleHover(e, {
                    title: project.title,
                    description: project.description,
                    tags: project.technologies,
                })
            }
            onMouseLeave={clearHover}
        >
            <Briefcase className="mr-2 h-4 w-4" />
            {project.title}
            <span className="ml-2 text-xs text-muted-foreground truncate">
                {project.technologies.slice(0, 3).join(", ")}
            </span>
        </CommandItem>
    ));

    return (
        <>
            <CommandDialog
                open={open}
                onOpenChange={(value: boolean) => {
                    setOpen(value);
                    if (!value) {
                        setSearch("");
                        setHoverPreview(null);
                    }
                }}
                filter={commandFilter}
                className={cn(
                    "transition-all duration-300",
                    scrolled && "md:max-w-[calc(100%-6rem)] lg:max-w-4xl"
                )}
            >
                <CommandInput
                    placeholder="Rechercher..."
                    value={search}
                    onValueChange={setSearch}
                />
                <CommandList
                    onScroll={scroll}
                    className={cn("transition-all duration-300", scrolled && "!max-h-[500px]")}
                >
                    <CommandEmpty>
                        {normalize(search).includes("sylvain") ? (
                            <span className="flex items-center justify-center gap-2">
                                <Smile className="h-4 w-4" />
                                Salut !
                            </span>
                        ) : (
                            "Aucun résultat."
                        )}
                    </CommandEmpty>

                    {search.length > 0 ? (
                        <CommandGroup>
                            {renderItems(navigationItems)}
                            {shortcutsCommandItem}
                            {renderItems(personnalisationItems)}
                            {renderItems(profilItems)}
                            {renderItems(realisationsItems)}
                            {recentProjectItems}
                            {pageItems}
                            {docItems}
                            {veilleItems}
                            {remainingProjectItems}
                            {alternanceItems}
                        </CommandGroup>
                    ) : (
                        <>
                            {scrolled ? (
                                <div className="hidden md:flex md:gap-2 md:p-2">
                                    <div className="flex-1 space-y-2">
                                        <div className="rounded-lg border">
                                            <CommandGroup heading="Navigation">
                                                {renderItems(navigationItems)}
                                            </CommandGroup>
                                        </div>
                                        <div className="rounded-lg border">
                                            <CommandGroup heading="Projets mis en avant">
                                                {recentProjectItems}
                                                <CommandItem
                                                    onSelect={() =>
                                                        runCommand(() =>
                                                            router.push("/repositories")
                                                        )
                                                    }
                                                >
                                                    <FolderOpen className="mr-2 h-4 w-4" />
                                                    Voir tout
                                                </CommandItem>
                                            </CommandGroup>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="rounded-lg border">
                                            <CommandGroup heading="Personnalisation">
                                                {shortcutsCommandItem}
                                                {renderItems(personnalisationItems)}
                                            </CommandGroup>
                                        </div>
                                        <div className="rounded-lg border">
                                            <CommandGroup heading="Profil">
                                                {renderItems(profilItems)}
                                            </CommandGroup>
                                        </div>
                                        <div className="rounded-lg border">
                                            <CommandGroup heading="Réalisations">
                                                {renderItems(realisationsItems)}
                                            </CommandGroup>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            <div className={cn(scrolled && "md:hidden")}>
                                <CommandGroup heading="Navigation">
                                    {renderItems(navigationItems)}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Projets mis en avant">
                                    {recentProjectItems}
                                    <CommandItem
                                        onSelect={() =>
                                            runCommand(() => router.push("/repositories"))
                                        }
                                    >
                                        <FolderOpen className="mr-2 h-4 w-4" />
                                        Voir tout
                                    </CommandItem>
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Personnalisation">
                                    {shortcutsCommandItem}
                                    {renderItems(personnalisationItems)}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Profil">
                                    {renderItems(profilItems)}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Réalisations">
                                    {renderItems(realisationsItems)}
                                </CommandGroup>
                            </div>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
            <CommandPreviewCard preview={hoverPreview} />
            <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
            <ShortcutsDialog
                open={shortcutsOpen}
                onOpenChange={setShortcutsOpen}
                actions={{
                    cursor: () => setCursorEnabled(!cursorEnabled),
                    font: () => setFontDialogOpen(true),
                    theme: () =>
                        setTheme(
                            theme === "system" ? "light" : theme === "light" ? "dark" : "system"
                        ),
                    motion: () => setMotionEnabled(!motionEnabled),
                    xray: () => setXrayEnabled(!xrayEnabled),
                    command: () => setOpen(true),
                }}
            />
        </>
    );
}