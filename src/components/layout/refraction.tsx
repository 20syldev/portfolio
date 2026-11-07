import { type Refraction, refraction } from "@/lib/refraction";

/**
 * SVG filter that bends the backdrop of the pill near its rim.
 * Each colour channel is displaced by a slightly different amount, which splits the rim into a
 * faint chromatic fringe. The glass styles pick it up through `backdrop-filter: url()`.
 *
 * @param props - Component props
 * @param props.width - Pill width in CSS px
 * @param props.height - Pill height in CSS px
 * @param props.href - Displacement map of the pill as a data URL
 * @returns The hidden SVG holding the filter
 */
export function RefractionFilter({ width, height, href }: Refraction) {
    const { scale, chroma } = refraction;

    return (
        <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
            <filter
                id={refraction.id}
                filterUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={width}
                height={height}
                colorInterpolationFilters="sRGB"
            >
                <feImage
                    href={href}
                    x="0"
                    y="0"
                    width={width}
                    height={height}
                    preserveAspectRatio="none"
                    result="map"
                />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="map"
                    scale={scale * (1 + chroma)}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="dr"
                />
                <feColorMatrix
                    in="dr"
                    type="matrix"
                    values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    result="r"
                />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="map"
                    scale={scale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="dg"
                />
                <feColorMatrix
                    in="dg"
                    type="matrix"
                    values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    result="g"
                />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="map"
                    scale={scale * (1 - chroma)}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="db"
                />
                <feColorMatrix
                    in="db"
                    type="matrix"
                    values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                    result="b"
                />
                <feBlend in="r" in2="g" mode="screen" result="rg" />
                <feBlend in="rg" in2="b" mode="screen" />
            </filter>
        </svg>
    );
}