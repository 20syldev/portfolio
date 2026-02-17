"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ContactDialog } from "@/components/contact";

import Home from "../page";

/**
 * Contact/about page component.
 * Opens the contact dialog automatically with auto-focus on close button.
 *
 * @returns The rendered page with home content and contact dialog
 */
export default function MePage() {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    return (
        <>
            <Home />
            <ContactDialog
                open={open}
                autoFocusClose
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) router.push("/");
                }}
            />
        </>
    );
}