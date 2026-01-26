import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: process.env.NODE_ENV === "production" ? "export" : undefined,
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    async rewrites() {
        return [
            { source: "/assets/:path*", destination: "/legacy/assets/:path*" },
            { source: "/files/:path*", destination: "/legacy/files/:path*" },
            { source: "/projets/:path*", destination: "/legacy/projets/:path*" },
            { source: "/sisr/:path*", destination: "/legacy/sisr/:path*" },
            { source: "/slam/:path*", destination: "/legacy/slam/:path*" },
        ];
    },
};

export default nextConfig;