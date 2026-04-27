import { defineConfig } from "tsup";
import { baseConfig } from "@bones/tsup-config";

export default defineConfig({
  ...baseConfig,
  entry: ["src/index.ts"],
  external: ["react", "react-dom"],
});
