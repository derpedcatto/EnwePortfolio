import { sveltekit } from "@sveltejs/kit/vite";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(browserslist(">= 0.25%")),
      drafts: {
        customMedia: true,
      },
    },
  },
  build: {
    cssMinify: "lightningcss",
  },
});
