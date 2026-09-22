import { categorySchema, type Category } from "$lib/content/schemas";
import { parseCollection } from "./collection";

const categoryFiles = import.meta.glob<string>(
  "/content/taxonomies/categories/*.yml",
  { query: "?raw", import: "default", eager: true },
);

export const categories: Category[] = parseCollection(
  categoryFiles,
  categorySchema,
);
