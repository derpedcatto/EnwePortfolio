import { resolve } from "$app/paths";
import type { NavItem } from "$lib/content/types";
import { categories } from "$lib/server/content";

const items = categories.map(({ slug, title, children }) => ({
  title,
  href: resolve("/[category]/[[subcategory]]", { category: slug }),
  children: children.map((child) => ({
    title: child.title,
    href: resolve("/[category]/[[subcategory]]", {
      category: slug,
      subcategory: child.slug,
    }),
    children: [],
  })),
}));

export const navItems: NavItem[] = [
  { title: "About Me & Contacts", href: resolve("/about"), children: [] },
  { title: "Selected Works", href: resolve("/"), children: [] },
  ...items,
];
