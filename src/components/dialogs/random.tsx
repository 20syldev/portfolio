"use client";

import { Dices, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { docs } from "@/data/docs";
import { getCategoryName } from "@/lib/docs";
import { random } from "@/lib/utils";

/**
 * Pick a random documentation entry that has content.
 *
 * @param exclude - ID of the doc to exclude (avoids re-picking the current one)
 * @returns A randomly selected doc entry that has content
 */
function pickRandomDoc(exclude?: string) {
    const withContent = docs.filter((d) => d.hasContent && d.id !== exclude);
    return random.pick(withContent);
}

/**
 * Button that opens a dialog suggesting a random documentation page.
 * Allows re-rolling for another suggestion or navigating to the selected doc.
 *
 * @returns The rendered random button with dialog
 */
export function RandomButton() {
    const [open, setOpen] = useState(false);
    const [doc, setDoc] = useState(() => pickRandomDoc());

    const reroll = useCallback(() => setDoc((prev) => pickRandomDoc(prev.id)), []);

    const handleOpen = useCallback(() => {
        setDoc((prev) => pickRandomDoc(prev.id));
        setOpen(true);
    }, []);

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleOpen}
            >
                <Dices className="h-4 w-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Documentation aléatoire</DialogTitle>
                        <DialogDescription>Découvrir un guide au hasard</DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-start justify-between gap-4">
                                <p className="font-medium">{doc.title}</p>
                                <span className="px-2.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                                    {getCategoryName(doc.category)}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={reroll}>
                                <Dices className="h-4 w-4 mr-2" />
                                Autre
                            </Button>
                            <Button asChild className="flex-1">
                                <Link href={`/help/${doc.category}/${doc.slug}`}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Lire
                                </Link>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}