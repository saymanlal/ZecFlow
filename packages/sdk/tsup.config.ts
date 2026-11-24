import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "es2022",
  platform: "neutral",
  clean: true,
  splitting: false,
  treeshake: true,
  minify: true,
  noExternal: ["@zecflow/protocol"],
  external: ["zod", "viem"],
  dts: {
    resolve: ["@zecflow/protocol"],
    compilerOptions: {
      baseUrl: ".",
      paths: { "@zecflow/protocol": ["../protocol/src/index.ts"] },
    },
  },
});
