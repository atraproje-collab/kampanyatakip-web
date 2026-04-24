import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "/basvuru",
        permanent: true,
      },
      // Temporary (307): only the live campaign demo is public for launch.
      // Remove this entry to re-enable the marketing site root.
      {
        source: "/",
        destination: "/kampanya/demo",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
