// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    transpilePackages: ['leaflet', 'react-leaflet'],
};

export default nextConfig;