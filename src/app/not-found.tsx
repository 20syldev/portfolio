import { ArrowRight, BookOpen, GraduationCap, Home, LayoutList } from "lucide-react";
import Link from "next/link";

import { Lost } from "@/components/sections/lost";

const shortcuts = [
    {
        href: "/",
        icon: Home,
        title: "Accueil",
        description: "Présentation, projets mis en avant et contact.",
    },
    {
        href: "/repositories",
        icon: LayoutList,
        title: "Projets",
        description: "Tous mes projets, avec leur documentation.",
    },
    {
        href: "/help",
        icon: BookOpen,
        title: "Documentations",
        description: "Guides sur Linux, le réseau, la sécurité et les outils.",
    },
    {
        href: "/parcours",
        icon: GraduationCap,
        title: "Parcours",
        description: "Formation, alternance et expériences.",
    },
];

/**
 * Global 404 page displayed when a route is not found.
 * A faded 404 sits behind the title, a search box starts from the address that was asked for,
 * and the main sections are one click away.
 *
 * @returns The rendered 404 page
 */
export default function NotFound() {
    return (
        <main className="relative isolate flex min-h-screen justify-center overflow-hidden px-4 pt-24 pb-12 animate-fade-in">
            <span
                aria-hidden
                className="pointer-events-none absolute top-8 left-1/2 -z-10 -translate-x-1/2 text-[min(24rem,50vw)] leading-none font-bold tracking-tighter whitespace-nowrap text-foreground/[0.06] select-none [mask-image:linear-gradient(#000_40%,transparent_88%)]"
            >
                404
            </span>
            <div className="flex w-full max-w-2xl flex-col items-center">
                <h1 className="mt-[clamp(5rem,21vw,10.5rem)] text-center text-[clamp(1.9rem,6vw,2.6rem)] font-semibold tracking-tight">
                    Page non trouvée
                </h1>
                <Lost />
                <section aria-labelledby="lost-over" className="mt-8 w-full text-left">
                    <h2 id="lost-over" className="text-sm/[1.3] font-medium text-muted-foreground">
                        Ou allez directement à
                    </h2>
                    <ul className="mt-2.5 border-b border-border">
                        {shortcuts.map(({ href, icon: Icon, title, description }) => (
                            <li key={href} className="border-t border-border">
                                <Link
                                    href={href}
                                    target="_top"
                                    className="group -mx-3 grid min-h-16 grid-cols-[1.25rem_minmax(0,1fr)_1rem] items-center gap-x-4 rounded-xl px-3 py-1.5 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                                >
                                    <Icon aria-hidden className="size-5 text-muted-foreground" />
                                    <span>
                                        <b className="block text-[17px]/[1.35] font-medium">
                                            {title}
                                        </b>
                                        <span className="mt-px block text-[15px]/normal text-muted-foreground">
                                            {description}
                                        </span>
                                    </span>
                                    <ArrowRight
                                        aria-hidden
                                        className="size-4 text-muted-foreground group-hover:text-foreground"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}
