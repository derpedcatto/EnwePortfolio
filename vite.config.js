import { sveltekit } from "@sveltejs/kit/vite";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const contentDir = env.CONTENT_DIR || "content";

  return {
    plugins: [sveltekit()],
    resolve: {
      alias: {
        $content: fileURLToPath(new URL(`./${contentDir}`, import.meta.url)),
      },
    },
    css: {
      transformer: "lightningcss",
      lightningcss: {
        targets: browserslistToTargets(browserslist(">= 0.25%, not dead")),
        drafts: {
          customMedia: true,
        },
      },
    },
    build: {
      cssMinify: "lightningcss",
    },
  };
});
