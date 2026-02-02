"use client";

import { ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Privacy policy page.
 *
 * @returns The rendered privacy policy page
 */
export default function Confidentialite() {
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
                    <Link href="/mentions">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors gap-1.5"
                        >
                            <Scale className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Politique de confidentialité</h1>
                </div>

                <div className="space-y-8">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Données collectées</h2>
                        <p className="text-sm text-muted-foreground">
                            Ce site ne collecte aucune donnée personnelle. Aucun formulaire de
                            contact, aucun système d'inscription ou de connexion n'est présent sur
                            ce site.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Cookies et stockage local</h2>
                        <p className="text-sm text-muted-foreground">
                            Ce site n'utilise aucun cookie. Le seul mécanisme de stockage utilisé
                            est le <strong className="text-foreground">localStorage</strong> du
                            navigateur, uniquement pour sauvegarder votre préférence de thème
                            (clair, sombre ou système). Rien d'autre n'est stocké.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Services tiers</h2>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>
                                <strong className="text-foreground">Polices de caractères</strong> :
                                ce site utilise la police Google Fonts "Outfit", servie localement
                                par le framework Next.js. Aucune requête n'est envoyée aux serveurs
                                de Google lors de votre visite.
                            </p>
                            <p>
                                <strong className="text-foreground">API</strong> : ce site effectue
                                des appels vers{" "}
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                    <a
                                        href="https://api.sylvain.pro"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        api.sylvain.pro
                                    </a>
                                </code>
                                , un service hébergé sur le même domaine, pour afficher des
                                statistiques de projets. Aucune donnée personnelle n'est transmise
                                lors de ces appels.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Analytics et tracking</h2>
                        <p className="text-sm text-muted-foreground">
                            Ce site n'utilise aucun service d'analytics, de tracking ou de
                            publicité. Aucune donnée de navigation n'est collectée ou transmise à
                            des tiers.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Vos droits</h2>
                        <p className="text-sm text-muted-foreground">
                            Conformément au Règlement Général sur la Protection des Données (RGPD),
                            vous disposez d'un droit d'accès, de rectification, de suppression et de
                            portabilité de vos données. Étant donné qu'aucune donnée personnelle
                            n'est collectée par ce site, ces droits ne trouvent pas à s'appliquer
                            dans ce contexte.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Contact</h2>
                        <p className="text-sm text-muted-foreground">
                            Pour toute question relative à la politique de confidentialité, vous
                            pouvez me contacter à l'adresse :{" "}
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