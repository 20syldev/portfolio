import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sylvain L. - Legacy Portfolio",
};

export default function LegacyPage() {
    return (
        <div className="relative w-full h-screen">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 text-sm bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-lg shadow-md">
                <Info className="h-4 w-4 shrink-0" />
                <span>
                    Cette version n'est plus maintenue.{" "}
                    <Link href="/" className="underline hover:no-underline font-medium">
                        Voir la dernière version.
                    </Link>
                </span>
            </div>
            <iframe
                src="/legacy/v1.html"
                className="w-full h-full border-0"
                title="Sylvain L. - Legacy Portfolio"
            />
        </div>
    );
}