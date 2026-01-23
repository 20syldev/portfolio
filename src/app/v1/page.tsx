import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Portfolio v1 - Sylvain L.",
};

export default function V1Page() {
    return (
        <div className="relative w-full h-screen">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 text-sm bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-lg shadow-md">
                <Info className="h-4 w-4 shrink-0" />
                <span>
                    Cette version n&apos;est plus maintenue.{" "}
                    <Link href="/" className="underline hover:no-underline font-medium">
                        Voir la v2
                    </Link>
                </span>
            </div>
            <iframe
                src="/v1/index.html"
                className="w-full h-full border-0"
                title="Sylvain L. - Portfolio v1"
            />
        </div>
    );
}