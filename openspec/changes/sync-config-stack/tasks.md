## 1. IDEA.md — Reglas de carpetas de backend

- [x] 1.1 Agregar sección `## Reglas de carpetas de backend (crítico)` al final de IDEA.md con las reglas especificadas: backend/ deprecado, backend-node/ activo, backend-worker/ solo bajo pedido explícito, prohibición de wrangler deploy sin orden explícita, prohibición de modificar .env sin orden explícita, y obligación de preguntar ante ambigüedad.

## 2. openspec/config.yaml — Sincronización del stack

- [x] 2.1 Actualizar bloque `context` de `config.yaml`: reemplazar FastAPI por Hono 4.7 + TypeScript 5.8, React 18 por React 19, Tailwind CSS v3 por Tailwind CSS v4 (plugin Vite), y actualizar estructura del monorepo para reflejar backend-node/, backend/ (deprecated), backend-worker/ (Cloudflare).
- [x] 2.2 Verificar que el bloque `rules` (proposal, design, tasks, specs) queda intacto sin cambios.

## 3. Verificación

- [x] 3.1 Leer ambos archivos modificados y verificar visualmente que no hay referencias al stack viejo (FastAPI como backend activo, Tailwind v3, React 18).
- [x] 3.2 Confirmar que las reglas de carpetas en IDEA.md son consistentes con lo declarado en el design.md.
