import { z } from "zod";

export const ReaviewSchema = z.object({
  review: z.string().min(1),
  rating: z.number().min(1).max(5),
});

export type Review = z.infer<typeof ReaviewSchema>;
