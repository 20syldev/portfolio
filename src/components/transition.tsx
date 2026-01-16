"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

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
                isTransitioning
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0"
            }`}
        >
            {displayChildren}
        </div>
    );
}