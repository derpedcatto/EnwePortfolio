import { categories } from "$lib/server/content";
import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => {
  return categories.flatMap(({ slug, children }) => [
    { category: slug },
    ...children.map((child) => ({ category: slug, subcategory: child.slug })),
  ]);
};

export const load: PageServerLoad = ({ params }) => {
  const category = categories.find(({ slug }) => slug === params.category);

  if (!category) {
    error(404, "Category not found");
  }

  const subCategory = params.subcategory
    ? category.children.find(({ slug }) => slug === params.subcategory)
    : null;

  if (params.subcategory && !subCategory) {
    error(404, "Subcategory not found");
  }

  return { category, subCategory };
};
