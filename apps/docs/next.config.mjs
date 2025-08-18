/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@remotion-ui/core', '@remotion-ui/components', '@remotion-ui/themes', '@remotion-ui/assets'],
};

export default nextConfig;