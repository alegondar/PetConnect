## Context

El frontend (`frontend/`) usa un proxy de Vite en desarrollo que redirige `/api` → `http://localhost:8000`. El cliente axios en `src/api/client.ts` tiene `baseURL: '/api/v1'` hardcodeado como ruta relativa. Esto funciona en local pero falla en Cloudflare Pages porque la API está en un origen distinto (`https://petconnect-backend.osama-petconnet.workers.dev`).

No existe actualmente una variable `VITE_API_URL` ni archivo `.env.production`.

## Goals / Non-Goals

**Goals:**
- Permitir que el frontend haga llamadas API a un backend remoto en producción
- Mantener el proxy local intacto para desarrollo
- Usar el mecanismo nativo de Vite para variables de entorno por modo
- No modificar la lógica de autenticación ni endpoints

**Non-Goals:**
- Cambiar el backend o su URL de producción
- Modificar el workflow de build (`tsc -b && vite build`)
- Tocar `.env` existente (solo Supabase)

## Decisions

### 1. Usar `VITE_API_URL` como variable de entorno

**Alternativa A**: Variable global en `client.ts` con valor hardcodeado por entorno.
→ Rechazada: requeriría lógica manual de detección de entorno.

**Alternativa B**: Configurar un proxy en Cloudflare Pages (`_redirects` o `wrangler.toml`).
→ Rechazada: Cloudflare Pages no soporta proxy reverso; solo sirve assets estáticos y Functions.

**Alternativa C (elegida)**: Variable `VITE_API_URL` en `.env.production`.
Vite inyecta `import.meta.env.VITE_API_URL` en tiempo de build según el modo. En `npm run dev` (modo `development`), el proxy de Vite sigue funcionando porque `VITE_API_URL` no está definida en `.env` ni `.env.development`. En `npm run build` (modo `production`), Vite carga `.env.production` automáticamente.

### 2. Modificar `client.ts` para leer `VITE_API_URL`

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
})
```

Si `VITE_API_URL` está definida (producción), se usa como base absoluta. Si no (desarrollo), se usa la ruta relativa que el proxy de Vite maneja.

**Alternativa**: Dos archivos de cliente separados.
→ Rechazada: duplica código sin beneficio.

### 3. `.env.production` solo contiene `VITE_API_URL`

Las credenciales de Supabase ya están en `.env` (compartido para todos los entornos). Solo se necesita sobrescribir la URL de API para producción.

## Risks / Trade-offs

- **[CORS]**: El backend ya debe tener configurado CORS para aceptar requests desde el dominio de Cloudflare Pages. → Verificar que `FRONTEND_ORIGIN` en el backend incluya el dominio de Pages.
- **[HTTPS mixed content]**: Si Cloudflare Pages sirve en HTTPS y la API también, no hay problema. Si la API estuviera en HTTP, el navegador bloquearía las requests. → Ambas están en HTTPS.
- **[Build cache]**: Si se cambia `.env.production`, hay que hacer build limpio. → Documentar en tasks.md.
