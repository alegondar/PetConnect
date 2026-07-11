import { z } from "zod";

export const ServiceType = z.enum(["paseador", "cuidador", "veterinario", "peluqueria"]);
export const ServiceStatus = z.enum(["activo", "pausado", "cerrado"]);
export const PriceUnit = z.enum(["por visita", "por hora", "por día"]);

export const CreateOfferRequest = z.object({
  service_type: ServiceType,
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  price_from: z.number().positive().optional(),
  price_to: z.number().positive().optional(),
  price_unit: PriceUnit.optional(),
  location: z.string().min(3),
  lat: z.number().optional(),
  lng: z.number().optional(),
  available_days: z.array(z.string()).optional(),
  photo_url: z.string().url().optional(),
});

export const UpdateOfferRequest = z.object({
  service_type: ServiceType.optional(),
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(1000).optional(),
  price_from: z.number().positive().optional().nullable(),
  price_to: z.number().positive().optional().nullable(),
  price_unit: PriceUnit.optional().nullable(),
  location: z.string().min(3).optional(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  available_days: z.array(z.string()).optional(),
  photo_url: z.string().url().optional().nullable(),
  status: ServiceStatus.optional(),
});

export const CreateRequestRequest = z.object({
  service_type: ServiceType,
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  pet_id: z.string().uuid().optional(),
  frequency_per_week: z.number().int().min(1).max(21).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().min(3),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const UpdateRequestRequest = z.object({
  service_type: ServiceType.optional(),
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(1000).optional(),
  pet_id: z.string().uuid().optional().nullable(),
  frequency_per_week: z.number().int().min(1).max(21).optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  location: z.string().min(3).optional(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  status: ServiceStatus.optional(),
});

export const ContactMessageRequest = z.object({
  message: z.string().min(10).max(500),
});
