/** @type {import('next').NextConfig} */
const path = require("path");
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

const securityHeaders = [
  // Block MIME-type sniffing.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limit referrer leakage to other origins.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Force HTTPS for a year (only matters on production where served over TLS).
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // Disable powerful features we don't use.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

const marketingFrameOptions = [
  // Marketing pages cannot be framed by other sites (anti-clickjacking).
  { key: 'X-Frame-Options', value: 'DENY' },
];

const studioFrameOptions = [
  // Studio uses iframes internally for previews; allow same-origin framing.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
];

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/studio/:path*',
        headers: [...securityHeaders, ...studioFrameOptions],
      },
      {
        source: '/:path*',
        headers: [...securityHeaders, ...marketingFrameOptions],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
