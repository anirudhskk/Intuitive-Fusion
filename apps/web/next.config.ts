import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@if/domain'],
  poweredByHeader: false,
  async headers() {
    // Baseline security headers; CSP tightened per environment (SEC-AP07)
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'microphone=(self), camera=()' },
        ],
      },
    ];
  },
};

export default config;
