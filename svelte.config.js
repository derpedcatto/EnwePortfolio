import adapter from "@sveltejs/adapter-cloudflare";
import { mdsvex } from "mdsvex";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssMediaPath = fileURLToPath(
  new URL("./src/styles/media.css", import.meta.url),
);

/** @type {import('svelte/compiler').PreprocessorGroup} */
const injectCssMedia = {
  name: "inject-css-custom-media",
  style: ({ content, attributes }) => {
    if (attributes.lang && attributes.lang !== "css") return;

    // everything in one line so source maps line numbers are consistent
    const media = readFileSync(cssMediaPath, "utf8").replace(/\r?\n/g, " ");
    return { code: media + content, dependencies: [cssMediaPath] };
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
