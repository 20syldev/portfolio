import { type Veille, veilles } from "@/data/veille";

export function getVeilleContent(veilleId: string): string | null {
    const veille = veilles.find((v) => v.id === veilleId);
    return veille?.content ?? null;
}

export function hasVeilleContent(veilleId: string): boolean {
    const veille = veilles.find((v) => v.id === veilleId);
    return veille?.hasContent ?? false;
}

export function getVeille(veilleId: string): Veille | undefined {
    return veilles.find((v) => v.id === veilleId);
}

export function getAllVeilles(): Veille[] {
    return veilles;
}