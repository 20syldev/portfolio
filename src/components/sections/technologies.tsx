"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDragScroll } from "@/hooks/scroll";

/** Icons that need to be inverted in dark mode (black icons) */
const darkInvertIcons = [
    "Rust",
    "Bash",
    "Next.js",
    "VitePress",
    "GitHub",
    "Adobe",
    "Cinema 4D",
    "Markdown",
];

/** Icons that need invert + hue-rotate to preserve colors (black + colored) */
const darkInvertHueIcons = ["YAML"];

/** Technologies organized by category */
const techCategories = [
    {
        name: "Langages",
        items: [
            { name: "HTML", icon: "/icons/tech/html.svg" },
            { name: "CSS", icon: "/icons/tech/css.svg" },
            { name: "JavaScript", icon: "/icons/tech/javascript.svg" },
            { name: "TypeScript", icon: "/icons/tech/typescript.svg" },
            { name: "PHP", icon: "/icons/tech/php.svg" },
            { name: "Python", icon: "/icons/tech/python.svg" },
            { name: "Java", icon: "/icons/tech/java.svg" },
            { name: "C", icon: "/icons/tech/c.svg" },
            { name: "C++", icon: "/icons/tech/cplusplus.svg" },
            { name: "C#", icon: "/icons/tech/csharp.svg" },
            { name: "Go", icon: "/icons/tech/go.svg" },
            { name: "Rust", icon: "/icons/tech/rust.svg" },
            { name: "Bash", icon: "/icons/tech/bash.svg" },
            { name: "Ruby", icon: "/icons/tech/ruby.svg" },
            { name: "Swift", icon: "/icons/tech/swift.svg" },
            { name: "Kotlin", icon: "/icons/tech/kotlin.svg" },
            { name: "Dart", icon: "/icons/tech/dart.svg" },
            { name: "Perl", icon: "/icons/tech/perl.svg" },
        ],
    },
    {
        name: "Frameworks",
        items: [
            { name: "React", icon: "/icons/tech/react.svg" },
            { name: "Next.js", icon: "/icons/tech/nextjs.svg" },
            { name: "Node.js", icon: "/icons/tech/nodejs.svg" },
            { name: "Tailwind CSS", icon: "/icons/tech/tailwindcss.svg" },
            { name: "Bootstrap", icon: "/icons/tech/bootstrap.svg" },
            { name: "Vue.js", icon: "/icons/tech/vuejs.svg" },
            { name: "Flutter", icon: "/icons/tech/flutter.svg" },
            { name: "Vite.js", icon: "/icons/tech/vitejs.svg" },
            { name: "jQuery", icon: "/icons/tech/jquery.svg" },
            { name: "React Native", icon: "/icons/tech/reactnative.svg" },
            { name: "Vuetify", icon: "/icons/tech/vuetify.svg" },
            { name: "VitePress", icon: "/icons/tech/vitepress.svg" },
        ],
    },
    {
        name: "Bases de données",
        items: [
            { name: "MongoDB", icon: "/icons/tech/mongodb.svg" },
            { name: "PostgreSQL", icon: "/icons/tech/postgresql.svg" },
            { name: "MySQL", icon: "/icons/tech/mysql.svg" },
            { name: "SQLite", icon: "/icons/tech/sqlite.svg" },
            { name: "Firebase", icon: "/icons/tech/firebase.svg" },
            { name: "Elasticsearch", icon: "/icons/tech/elasticsearch.svg" },
        ],
    },
    {
        name: "Outils & IDE",
        items: [
            { name: "VS Code", icon: "/icons/tech/vscode.svg" },
            { name: "Vim", icon: "/icons/tech/vim.svg" },
            { name: "Android Studio", icon: "/icons/tech/androidstudio.svg" },
            { name: "npm", icon: "/icons/tech/npm.svg" },
            { name: "Nodemon", icon: "/icons/tech/nodemon.svg" },
            { name: "PostCSS", icon: "/icons/tech/postcss.svg" },
            { name: "tmux", icon: "/icons/tech/tmux.svg" },
        ],
    },
    {
        name: "Formats",
        items: [
            { name: "JSON", icon: "/icons/tech/json.svg" },
            { name: "YAML", icon: "/icons/tech/yaml.svg" },
            { name: "Markdown", icon: "/icons/tech/markdown.svg" },
        ],
    },
    {
        name: "Systèmes",
        items: [
            { name: "Linux", icon: "/icons/tech/linux.svg" },
            { name: "Linux Mint", icon: "/icons/tech/linuxmint.svg" },
            { name: "Fedora", icon: "/icons/tech/fedora.svg" },
            { name: "Windows", icon: "/icons/tech/windows.svg" },
            { name: "Raspberry Pi", icon: "/icons/tech/raspberrypi.svg" },
            { name: "Android", icon: "/icons/tech/android.svg" },
        ],
    },
    {
        name: "DevOps & Infra",
        items: [
            { name: "Git", icon: "/icons/tech/git.svg" },
            { name: "GitHub", icon: "/icons/tech/github.svg" },
            { name: "Docker", icon: "/icons/tech/docker.svg" },
            { name: "Nginx", icon: "/icons/tech/nginx.svg" },
            { name: "Apache", icon: "/icons/tech/apache.svg" },
            { name: "Kibana", icon: "/icons/tech/kibana.svg" },
        ],
    },
    {
        name: "Design & 3D",
        items: [
            { name: "Godot", icon: "/icons/tech/godot.svg" },
            { name: "Adobe", icon: "/icons/tech/adobe.svg" },
            { name: "Figma", icon: "/icons/tech/figma.svg" },
            { name: "Blender", icon: "/icons/tech/blender.svg" },
            { name: "Cinema 4D", icon: "/icons/tech/cinema4d.svg" },
        ],
    },
];

