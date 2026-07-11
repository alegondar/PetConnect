import { z } from "zod";
import { PaginatedResponse } from "./common.js";

export const CreatePetRequest = z.object({
  name: z.string(),
  species: z.string(),
  breed: z.string().optional().nullable(),
  age: z.number().int().optional().nullable(),
  weight: z.number().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const UpdatePetRequest = z.object({
  name: z.string().optional(),
  species: z.string().optional(),
  breed: z.string().optional().nullable(),
  age: z.number().int().optional().nullable(),
  weight: z.number().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const Pet = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  name: z.string(),
  species: z.string(),
  breed: z.string().nullable().optional(),
  age: z.number().int().nullable().optional(),
  weight: z.number().nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateVetVisitRequest = z.object({
  vet_name: z.string(),
  visit_date: z.string(),
  reason: z.string(),
  notes: z.string().optional().nullable(),
});

export const VetVisit = z.object({
  id: z.string().uuid(),
  pet_id: z.string().uuid(),
  vet_name: z.string(),
  visit_date: z.string(),
  reason: z.string(),
  notes: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const eventTypeEnum = z.enum([
  "vaccination",
  "weight",
  "deworming",
  "medication",
  "other",
]);

export const CreatePetEventRequest = z.object({
  event_type: eventTypeEnum,
  event_date: z.string(),
  value: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const PetEvent = z.object({
  id: z.string().uuid(),
  pet_id: z.string().uuid(),
  event_type: eventTypeEnum,
  event_date: z.string(),
  value: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const PaginatedPets = PaginatedResponse(Pet);
export const PaginatedVetVisits = PaginatedResponse(VetVisit);
export const PaginatedPetEvents = PaginatedResponse(PetEvent);

export type CreatePetRequest = z.infer<typeof CreatePetRequest>;
export type UpdatePetRequest = z.infer<typeof UpdatePetRequest>;
export type Pet = z.infer<typeof Pet>;
export type CreateVetVisitRequest = z.infer<typeof CreateVetVisitRequest>;
export type VetVisit = z.infer<typeof VetVisit>;
export type CreatePetEventRequest = z.infer<typeof CreatePetEventRequest>;
export type PetEvent = z.infer<typeof PetEvent>;
