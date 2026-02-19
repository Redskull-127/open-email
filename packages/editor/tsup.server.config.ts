import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false, // don't wipe dist; main build already put files there
  outDir: "dist",
  external: [
    "react",
    "react-dom",
    "@react-email/components",
    "@react-email/render",
  ],
  // No "use client" banner - this entry is for server-only usage
});
