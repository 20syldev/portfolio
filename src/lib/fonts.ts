export interface FontConfig {
    id: string;
    name: string;
    variable: string;
    accessibility?: string;
}

export const fonts: FontConfig[] = [
    { id: "outfit", name: "Outfit", variable: "--font-outfit" },
    { id: "dm", name: "DM Sans", variable: "--font-dm" },
    {
        id: "lexend",
        name: "Lexend",
        variable: "--font-lexend",
        accessibility: "Recommandée pour la dyslexie",
    },
    { id: "poppins", name: "Poppins", variable: "--font-poppins" },
    { id: "montserrat", name: "Montserrat", variable: "--font-montserrat" },
    { id: "jakarta", name: "Plus Jakarta Sans", variable: "--font-jakarta" },
    { id: "raleway", name: "Raleway", variable: "--font-raleway" },
    { id: "inter", name: "Inter", variable: "--font-inter" },
    { id: "fredoka", name: "Fredoka", variable: "--font-fredoka" },
];

export const defaultFontId = "outfit";

/**
 * Finds a font configuration by its identifier.
 *
 * @param id - The unique font identifier
 * @returns The matching font config, or undefined if not found
 */
export function getFontById(id: string): FontConfig | undefined {
    return fonts.find((f) => f.id === id);
}

/**
 * Generates a CSS font-family value with fallbacks for a given font config.
 *
 * @param font - The font configuration to convert
 * @returns A CSS font-family string using the font's CSS variable
 */
export function getFontCssValue(font: FontConfig): string {
    return `var(${font.variable}), ui-sans-serif, system-ui, sans-serif`;
}