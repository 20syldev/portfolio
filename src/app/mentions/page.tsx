"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

export default function MentionsLegales() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="container mx-auto max-w-3xl px-4 pt-24 pb-12">
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
                                Email :{" "}
                                <a
                                    href={`mailto:${profile.links.email}`}
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    {profile.links.email}
                                </a>
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Hébergeur</h2>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Nom : GitHub Pages</p>
                            <p>Adresse : https://github.com</p>
                            <p>Contact : https://support.github.com</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Nom de domaine</h2>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Registrar : Namecheap, Inc.</p>
                            <p>Domaine principal : sylvain.pro</p>
                            <p>Domaine raccourci : sylv.pro (redirection vers sylvain.pro)</p>
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
                            contacter à l'adresse :{" "}
                            <a
                                href={`mailto:${profile.links.email}`}
                                className="underline hover:text-foreground transition-colors"
                            >
                                {profile.links.email}
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}