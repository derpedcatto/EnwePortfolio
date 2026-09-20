import adapter from "@sveltejs/adapter-cloudflare";
import { mdsvex } from "mdsvex";
import { customMediaCss } from "./scripts/design-tokens-css.js";

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

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svx"],
  compilerOptions: {
    runes: ({ filename }) =>
      filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
  },
  preprocess: [mdsvex(), injectCssMedia],
  kit: {
    adapter: adapter(),
  },
};

export default config;
