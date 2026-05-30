import { z } from "zod";

export const RegisterRequest = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string(),
});

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const UpdateProfileRequest = z.object({
  username: z.string().optional(),
  avatar_url: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const Profile = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  username: z.string(),
  avatar_url: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AuthResponse = z.object({
  access_token: z.string(),
  token_type: z.string(),
  profile: Profile,
});

export type RegisterRequest = z.infer<typeof RegisterRequest>;
export type LoginRequest = z.infer<typeof LoginRequest>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequest>;
export type Profile = z.infer<typeof Profile>;
export type AuthResponse = z.infer<typeof AuthResponse>;
