## 1. Backend — Cambio de puerto por defecto

- [x] 1.1 Cambiar el valor por defecto de `8000` a `8001` en `backend-node/src/index.ts` (línea `const PORT = Number(process.env.PORT) || 8000`)
- [x] 1.2 Actualizar `PORT=8000` → `PORT=8001` en `backend-node/.env`
- [x] 1.3 Actualizar `PORT=8000` → `PORT=8001` en `backend-node/.env.example`

## 2. Backend Worker — Actualizar archivo de ejemplo

- [x] 2.1 Actualizar `PORT=8000` → `PORT=8001` en `backend-worker/.env.example`

## 3. Frontend — Actualizar proxy de desarrollo

- [x] 3.1 Cambiar `target: 'http://localhost:8000'` → `target: 'http://localhost:8001'` en `frontend/vite.config.ts`

## 4. Documentación — Actualizar referencias al puerto

- [x] 4.1 Cambiar `url: http://localhost:8000/api/v1` → `url: http://localhost:8001/api/v1` en `docs/openapi.yaml`
- [x] 4.2 Actualizar todas las referencias a `:8000` por `:8001` en `README.md`

## 5. Verificación

- [x] 5.1 Verificar que el backend arranca en `:8001` ejecutando `npm run dev` en `backend-node/`
- [x] 5.2 Verificar que el proxy del frontend funciona correctamente con el nuevo puerto
- [x] 5.3 Verificar que no quedan referencias huérfanas a `:8000` en archivos activos del proyecto (`grep -r "8000" --include="*.ts" --include="*.yaml" --include="*.env*" --include="*.md"` excluyendo openspec/)
