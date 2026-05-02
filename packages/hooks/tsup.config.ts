import { baseConfig } from "@bones/tsup-config";
import { defineConfig } from "tsup";

export default defineConfig({
  ...baseConfig,
  entry: ["src/index.ts"],
  external: ["react", "react-dom"],
});
