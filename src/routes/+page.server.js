import { getCategories } from "$lib/server/content/categories";

export const load = () => ({ categories: getCategories() });
