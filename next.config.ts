import type { NextConfig } from "next";
import withPWA from "next-pwa";
import { loadLiaraEnvIntoProcess } from "./lib/load-liara-env";

// Load liara.env before build so values are inlined into the server bundle (Liara standalone)
const liaraEnvLoaded = loadLiaraEnvIntoProcess();
if (liaraEnvLoaded) {
  console.log("✅ liara.env loaded for production build");
}

// MONGODB_URI must stay runtime-only (liara.env / panel), never webpack-inlined
const BUILD_TIME_ENV_KEYS = [
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "NEXT_PUBLIC_SITE_URL",
] as const;

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./liara.env"],
  },
  webpack: (config, { isServer, dev, webpack }) => {
    if (isServer && !dev) {
      const definitions: Record<string, string> = {};
      for (const key of BUILD_TIME_ENV_KEYS) {
        const value = process.env[key];
        if (value) {
          definitions[`process.env.${key}`] = JSON.stringify(value);
        }
      }
      if (Object.keys(definitions).length > 0) {
        config.plugins.push(new webpack.DefinePlugin(definitions));
      }
    }
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Disabled: next-pwa 5.x breaks `next build` on Next.js 15 (webpack runtime error on "/").
  // Set NEXT_ENABLE_PWA=1 to turn on after upgrading the PWA plugin.
  disable: process.env.NEXT_ENABLE_PWA !== "1",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
})(nextConfig);
