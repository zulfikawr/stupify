/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "3000-idx-spotify-dashboard-1744640626261.cluster-a3grjzek65cxex762e4mwrzl46.cloudworkstations.dev",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
