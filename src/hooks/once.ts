import { useState } from "react";

/**
 * Hook that stays true once a flag has been true.
 * Used to mount a lazily loaded dialog on its first opening and keep it mounted afterwards,
 * so its exit animation and state survive the close.
 *
 * @param flag - Condition that triggers the mount, typically a dialog open state.
 * @returns True from the first render where the flag was true, forever after.
 */
export function useOnce(flag: boolean) {
    const [seen, setSeen] = useState(flag);

    if (flag && !seen) setSeen(true);

    return seen || flag;
}
