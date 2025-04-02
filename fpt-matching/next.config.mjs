// const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["shiki"],
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.externals = config.externals || [];
            config.externals.push({
                "@nutrient-sdk/viewer": "@nutrient-sdk/viewer",
            });
        }

        return config;
    },
    experimental: {
        turbo: {
            resolveAlias: {
                "@nutrient-sdk/viewer": "@nutrient-sdk/viewer",
            },
        },
    },
  };
  
  export default nextConfig;
  