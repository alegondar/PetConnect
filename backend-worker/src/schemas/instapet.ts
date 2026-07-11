import { z } from "zod";
import { Profile } from "./auth.js";
import { Pet } from "./pets.js";
import { PaginatedResponse } from "./common.js";

export const CreateInstaPetPostRequest = z.object({
  photo_url: z.string().url().optional().nullable(),
  video_url: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const InstaPetPost = z.object({
  id: z.string().uuid(),
  pet_id: z.string().uuid(),
  author_id: z.string().uuid(),
  photo_url: z.string().url().nullable().optional(),
  video_url: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
  likes_count: z.number().int(),
  comments_count: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
  author: Profile.optional(),
});

export const InstaPetPostDetail = InstaPetPost.extend({
  pet: Pet.optional(),
});

export const InstaPetFollower = z.object({
  id: z.string().uuid(),
  follower_id: z.string().uuid(),
  pet_id: z.string().uuid(),
  created_at: z.string(),
  follower: Profile.optional(),
});

export const FollowingPet = z.object({
  pet_id: z.string().uuid(),
  pet_name: z.string(),
  pet_photo_url: z.string().url().nullable().optional(),
  species: z.string(),
  followed_at: z.string(),
});

export const CreateMilestoneRequest = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
  milestone_date: z.string(),
});

export const InstaPetMilestone = z.object({
  id: z.string().uuid(),
  pet_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
  milestone_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const PaginatedInstaPetPosts = PaginatedResponse(InstaPetPost);
export const PaginatedFollowers = PaginatedResponse(InstaPetFollower);
export const PaginatedFollowing = PaginatedResponse(FollowingPet);
export const PaginatedMilestones = PaginatedResponse(InstaPetMilestone);

export type CreateInstaPetPostRequest = z.infer<typeof CreateInstaPetPostRequest>;
export type InstaPetPost = z.infer<typeof InstaPetPost>;
export type InstaPetPostDetail = z.infer<typeof InstaPetPostDetail>;
export type InstaPetFollower = z.infer<typeof InstaPetFollower>;
export type FollowingPet = z.infer<typeof FollowingPet>;
export type CreateMilestoneRequest = z.infer<typeof CreateMilestoneRequest>;
export type InstaPetMilestone = z.infer<typeof InstaPetMilestone>;
