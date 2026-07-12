## Context

PetConnect actualmente envuelve **todas** las rutas en `<ProtectedRoute>`, que redirige a `/login` si no hay token. Los backends (`backend-node/` y `backend-worker/`) ya exponen los endpoints de lectura como públicos (GET sin auth), pero el frontend nunca llega a consultarlos porque la redirección ocurre antes. Además, el interceptor 401 de Axios limpia `localStorage` y redirige agresivamente incluso para requests anónimos, lo que hace imposible manejar errores 401 con gracia.

## Goals / Non-Goals

**Goals:**
- Permitir navegación pública a `/feed`, `/pet-friendly`, `/lost-pets`, `/lost-pets/:id`, `/adoptions`.
- Mostrar un modal contextual de login al intentar acciones protegidas, sin redirigir ni recargar.
- Mantener el comportamiento actual para usuarios autenticados (sin regresiones).
- Cero cambios en backends.

**Non-Goals:**
- No se tocan `backend-node/` ni `backend-worker/`.
- No se agregan nuevas dependencias npm.
- No se modifica el sistema de auth de Supabase ni las políticas RLS.

## Decisions

### 1. Remover `<ProtectedRoute>` selectivamente en lugar de hacerlo condicional

**Alternativa considerada**: hacer que `ProtectedRoute` acepte un prop `requireAuth={false}` y decida internamente.  
**Decisión**: simplemente eliminar el wrapper de las rutas públicas. Es más limpio, reduce complejidad, y no obliga a modificar `ProtectedRoute`. Las rutas públicas renderizan su página directamente; las protegidas mantienen el wrapper.

### 2. Interceptor 401: detectar si había token previo

**Alternativa considerada**: crear un segundo cliente Axios para requests anónimos.  
**Decisión**: modificar el interceptor existente para que, antes de limpiar y redirigir, verifique si `localStorage` contenía un token al momento de recibir el 401. Si no había token → el request fue anónimo, no se redirige. Si había token → sesión expirada, se limpia y redirige (comportamiento actual). Esto minimiza cambios y no requiere refactor de todos los llamadores.

### 3. `LoginPromptModal` como componente separado, consistente con modales existentes

**Alternativa considerada**: hook `useRequireAuth()` que devuelva un handler.  
**Decisión**: componente modal declarativo, siguiendo el patrón de `FollowersModal`, `FollowingModal` y `CreatePostModal` (open/onClose props, Tailwind, backdrop con blur). Cada componente de acción maneja su propio estado `showLoginModal`. Esto es más simple de integrar y consistente con la codebase.

### 4. Mensaje adaptado por acción vía prop `action`

El modal recibe un `action?: string` opcional. Si se provee, muestra "Creá tu cuenta gratis para {action}". Si no, un mensaje genérico. Los llamadores pasan strings cortos como `"dar like"`, `"comentar"`, `"seguir a esta mascota"`.

## Risks / Trade-offs

- **[Riesgo]** Usuarios autenticados que pierdan su token por vencimiento: el interceptor detecta que había token → limpia y redirige. Funciona igual que hoy.  
- **[Riesgo]** Algún componente de acción podría no estar cubierto en esta iteración (ej: botón en servicios, follow en instapet). → Mitigación: revisar exhaustivamente todos los puntos de mutación en la tarea 4. Si se escapa alguno, el 401 seguirá manejándose por el interceptor (sin redirigir para anónimos) y el usuario simplemente no verá feedback — baja severidad, se corrige en follow-up.
- **[Trade-off]** El modal no cubre acciones iniciadas desde hooks o efectos (ej: like automático). Pero no existen tales patrones hoy — todas las acciones se disparan desde `onClick`.
