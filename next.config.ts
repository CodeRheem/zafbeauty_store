import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Product photos from phones are frequently larger than the 1 MB default,
    // which made admin image uploads fail with an opaque server-action error.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kzgrvmgmdanvrjcokjdy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
