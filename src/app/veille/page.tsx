"use client";

import { Nav } from "@/components/layout/nav";
import { Veille } from "@/components/sections/veille";
import { tabs, urls } from "@/lib/nav";

/**
 * Tech watch page, outside the tabs since the latest veilles sit at the foot of the Projets tab.
 *
 * @returns The rendered tech watch page
 */
export default function VeillePage() {
    return (
        <>
            <Nav currentTab={-1} tabs={tabs} links={urls} />
            <Veille />
        </>
    );
}
