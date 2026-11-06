import { useEffect, useState } from "react";

let seen = false;

/**
 * Hook telling whether the calling component mounts as part of the first render of the visit.
 * The server and the first client render agree on true, and every later mount, such as a client
 * navigation that remounts the route template, gets false.
 *
 * @returns True while the page is the first one of the visit, false afterwards.
 */
export function useFirstVisit() {
    const [first] = useState(() => !seen);

    useEffect(() => {
        seen = true;
    }, []);

    return first;
}