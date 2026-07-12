## Why

PetConnect hoy bloquea todo el contenido detrás de login, incluso el feed público, mascotas perdidas, adopciones y lugares pet-friendly. Un visitante sin cuenta no puede ver nada del valor de la app antes de decidir registrarse, lo cual reduce conversión y descubrimiento orgánico. Los backends ya exponen esos endpoints públicos — falta que el frontend lo refleje.

## What Changes

- **Rutas públicas**: `/feed`, `/pet-friendly`, `/lost-pets`, `/lost-pets/:id`, `/adoptions` dejan de requerir autenticación. Se elimina el wrapper `<ProtectedRoute>` de esas rutas en `App.tsx`.
- **Interceptor 401 inteligente**: el interceptor de Axios distingue entre sesión expirada (token previo + 401 = limpiar y redirigir) y request anónimo (sin token + 401 = dejar que el componente maneje el error).
- **Modal de login contextual**: nuevo `LoginPromptModal` reutilizable que se muestra al intentar una acción protegida sin sesión (like, comentar, publicar, seguir, contactar servicio), con mensaje adaptado a la acción y botones a `/login` y `/register`.
- **Sin cambios en backends**: `backend-node/` y `backend-worker/` no se tocan.

## Capabilities

### New Capabilities
- `public-browsing`: permitir que visitantes sin cuenta naveguen y lean contenido público (feed, mascotas perdidas, adopciones, pet-friendly) sin autenticación.
- `login-prompt-modal`: modal contextual que invita al usuario a registrarse o loguearse al intentar una acción que requiere autenticación.

### Modified Capabilities
<!-- Ninguno — no se modifican specs existentes -->

## Impact

- **`frontend/src/App.tsx`**: remover `<ProtectedRoute>` de 5 rutas públicas.
- **`frontend/src/api/client.ts`**: corregir el interceptor de respuesta 401.
- **`frontend/src/components/LoginPromptModal.tsx`**: nuevo componente.
- **`frontend/src/components/PostCard.tsx`** y componentes de acción (follow, servicios): integrar `LoginPromptModal`.
- **Backends**: sin cambios.
