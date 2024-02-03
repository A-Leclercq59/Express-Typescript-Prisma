import { z } from "zod";

export const authorSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "Firstname is required!",
    }),
    lastName: z.string({
      required_error: "Lastname is required!",
    }),
  }),
});
