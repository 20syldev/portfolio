import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio v1 - Sylvain L.",
};

export default function V1Page() {
    return (
        <iframe
            src="/v1/index.html"
            className="w-full h-screen border-0"
            title="Sylvain L. - Portfolio v1"
        />
    );
}