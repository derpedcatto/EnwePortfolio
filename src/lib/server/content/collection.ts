import * as z from "zod";
import { load as parseYaml } from "js-yaml";

export function parseCollection<S extends z.ZodType>(
  files: Record<string, string>,
  schema: S,
): z.infer<S>[] {
  const items: z.infer<S>[] = [];
  const problems: string[] = [];

  for (const [path, raw] of Object.entries(files)) {
    const slug = path.slice(path.lastIndexOf("/") + 1).replace(/\.[^.]+$/, "");
    const data = parseYaml(raw, { filename: path }) as Record<
      string,
      unknown
    > | null;

    if (typeof data !== "object" || data === null) {
      const actualObjectType = data === null ? "null" : typeof data;
      problems.push(`${path}\nExpected a YAML object, got ${actualObjectType}`);

      continue;
    }

    const parsed = schema.safeParse({ ...data, slug });

    if (parsed.success) {
      items.push(parsed.data);
    } else {
      problems.push(`${path}\n${z.prettifyError(parsed.error)}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Invalid content:\n\n${problems.join("\n\n")}`);
  }

  return items;
}
