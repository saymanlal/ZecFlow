import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@zecflow/protocol"],
  reactStrictMode: true,
  experimental: {
    agentUpgrade: "security",
  },
};

export default config;
