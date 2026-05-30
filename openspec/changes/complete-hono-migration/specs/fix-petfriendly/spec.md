## fix-petfriendly — Schema y creación completos

### Problemas

1. Schema `categoriaEnum` de Hono tiene 7 valores, FastAPI y la DB tienen 4: `cafeteria`, `bar_restaurante`, `hotel`, `experiencia`
2. Al crear, FastAPI agrega `fuente: "usuario"` que Hono omite
3. Schema de respuesta no incluye `fuente` ni `verificado`

### Fix

**Schema categorías** (igual a FastAPI):
```typescript
export const categoriaEnum = z.enum([
  "cafeteria", "bar_restaurante", "hotel", "experiencia",
]);
```

**Schema respuesta** (agregar campos faltantes):
```typescript
export const PetFriendlyPlace = z.object({
  id: z.string().uuid(),
  nombre: z.string(),
  categoria: categoriaEnum,
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
```

**Crear lugar** (agregar `fuente`):
```typescript
await supabaseAdmin.from("pet_friendly_places").insert({
  ...data,
  created_by: userId,
  fuente: "usuario",
});
```

### Verificación

- `POST /api/v1/pet-friendly` con categoría válida funciona
- Respuesta incluye `fuente` y `verificado`
- Categoría inválida retorna error de validación
