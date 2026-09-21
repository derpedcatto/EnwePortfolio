import { load } from "js-yaml";

/** @import { Category } from '$lib/types' */

const files = import.meta.glob("/content/taxonomies/categories/*.yml", {
  query: "?raw",
  import: "default",
  eager: true,
});

/** @returns {Category[]} */
function read() {
  return Object.entries(files)
    .map(([path, raw]) => {
      const data = load(raw, { filename: path }) ?? {};
      const slug = path
        .split("/")
        .pop()
        .replace(/\.yml$/, "");

      return {
        slug,
        title: data.title ?? slug,
        order: Number.isFinite(+data.order) ? +data.order : Infinity,
        parent: data.parent || null,
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

const all = read();

/** @returns {Category[]} */
export const getCategories = () => all;
