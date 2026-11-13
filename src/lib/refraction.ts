/**
 * Shape of the Client Hints object that Chromium exposes on `navigator`.
 * Not part of the DOM typings yet.
 */
interface UserAgentData {
    brands: { brand: string }[];
    mobile: boolean;
}

/**
 * Pixel size of the pill and the bitmap that bends the backdrop behind it.
 */
export interface Refraction {
    width: number;
    height: number;
    href: string;
}

export const refraction = {
    id: "glass-refract",
    scale: 40,
    chroma: 0.07,
    bezel: 18,
};

/**
 * Tells whether the backdrop of the pill can be bent by an SVG filter.
 * Only Chromium applies `url()` inside `backdrop-filter`, and only a wide window gets it: parsing
 * the value is not proof that a browser renders it, so the brand is checked too.
 *
 * @returns True on a desktop Chromium window that is at least 768 px wide
 */
export function canRefract(): boolean {
    const data = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData;
    if (!data || data.mobile) return false;
    if (!data.brands.some(({ brand }) => /chromium/i.test(brand))) return false;
    if (!matchMedia("(min-width: 768px)").matches) return false;

    return CSS.supports("backdrop-filter", `url(#${refraction.id}) blur(1px)`);
}

/**
 * Draws the displacement map of a capsule as a PNG data URL.
 * The red and green channels hold the x and y offsets, 128 meaning no move. Offsets point inward
 * and fade with the depth under the edge, so the rim shows a magnified slice of what lies inside.
 *
 * @param width - Pill width in CSS px
 * @param height - Pill height in CSS px
 * @param density - Bitmap pixels per CSS px
 * @returns A data URL, or null when no 2D canvas is available
 */
export function displacementMap(width: number, height: number, density: number): string | null {
    const canvas = document.createElement("canvas");
    canvas.width = width * density;
    canvas.height = height * density;

    const context = canvas.getContext("2d");
    if (!context) return null;

    const image = context.createImageData(canvas.width, canvas.height);
    const radius = height / 2;
    const half = width / 2 - radius;

    for (let row = 0; row < canvas.height; row++) {
        for (let column = 0; column < canvas.width; column++) {
            const x = (column + 0.5) / density;
            const y = (row + 0.5) / density;
            const dx = Math.max(Math.abs(x - width / 2) - half, 0) * Math.sign(x - width / 2);
            const dy = y - height / 2;
            const length = Math.hypot(dx, dy) || 1e-6;
            const depth = Math.max(radius - length, 0);
            const strength = Math.pow(1 - Math.min(depth / refraction.bezel, 1), 2.4) / 2;
            const offset = (row * canvas.width + column) * 4;

            image.data[offset] = Math.round(128 - (dx / length) * strength * 255);
            image.data[offset + 1] = Math.round(128 - (dy / length) * strength * 255);
            image.data[offset + 2] = 128;
            image.data[offset + 3] = 255;
        }
    }

    context.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
}
