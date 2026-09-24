import * as z from "zod";
import { load as parseYaml } from "js-yaml";

const SLUG_REGEX = /^[a-z0-9_~]+(?:-[a-z0-9_~]+)*$/;

const files: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("$content/**/*.yml", {
      query: "?raw",
      import: "default",
      eager: true,
    }),
  ).map(([path, raw]) => [path.replace(/^\/[^/]+/, "$content"), raw]),
);

export type Entry<S extends z.ZodObject> = z.output<S> & { slug: string };

export class ContentError extends Error {
  constructor(problems: string[]) {
    super(`Invalid content:\n\n${problems.join("\n\n")}`);
    this.name = "ContentError";
  }
}

export function loadCollection<S extends z.ZodObject>(
  folder: string,
  schema: S,
): Entry<S>[] {
  const entries: Entry<S>[] = [];
  const problems: string[] = [];

  for (const [path, raw] of Object.entries(files)) {
    if (!path.startsWith(`${folder}/`)) {
      continue;
    }

    const slug = path.slice(folder.length + 1).replace(/\.yml$/, "");

    if (!SLUG_REGEX.test(slug)) {
      problems.push(`${path}\nFile name is not a valid slug`);
      continue;
    }

    try {
      entries.push({ ...parseFile(raw, schema), slug });
    } catch (error) {
      problems.push(`${path}\n${(error as Error).message}`);
    }
  }

  if (problems.length > 0) {
    throw new ContentError(problems);
  }

  return entries;
}

export function loadSingleton<S extends z.ZodType>(
  path: string,
  schema: S,
): z.output<S> {
  try {
    return parseFile(files[path] ?? "{}", schema);
  } catch (error) {
    throw new ContentError([`${path}\n${(error as Error).message}`]);
  }
}

function parseFile<S extends z.ZodType>(raw: string, schema: S): z.output<S> {
  const result = schema.safeParse(parseYaml(raw));

  if (!result.success) {
    throw new Error(z.prettifyError(result.error));
  }

  return result.data;
}
