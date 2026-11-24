import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Salam API photos use plain <img> via SmartImage (query-string proxy).
    // Keep remotePatterns for any direct next/image remote usage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.salampakistan.gov.pk",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
