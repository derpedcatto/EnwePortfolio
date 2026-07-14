import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    preprocessorOptions: {
      scss: {
        // Lets any file resolve "abstracts" without a relative path
        loadPaths: [fileURLToPath(new URL("./src/styles", import.meta.url))],
        additionalData: `@use "abstracts" as *;\n`,
      },
    },
  },
});
