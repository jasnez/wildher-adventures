/** @type {import('next').NextConfig} */
const path = require("path");
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      // Sanity CDN — serves all hosted images.
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