/**
 * Technologies section.
 * Displays all technologies organized by category with icons.
 * Mobile: carousel with one category at a time showing icons + names.
 * Desktop: grid layout with all categories visible.
 */
export function Technologies() {
    const [currentCategory, setCurrentCategory] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    useDragScroll(scrollRef);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current;
        const maxScroll = scrollWidth - offsetWidth;
        if (maxScroll <= 0) return;
        const scrollProgress = scrollLeft / maxScroll;
        const newIndex = Math.round(scrollProgress * (techCategories.length - 1));
        if (newIndex !== currentCategory && newIndex >= 0 && newIndex < techCategories.length) {
            setCurrentCategory(newIndex);
        }
    }, [currentCategory]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-center mb-6 lg:mb-8">Technologies</h2>

                {/* Mobile/Tablet: Carousel */}
                <div className="lg:hidden flex flex-col">
                    <div
                        ref={scrollRef}
                        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide -mx-4 px-4"
                    >
                        {techCategories.map((category) => (
                            <div
                                key={category.name}
                                className="flex-shrink-0 w-full snap-center px-2"
                            >
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                                    {category.name}
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {category.items.map((tech) => (
                                        <div
                                            key={tech.name}
                                            className="flex flex-col items-center gap-1.5 p-2 rounded-lg"
                                        >
                                            <Image
                                                src={tech.icon}
                                                alt={tech.name}
                                                width={36}
                                                height={36}
                                                className={
                                                    darkInvertIcons.includes(tech.name)
                                                        ? "dark:invert"
                                                        : darkInvertHueIcons.includes(tech.name)
                                                          ? "invert-hue"
                                                          : ""
                                                }
                                            />
                                            <span className="text-xs text-muted-foreground text-center leading-tight">
                                                {tech.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-1.5 mt-4">
                        {techCategories.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    scrollRef.current?.scrollTo({
                                        left: index * (scrollRef.current?.offsetWidth || 0),
                                        behavior: "smooth",
                                    });
                                }}
                                className={`h-1.5 rounded-full transition-all ${
                                    currentCategory === index
                                        ? "w-4 bg-primary"
                                        : "w-1.5 bg-muted-foreground/30"
                                }`}
                                aria-label={`Catégorie ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: Grid of 8 blocks */}
                <TooltipProvider>
                    <div className="hidden lg:block lg:columns-4 gap-4">
                        {techCategories.map((category) => (
                            <div
                                key={category.name}
                                className="bg-muted/30 rounded-xl p-4 border border-border/50 break-inside-avoid mb-4"
                            >
                                <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
                                    {category.name}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-1.5">
                                    {category.items.map((tech) => (
                                        <Tooltip key={tech.name}>
                                            <TooltipTrigger asChild>
                                                <div className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                                    <Image
                                                        src={tech.icon}
                                                        alt={tech.name}
                                                        width={24}
                                                        height={24}
                                                        className={`w-6 h-6 ${darkInvertIcons.includes(tech.name) ? "dark:invert" : darkInvertHueIcons.includes(tech.name) ? "invert-hue" : ""}`}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{tech.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TooltipProvider>
            </div>
        </div>
    );
}