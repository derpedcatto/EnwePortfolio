import type { ResolvedPathname } from "$app/types";

/** Tool / Tag / Sub-category */
export type Taxonomy = {
  slug: string;
  title: string;
};

export type Category = Taxonomy & {
  children: readonly Taxonomy[];
};

export type AboutPage = {
  avatar: string;
  body: string;
};

export type Contacts = {
  email: string;
  socials: {
    platform: "artstation" | "linkedin" | "telegram";
    url: string;
  }[];
};

export type NavItem = {
  title: string;
  href: ResolvedPathname;
  children: readonly NavItem[];
};
