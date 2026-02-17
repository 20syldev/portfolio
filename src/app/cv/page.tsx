"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { usePdfViewer } from "@/components/utils/viewer";

/**
 * CV viewer page component.
 * Opens the CV PDF in fullscreen mode on mount and redirects to home on close.
 *
 * @returns null (PDF is displayed in dialog overlay)
 */
export default function CvPage() {
    const { openPdf } = usePdfViewer();
    const router = useRouter();

    useEffect(() => {
        openPdf("/CV.pdf", "CV", {
            fullscreen: true,
            onClose: () => router.push("/"),
        });
    }, [openPdf, router]);

    return null;
}