import { categories, contacts } from "$lib/server/content";
import { navItems } from "$lib/server/content/navigation";

export const load = () => ({ categories, navItems, contacts });
