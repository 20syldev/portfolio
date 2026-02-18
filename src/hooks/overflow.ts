import { useEffect, useRef } from "react";

/**
 * Manages single/multi-line overflow with truncation and "+X" counter.
 * Elements must use `data-item` and `data-counter` attributes.
 *
 * @param count - Number of items (used as effect dependency)
 * @param maxLines - Maximum visible lines (default: 1)
 * @returns A ref to attach to the flex container
 */
export function useOverflow<T extends HTMLElement>(count: number, maxLines = 1) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const calculate = () => {
            const items = Array.from(container.querySelectorAll<HTMLElement>("[data-item]"));
            const counter = container.querySelector<HTMLElement>("[data-counter]");
            if (items.length === 0) return;

            const styles = getComputedStyle(container);
            const colGap = parseFloat(styles.columnGap) || 8;
            const rowGap = parseFloat(styles.rowGap) || 8;
            const containerWidth = container.clientWidth;

            // Reset all elements for measurement
            container.style.flexWrap = maxLines > 1 ? "wrap" : "nowrap";
            container.style.maxHeight = "";
            for (const item of items) {
                item.style.display = "";
                item.style.overflow = "";
                item.style.textOverflow = "";
                item.style.minWidth = "";
                item.style.flexShrink = "0";
            }
            if (counter) counter.style.display = "none";

            const widths = items.map((t) => t.offsetWidth);

            // Measure counter width at max possible value
            let counterWidth = 0;
            if (counter) {
                counter.textContent = `+${items.length}`;
                counter.style.display = "";
                counterWidth = counter.offsetWidth;
                counter.style.display = "none";
            }

            // For multi-line: find where the last allowed line starts
            let lastLineStart = 0;
            if (maxLines > 1) {
                const tops = items.map((t) => t.offsetTop);
                let currentLine = 1;
                for (let i = 1; i < items.length; i++) {
                    if (tops[i] > tops[i - 1] + 1) {
                        currentLine++;
                        if (currentLine > maxLines) break;
                        lastLineStart = i;
                    }
                }

                if (currentLine <= maxLines) {
                    // Everything fits within maxLines
                    const lineHeight = items[0].offsetHeight;
                    container.style.maxHeight = `${lineHeight * maxLines + rowGap * (maxLines - 1)}px`;
                    return;
                }
            }

            // Calculate how many items fit on the last allowed line
            let used = 0;
            let fullyVisible = lastLineStart;
            for (let i = lastLineStart; i < items.length; i++) {
                const gapBefore = i > lastLineStart ? colGap : 0;
                const remaining = items.length - i - 1;
                const counterSpace = remaining > 0 ? colGap + counterWidth : 0;
                if (used + gapBefore + widths[i] + counterSpace <= containerWidth) {
                    used += gapBefore + widths[i];
                    fullyVisible++;
                } else {
                    break;
                }
            }
            let totalVisible = fullyVisible;
            let hiddenCount = items.length - totalVisible;

            // Try to add one more item as truncated (with "…")
            if (hiddenCount > 0 && totalVisible < items.length) {
                const gapBefore = totalVisible > lastLineStart ? colGap : 0;
                const cSpace = hiddenCount > 1 ? colGap + counterWidth : 0;
                const available = containerWidth - used - gapBefore - cSpace;
                if (available >= 48) {
                    totalVisible++;
                    hiddenCount--;
                }
            }

            // Ensure at least one item is visible (truncated if needed)
            if (totalVisible <= lastLineStart) {
                totalVisible = lastLineStart + 1;
                hiddenCount = items.length - totalVisible;
            }

            // Apply visibility
            for (let i = 0; i < items.length; i++) {
                if (i < fullyVisible) {
                    items[i].style.display = "";
                    items[i].style.flexShrink = "0";
                } else if (i < totalVisible) {
                    items[i].style.display = "";
                    items[i].style.overflow = "hidden";
                    items[i].style.textOverflow = "ellipsis";
                    items[i].style.minWidth = "0";
                    items[i].style.flexShrink = "1";
                } else {
                    items[i].style.display = "none";
                }
            }

            if (counter) {
                if (hiddenCount > 0) {
                    counter.style.display = "";
                    counter.textContent = `+${hiddenCount}`;
                } else {
                    counter.style.display = "none";
                }
            }

            // Constrain container height for multi-line
            if (maxLines > 1) {
                const lineHeight = items[0].offsetHeight;
                container.style.maxHeight = `${lineHeight * maxLines + rowGap * (maxLines - 1)}px`;
            }
        };

        calculate();
        const observer = new ResizeObserver(calculate);
        observer.observe(container);
        return () => observer.disconnect();
    }, [count, maxLines]);

    return ref;
}