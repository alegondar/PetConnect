import { z } from "zod";

export const RankingEntry = z.object({
  rank: z.number().int(),
  pet_id: z.string().uuid(),
  pet_name: z.string(),
  pet_photo_url: z.string().url().nullable().optional(),
  owner_username: z.string(),
  likes_this_week: z.number().int(),
  updated_at: z.string(),
});

export const RankingResponse = z.object({
  items: z.array(RankingEntry),
  updated_at: z.string(),
});

export type RankingEntry = z.infer<typeof RankingEntry>;
export type RankingResponse = z.infer<typeof RankingResponse>;
