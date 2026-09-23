import { categorySchema, type CategoryEntry } from "$lib/content/schemas";
import type { Category } from "$lib/content/types";
import { validateCategories } from "$lib/content/validate";
import { parseCollection } from "./collection";

/* -------------------------------- Category -------------------------------- */

const categoryFiles = import.meta.glob<string>(
  "/content/taxonomies/categories/*.yml",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
);

const categoryEntries = parseCollection(categoryFiles, categorySchema).toSorted(
  (a, b) => a.order - b.order,
);

const categoryProblems = validateCategories(categoryEntries);

if (categoryProblems.length > 0) {
  throw new Error(`Invalid content:\n\n${categoryProblems.join("\n")}`);
}

const toCategory = (entry: CategoryEntry): Category => ({
  slug: entry.slug,
  title: entry.title,
  children: categoryEntries
    .filter((child) => child.parent === entry.slug)
    .map(toCategory),
});

export const categories: readonly Category[] = categoryEntries
  .filter((entry) => entry.parent === null)
  .map(toCategory);
