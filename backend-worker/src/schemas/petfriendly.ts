import { z } from "zod";
import { PaginatedResponse } from "./common.js";

export const categoriaEnum = z.enum([
  "cafeteria",
  "bar_restaurante",
  "hotel",
  "experiencia",
]);

export const CreatePetFriendlyPlaceRequest = z.object({
  nombre: z.string(),
  categoria: categoriaEnum,
  direccion: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  descripcion: z.string().optional().nullable(),
  foto_url: z.string().url().optional().nullable(),
});

export const PetFriendlyPlace = z.object({
  id: z.string().uuid(),
  nombre: z.string(),
  categoria: categoriaEnum,
  direccion: z.string().nullable().optional(),
  lat: z.number(),
  lng: z.number(),
  descripcion: z.string().nullable().optional(),
  foto_url: z.string().url().nullable().optional(),
  fuente: z.string(),
  verificado: z.boolean(),
  created_by: z.string().uuid().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export const PaginatedPetFriendlyPlaces = PaginatedResponse(PetFriendlyPlace);

export type CreatePetFriendlyPlaceRequest = z.infer<typeof CreatePetFriendlyPlaceRequest>;
export type PetFriendlyPlace = z.infer<typeof PetFriendlyPlace>;
