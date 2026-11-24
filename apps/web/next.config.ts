import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@zecflow/protocol"],
  reactStrictMode: true,
};

export default config;
