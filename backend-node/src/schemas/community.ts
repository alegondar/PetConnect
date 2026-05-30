import { z } from "zod";
import { Profile } from "./auth.js";
import { Pet } from "./pets.js";
import { PaginatedResponse } from "./common.js";

export const lostPetStatusEnum = z.enum(["lost", "found"]);

export const CreateLostPetRequest = z.object({
  name: z.string(),
  species: z.string(),
  breed: z.string().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
  last_seen_lat: z.number(),
  last_seen_lng: z.number(),
  last_seen_address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const UpdateLostPetRequest = z.object({
  name: z.string().optional(),
  species: z.string().optional(),
  breed: z.string().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
  last_seen_lat: z.number().optional(),
  last_seen_lng: z.number().optional(),
  last_seen_address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: lostPetStatusEnum.optional(),
});

export const LostPet = z.object({
  id: z.string().uuid(),
  reporter_id: z.string().uuid(),
  name: z.string(),
  species: z.string(),
  breed: z.string().nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
  last_seen_lat: z.number(),
  last_seen_lng: z.number(),
  last_seen_address: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: lostPetStatusEnum,
  created_at: z.string(),
  updated_at: z.string(),
});

export const LostPetDetail = LostPet.extend({
  reporter: Profile.optional(),
});

export const adoptionStatusEnum = z.enum(["available", "pending", "adopted"]);

export const CreateAdoptionRequest = z.object({
  pet_id: z.string().uuid(),
  description: z.string().optional().nullable(),
});

export const UpdateAdoptionRequest = z.object({
  status: adoptionStatusEnum.optional(),
  adopter_id: z.string().uuid().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const Adoption = z.object({
  id: z.string().uuid(),
  pet_id: z.string().uuid(),
  owner_id: z.string().uuid(),
  adopter_id: z.string().uuid().nullable().optional(),
  status: adoptionStatusEnum,
  description: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AdoptionDetail = Adoption.extend({
  pet: Pet.optional(),
  owner: Profile.optional(),
  adopter: Profile.optional(),
});

export const PaginatedLostPets = PaginatedResponse(LostPet);
export const PaginatedAdoptions = PaginatedResponse(Adoption);

export type LostPetStatus = z.infer<typeof lostPetStatusEnum>;
export type CreateLostPetRequest = z.infer<typeof CreateLostPetRequest>;
export type UpdateLostPetRequest = z.infer<typeof UpdateLostPetRequest>;
export type LostPet = z.infer<typeof LostPet>;
export type LostPetDetail = z.infer<typeof LostPetDetail>;
export type AdoptionStatus = z.infer<typeof adoptionStatusEnum>;
export type CreateAdoptionRequest = z.infer<typeof CreateAdoptionRequest>;
export type UpdateAdoptionRequest = z.infer<typeof UpdateAdoptionRequest>;
export type Adoption = z.infer<typeof Adoption>;
export type AdoptionDetail = z.infer<typeof AdoptionDetail>;
