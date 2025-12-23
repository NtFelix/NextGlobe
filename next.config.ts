import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: "export",

  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },

  // Set base path for GitHub Pages (repo name)
  // Change 'NextGlobe' to your repository name if different
  basePath: isProd ? "/NextGlobe" : "",
  assetPrefix: isProd ? "/NextGlobe/" : "",
};

export default nextConfig;
