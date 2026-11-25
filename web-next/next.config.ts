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
      // Tailwind on all app CSS — but skip node_modules (`foreign`).
      // Applying the loader to MapLibre/Swiper CSS caused an HMR reload loop.
      "*.css": {
        condition: { not: "foreign" },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
