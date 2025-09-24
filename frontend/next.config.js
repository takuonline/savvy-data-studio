/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'standalone',
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false,
            },
        ];
    },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')();

module.exports =
    process.env.ANALYZE === 'true'
        ? withBundleAnalyzer(nextConfig)
        : nextConfig;

// module.exports = nextConfig;
