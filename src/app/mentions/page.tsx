"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ContactLink } from "@/components/dialogs/contact";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Legal notices page.
 *
 * @returns The rendered legal notices page
 */
export default function MentionsLegales() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="flex-1 container mx-auto max-w-3xl px-4 pt-24 pb-12">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/confidentialite">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors gap-1.5"
                        >
                            <ShieldCheck className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Mentions légales</h1>
                </div>

                <div className="space-y-8">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Éditeur du site</h2>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Nom : Lambert Sylvain</p>
                            <p>
                                Email : <ContactLink>{profile.links.email}</ContactLink>
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Hébergeur</h2>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Nom : GitHub Pages</p>
                            <p>
                                Adresse :{" "}
                                <a
                                    href="https://github.com"
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    https://github.com
                                </a>
                            </p>
                            <p>
                                Contact :{" "}
                                <a
                                    href="https://support.github.com"
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    https://support.github.com
                                </a>
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Nom de domaine</h2>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Registrar : Namecheap, Inc.</p>
                            <p>
                                Domaine principal :{" "}
                                <a
                                    href="https://sylvain.pro"
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    sylvain.pro
                                </a>
                            </p>
                            <p>
                                Domaine raccourci :{" "}
                                <a
                                    href="https://sylv.pro"
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    sylv.pro
                                </a>{" "}
                                (redirection vers sylvain.pro)
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
                        <p className="text-sm text-muted-foreground">
                            L'ensemble du contenu de ce site (textes, images, code source, design)
                            est la propriété exclusive de son éditeur, sauf mention contraire. Toute
                            reproduction, représentation ou diffusion, en tout ou partie, du contenu
                            de ce site sans autorisation préalable est interdite.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Responsabilité</h2>
                        <p className="text-sm text-muted-foreground">
                            L'éditeur s'efforce de fournir des informations aussi précises que
                            possible. Toutefois, il ne pourra être tenu responsable des omissions,
                            des inexactitudes ou des carences dans la mise à jour de ces
                            informations. L'éditeur décline toute responsabilité en cas de
                            difficultés techniques rencontrées lors de la connexion au site.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Contact</h2>
                        <p className="text-sm text-muted-foreground">
                            Pour toute question relative aux mentions légales, vous pouvez me
                            contacter à l'adresse : <ContactLink>{profile.links.email}</ContactLink>
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}