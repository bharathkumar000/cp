/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingExcludes: {
    '*': [
      './mobile_app/**/*',
      './scratch/**/*',
      './builds/**/*',
    ],
  },
};

export default nextConfig;
