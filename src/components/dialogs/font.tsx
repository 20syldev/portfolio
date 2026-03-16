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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFont } from "@/components/utils/font";
import { defaultFontSize, maxFontSize, minFontSize } from "@/components/utils/font";
import { defaultFontId, type FontConfig, fonts } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const previewText = "Le vif zéphyr jubile sur les kumquats du clown gracieux";

function FontSlider({
    min,
    max,
    value,
    onChange,
    onCommit,
}: {
    min: number;
    max: number;
    value: number;
    onChange: (v: number) => void;
    onCommit: (v: number) => void;
}) {
    const [hovered, setHovered] = React.useState(false);
    const percent = ((value - min) / (max - min)) * 100;

    const computeValue = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        return Math.round(min + x * (max - min));
    };

    return (
        <div
            className="relative h-6 flex items-center cursor-pointer group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => {
                const v = computeValue(e);
                onChange(v);
                onCommit(v);
            }}
        >
            <div className="absolute inset-y-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-muted transition-colors duration-200 group-hover:bg-accent">
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full bg-primary border-2 border-background shadow transition-transform duration-200",
                    hovered && "scale-125"
                )}
                style={{ left: `${percent}%` }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                onPointerUp={(e) => onCommit(parseInt((e.target as HTMLInputElement).value, 10))}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
        </div>
    );
}

/**
 * Card displaying a single font option in the picker grid.
 *
 * @param props - Component props
 * @param props.config - Font configuration to display
 * @param props.active - Whether this font is currently selected
 * @param props.onSelect - Callback invoked when the card is clicked
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
    const card = (
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

    if (config.id === defaultFontId) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{card}</TooltipTrigger>
                <TooltipContent side="top">Police par défaut du site</TooltipContent>
            </Tooltip>
        );
    } else if (config.accessibility) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{card}</TooltipTrigger>
                <TooltipContent side="top">Conçue pour les personnes dyslexiques</TooltipContent>
            </Tooltip>
        );
    }

    return card;
}

/**
 * Font preview container showing text in different styles.
 *
 * @param props - Component props
 * @param props.fontVariable - CSS variable name for the font (e.g. `--font-inter`)
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
    const [draftSize, setDraftSize] = React.useState(fontSize);

    React.useEffect(() => {
        if (dialogOpen) {
            setPreview(font);
            setDraftSize(fontSize);
        }
    }, [dialogOpen, font, fontSize]);

    const currentConfig = fonts.find((f) => f.id === preview);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent
                className="max-h-[calc(100dvh-30%)] overflow-y-auto sm:max-w-lg"
                autoFocusClose
            >
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
                    <Collapsible open={!!currentConfig?.accessibility}>
                        <p className="text-xs text-muted-foreground pb-3">
                            Cette police a été conçue pour réduire le stress visuel et améliorer la
                            lisibilité pour les personnes dyslexiques.
                        </p>
                    </Collapsible>
                    {currentConfig && <FontPreview fontVariable={currentConfig.variable} />}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Taille globale</span>
                        <div className="flex items-center gap-2">
                            {draftSize !== defaultFontSize && (
                                <button
                                    onClick={() => {
                                        setDraftSize(defaultFontSize);
                                        setFontSize(defaultFontSize);
                                    }}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Réinitialiser
                                </button>
                            )}
                            <span className="text-sm tabular-nums w-10 text-right">
                                {draftSize}%
                            </span>
                        </div>
                    </div>
                    <FontSlider
                        min={minFontSize}
                        max={maxFontSize}
                        value={draftSize}
                        onChange={setDraftSize}
                        onCommit={setFontSize}
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