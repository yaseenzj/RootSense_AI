/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to allow Cloudflare Edge Functions (D1 access)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
