## Why

El frontend de PetConnect solo funciona en local con el proxy de Vite. Necesitamos desplegarlo en Cloudflare Pages para que sea accesible públicamente, manteniendo intacto el flujo de desarrollo local.

## What Changes

- Introducir `VITE_API_URL` como variable de entorno para la URL base del backend
- Modificar `src/api/client.ts` para usar `VITE_API_URL` en producción y mantener el proxy relativo en desarrollo
- Crear `.env.production` con la URL del backend en Cloudflare Workers
- Mantener `.env` existente sin cambios (solo Supabase, sin API URL)

## Capabilities

### New Capabilities
- `cloudflare-pages-deploy`: Configuración de build y despliegue del frontend en Cloudflare Pages, con separación de entornos dev/prod mediante variables de entorno de Vite

### Modified Capabilities
<!-- None: no existing spec changes -->

## Impact

- `frontend/src/api/client.ts`: lectura condicional de `VITE_API_URL`
- `frontend/.env.production`: nuevo archivo (no existe)
- `frontend/.env`: sin cambios
- `frontend/vite.config.ts`: sin cambios (el proxy sigue funcionando para `npm run dev`)
- No afecta al backend ni a la base de datos
