import { ArrowRight } from "lucide-react";

interface PeriodProps {
    from: string;
    to: string;
    className?: string;
    iconClassName?: string;
}

/**
 * Date range separated by a Lucide arrow instead of a unicode dash,
 * so the separator renders identically on every device and font.
 *
 * @param props - Component properties
 * @param props.from - Range start label
 * @param props.to - Range end label
 * @param props.className - Optional CSS class for the wrapper
 * @param props.iconClassName - Optional CSS class overriding the arrow size
 * @returns The rendered date range
 */
export function Period({ from, to, className, iconClassName }: PeriodProps) {
    return (
        <span className={`inline-flex items-center gap-1 whitespace-nowrap ${className || ""}`}>
            {from}
            <ArrowRight className={`shrink-0 ${iconClassName || "h-3 w-3"}`} aria-hidden />
            {to}
        </span>
    );
}