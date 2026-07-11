## 1. Configuración de variables de entorno

- [x] 1.1 Crear `frontend/.env.production` con `VITE_API_URL=https://petconnect-backend.osama-petconnet.workers.dev/api/v1`
- [x] 1.2 Verificar que `frontend/.env` no se modifica (solo contiene Supabase)

## 2. Actualizar cliente API

- [x] 2.1 Modificar `frontend/src/api/client.ts`: cambiar `baseURL: '/api/v1'` por `baseURL: import.meta.env.VITE_API_URL || '/api/v1'`

## 3. Verificar build de producción

- [x] 3.1 Verificar que `tsconfig.app.json` y `tsconfig.json` no requieren cambios para el build
- [x] 3.2 Ejecutar `npm run build` en `frontend/` y confirmar que termina sin errores
- [x] 3.3 Confirmar que la carpeta de salida `dist/` contiene `index.html`, assets JS/CSS

## 4. Verificar disponibilidad de Wrangler

- [x] 4.1 Ejecutar `npx wrangler --version` en `frontend/` para confirmar que wrangler está disponible sin instalación adicional
- [x] 4.2 Si wrangler no está disponible, instalarlo como devDependency: `npm install -D wrangler` en `frontend/`

## 5. Revisión previa al deploy

- [x] 5.1 Revisar el contenido de `dist/` y confirmar que los assets se generaron correctamente
- [x] 5.2 Verificar que el backend acepta requests desde el futuro dominio de Cloudflare Pages (CORS)
- [ ] 5.3 Ejecutar deploy a Cloudflare Pages con `npx wrangler pages deploy dist/`
