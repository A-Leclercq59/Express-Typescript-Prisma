import { z } from "zod";

export const bookSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required!",
    }),
    datePublished: z.string({
      required_error: "DatePublished is required!",
    }),
    isFiction: z.boolean({
      required_error: "IsFiction is required!",
    }),
    authorId: z.number({
      required_error: "AuthorId is required",
    }),
  }),
});
