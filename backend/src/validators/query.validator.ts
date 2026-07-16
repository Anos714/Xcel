import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().uuidv7({ message: "Invalid UUID format" }),
});

const querySchema = z.object({
  query: z.string({ message: "Query is required" }).trim(),
});

const updateQuerySchema = z.object({
  active: z.boolean({ message: "Query status is required" }),
});

export { paramsSchema, querySchema, updateQuerySchema };
