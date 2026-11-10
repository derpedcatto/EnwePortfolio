import { sveltekit } from "@sveltejs/kit/vite";
import svg from "@poppanator/sveltekit-svg";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { customMediaCss } from "./scripts/design-tokens-css.js";
import adapter from "@sveltejs/adapter-cloudflare";

// everything in one line so source maps line numbers are consistent
const customMedia = customMediaCss().replace(/\r?\n/g, " ") + " ";
const USES_CUSTOM_MEDIA = /@media[^{;]*\(\s*--/;

/** @type {import('svelte/compiler').PreprocessorGroup} */
const injectCssMedia = {
  name: "inject-css-custom-media",
  style: ({ content, attributes }) => {
    if (attributes.lang && attributes.lang !== "css") {
      return;
    }

    if (!USES_CUSTOM_MEDIA.test(content)) {
      return;
    }

    return { code: customMedia + content };
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const contentDir = env.CONTENT_DIR || "content";

  return {
    plugins: [
      sveltekit({
        adapter: adapter(),
        compilerOptions: {
          runes: ({ filename }) =>
            filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
        },
        preprocess: [injectCssMedia],
      }),
      svg(),
    ],
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
