import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 * Combines conditional class values and deduplicates Tailwind CSS classes.
 *
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Utilities for random array operations.
 *
 * - `random.pick(array)` — returns a random element
 * - `random.shuffle(array)` — returns a shuffled copy (does not mutate)
 */
export const random = {
    pick<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    },
    shuffle<T>(array: T[]): T[] {
        return [...array].sort(() => Math.random() - 0.5);
    },
};