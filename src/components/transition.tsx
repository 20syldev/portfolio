"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

/**
 * Page transition component.
 * Applies fade and translate animation on route changes.
 *
 * @param props - Component props
 * @param props.children - Page content to display
 */
export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setIsTransitioning(true);
        const timeout = setTimeout(() => {
            setDisplayChildren(children);
            setIsTransitioning(false);
        }, 150);

        return () => clearTimeout(timeout);
    }, [pathname, children]);

    return (
        <div
            className={`transition-all duration-300 ease-out ${
                isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
        >
            {displayChildren}
        </div>
    );
}