"use client";

import { type ReactNode } from "react";

interface TemplateProps {
    children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
    return <div className="animate-page-in">{children}</div>;
}