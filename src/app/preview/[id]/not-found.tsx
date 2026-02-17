import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * 404 error page for preview routes.
 * Displays a centered error message with navigation link to home.
 *
 * @returns The rendered 404 error page
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-muted-foreground">Projet non trouvé</p>
                <Link href="/" target="_top">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à l'accueil
                    </Button>
                </Link>
            </div>
        </div>
    );
}