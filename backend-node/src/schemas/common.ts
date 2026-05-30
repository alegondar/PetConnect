import { z } from "zod";

export const ErrorResponse = z.object({
  detail: z.string(),
});

export const PaginatedResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pages: z.number(),
  });
