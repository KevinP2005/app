const isPages = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.PAGES_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = isPages
  ? { output: 'export', basePath, trailingSlash: true, images: { unoptimized: true } }
  : {};

export default nextConfig;
