"use client";

import { Star } from "lucide-react";
import * as React from "react";

import { Collapsible } from "@/components/ui/collapsible";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFont } from "@/components/utils/font";
import { defaultFontSize, maxFontSize, minFontSize } from "@/components/utils/font";
import { defaultFontId, type FontConfig, fonts } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const previewText = "Le vif zéphyr jubile sur les kumquats du clown gracieux";

/**
 * Card displaying a single font option in the picker grid.
 */
function FontCard({
    config,
    active,
    onSelect,
}: {
    config: FontConfig;
    active: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={cn(
                "relative rounded-lg border p-3 text-left transition-all hover:bg-accent/50",
                active && "border-primary bg-accent ring-1 ring-primary"
            )}
        >
            {config.accessibility && (
                <Star className="absolute top-2 right-2 h-2.5 w-2.5 fill-blue-500 text-blue-500" />
            )}
            {config.id === defaultFontId && (
                <span className="absolute top-1.5 right-2 text-[9px] text-muted-foreground">
                    défaut
                </span>
            )}
            <span
                className="block text-sm font-medium truncate"
                style={{ fontFamily: `var(${config.variable})` }}
            >
                {config.name}
            </span>
        </button>
    );
}

/**
 * Font preview container showing text in different styles.
 */
function FontPreview({ fontVariable }: { fontVariable: string }) {
    const family = `var(${fontVariable})`;

    return (
        <div className="rounded-lg border bg-card p-4 space-y-2">
            <p className="text-sm" style={{ fontFamily: family }}>
                {previewText}
            </p>
            <p className="text-sm font-bold" style={{ fontFamily: family }}>
                {previewText}
            </p>
            <p className="text-sm italic" style={{ fontFamily: family }}>
                {previewText}
            </p>
            <p className="text-sm font-bold italic" style={{ fontFamily: family }}>
                {previewText}
            </p>
        </div>
    );
}

/**
 * Dialog for selecting and previewing fonts.
 * Accessible via ALT+P or the command menu.
 *
 * @returns The rendered font selection dialog
 */
export function FontDialog() {
    const { font, setFont, fontSize, setFontSize, dialogOpen, setDialogOpen } = useFont();
    const [preview, setPreview] = React.useState(font);

    React.useEffect(() => {
        if (dialogOpen) setPreview(font);
    }, [dialogOpen, font]);

    const currentConfig = fonts.find((f) => f.id === preview);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-lg" autoFocusClose>
                <DialogHeader>
                    <DialogTitle>Police de caractères</DialogTitle>
                    <DialogDescription>Choisissez la police utilisée sur le site</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {fonts.map((config) => (
                        <FontCard
                            key={config.id}
                            config={config}
                            active={preview === config.id}
                            onSelect={() => {
                                setPreview(config.id);
                                setFont(config.id);
                            }}
                        />
                    ))}
                </div>

                <div className="space-y-0">
                    {currentConfig && <FontPreview fontVariable={currentConfig.variable} />}
                    <Collapsible open={!!currentConfig?.accessibility}>
                        <p className="text-xs text-muted-foreground pt-3">
                            Cette police a été conçue pour réduire le stress visuel et améliorer la
                            lisibilité pour les personnes dyslexiques.
                        </p>
                    </Collapsible>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Taille globale</span>
                        <div className="flex items-center gap-2">
                            {fontSize !== defaultFontSize && (
                                <button
                                    onClick={() => setFontSize(defaultFontSize)}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Réinitialiser
                                </button>
                            )}
                            <span className="text-sm tabular-nums w-10 text-right">
                                {fontSize}%
                            </span>
                        </div>
                    </div>
                    <input
                        type="range"
                        min={minFontSize}
                        max={maxFontSize}
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                        className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{minFontSize}%</span>
                        <span>{maxFontSize}%</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}