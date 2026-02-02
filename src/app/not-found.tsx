import { Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Global 404 page displayed when a route is not found.
 *
 * @returns The rendered 404 page
 */
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center animate-fade-in">
            <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>
            <h2 className="text-2xl font-semibold">Page non trouvée</h2>
            <p className="max-w-md text-muted-foreground">
                La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link href="/" target="_top">
                <Button>
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                </Button>
            </Link>
        </div>
    );
}