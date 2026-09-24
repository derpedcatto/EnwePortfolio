import type { AboutPage, Contacts } from "$lib/content/types";
import {
  buildCategories,
  buildTaxonomy,
  categorySchema,
  taxonomySchema,
  validateCategories,
} from "./collections";
import { loadCollection, loadSingleton } from "./load";
import { aboutPageSchema, contactsSchema, settingsSchema } from "./singletons";

const settings = loadSingleton("$content/site/settings.yml", settingsSchema);

const categoryEntries = loadCollection(
  "$content/taxonomies/categories",
  categorySchema,
);

validateCategories(categoryEntries);

export const categories = buildCategories(categoryEntries);

export const tools = buildTaxonomy(
  loadCollection("$content/taxonomies/tools", taxonomySchema),
  settings.sorting.tools_alphabetical,
);

export const tags = buildTaxonomy(
  loadCollection("$content/taxonomies/tags", taxonomySchema),
  settings.sorting.tags_alphabetical,
);

export const about: AboutPage = loadSingleton(
  "$content/pages/about.yml",
  aboutPageSchema,
);

export const contacts: Contacts = loadSingleton(
  "$content/site/contacts.yml",
  contactsSchema,
);
