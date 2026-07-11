import { z } from "zod";

export const UserProfile = z.object({
  id: z.string().uuid(),
  username: z.string(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  followers_count: z.number().int(),
  following_count: z.number().int(),
  posts_count: z.number().int(),
  is_following: z.boolean(),
});

export const UserListItem = z.object({
  id: z.string().uuid(),
  username: z.string(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  followers_count: z.number().int(),
  is_following: z.boolean(),
});

export const FollowResponse = z.object({
  detail: z.string(),
});

export const UserSearchQuery = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export type UserProfile = z.infer<typeof UserProfile>;
export type UserListItem = z.infer<typeof UserListItem>;
export type FollowResponse = z.infer<typeof FollowResponse>;
export type UserSearchQuery = z.infer<typeof UserSearchQuery>;
