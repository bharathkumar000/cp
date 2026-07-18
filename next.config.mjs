/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingExcludes: {
    '*': [
      './Facerecognition/dataset/**/*',
      './Facerecognition/trainer/**/*',
      './Facerecognition/venv/**/*',
      './mobile_app/**/*',
      './scratch/**/*',
      './builds/**/*',
    ],
  },
};

export default nextConfig;
