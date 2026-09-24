import * as z from "zod";
import { richtext } from "./fields";

export const aboutPageSchema = z.object({
  avatar: z.httpUrl(),
  body: richtext,
});

export const contactsSchema = z.object({
  email: z.email(),
  socials: z
    .array(
      z.object({
        platform: z.enum(["artstation", "linkedin", "telegram"]),
        url: z.httpUrl(),
      }),
    )
    .default([]),
});

export const settingsSchema = z.object({
  sorting: z
    .object({
      tools_alphabetical: z.boolean().default(false),
      tags_alphabetical: z.boolean().default(false),
    })
    .prefault({}),
});
