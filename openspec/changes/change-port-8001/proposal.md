## Why

El puerto por defecto del servidor Hono (`8000`) colisiona con Portainer en el entorno de desarrollo, impidiendo que el backend arranque sin intervención manual. Cambiar el puerto por defecto a `8001` elimina esta fricción sin afectar la semántica del proyecto.

## What Changes

- Cambiar el puerto por defecto del servidor Hono de `8000` a `8001` en `src/index.ts`
- **BREAKING**: El backend ya no escucha en `:8000` — todas las referencias externas deben apuntar a `:8001`
- Actualizar `PORT=8001` en `.env` y `.env.example` de `backend-node/`
- Actualizar el proxy del frontend en `vite.config.ts` para apuntar a `http://localhost:8001`
- Actualizar la URL del servidor en `docs/openapi.yaml` a `http://localhost:8001`
- Actualizar `README.md` con las nuevas referencias de puerto
- La variable de entorno `PORT` ya es soportada, solo se ajusta el valor por defecto

## Capabilities

### New Capabilities

- `port-configuration`: El servidor Hono expone el puerto como variable de entorno `PORT` con valor por defecto `8001`, eliminando la colisión con Portainer en desarrollo.

### Modified Capabilities

<!-- No se modifican capacidades existentes a nivel de especificación. -->

## Impact

- **backend-node/src/index.ts**: cambio de valor por defecto en línea 21
- **backend-node/.env** y **.env.example**: `PORT=8000` → `PORT=8001`
- **backend-worker/.env.example**: `PORT=8000` → `PORT=8001`
- **frontend/vite.config.ts**: target del proxy `localhost:8000` → `localhost:8001`
- **docs/openapi.yaml**: server URL actualizada
- **README.md**: referencias al puerto `8000` actualizadas
