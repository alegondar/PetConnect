import { z } from "zod";
import { Profile } from "./auth.js";
import { Pet } from "./pets.js";
import { PaginatedResponse } from "./common.js";

export const CreatePostRequest = z.object({
  pet_id: z.string().uuid(),
  content: z.string().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
});

export const CreateCommentRequest = z.object({
  content: z.string(),
});

export const UpdatePostRequest = z.object({
  content: z.string().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
});

export const Like = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  post_id: z.string().uuid(),
  created_at: z.string(),
});

export const Comment = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  post_id: z.string().uuid(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  author: Profile.optional(),
});

export const Post = z.object({
  id: z.string().uuid(),
  author_id: z.string().uuid(),
  pet_id: z.string().uuid(),
  content: z.string().nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
  likes_count: z.number().int(),
  comments_count: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
  author: Profile.optional(),
  pet: Pet.optional(),
});

export const PostDetail = Post.extend({
  liked_by_me: z.boolean(),
});

export const PaginatedPosts = PaginatedResponse(Post);
export const PaginatedComments = PaginatedResponse(Comment);

export type CreatePostRequest = z.infer<typeof CreatePostRequest>;
export type CreateCommentRequest = z.infer<typeof CreateCommentRequest>;
export type Like = z.infer<typeof Like>;
export type Comment = z.infer<typeof Comment>;
export type Post = z.infer<typeof Post>;
export type PostDetail = z.infer<typeof PostDetail>;
