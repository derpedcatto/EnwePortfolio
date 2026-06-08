import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";
import remarkGfm from "remark-gfm";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svx"],
  compilerOptions: {
    runes: ({ filename }) =>
      filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
  },
  preprocess: mdsvex({
    remarkPlugins: [remarkGfm],
  }),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
