import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/quiz",
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // Ігнорувати ESLint помилки під час збірки
  },
  typescript: {
    ignoreBuildErrors: true, // Ігнорувати TypeScript помилки під час збірки
  },
};

export default nextConfig;
