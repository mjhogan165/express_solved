/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    threads: false,
    setupFiles: ["./tests/setup.ts"],
  },
});
