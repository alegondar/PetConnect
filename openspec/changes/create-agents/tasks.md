## 1. Directorio y orquestador

- [x] 1.1 Crear directorio `.opencode/agents/`
- [x] 1.2 Crear `orchestrator.md` con descripción, responsabilidades, inputs, outputs y orden de ejecución de todos los agentes

## 2. Agentes de diseño y especificación

- [x] 2.1 Crear `designer.md` con paleta de colores, tipografía, componentes UI y enfoque mobile-first
- [x] 2.2 Crear `db-agent.md` con responsabilidad de diseñar `docs/db_schema.sql` (PostgreSQL + Supabase)
- [x] 2.3 Crear `openapi-agent.md` con responsabilidad de generar `docs/openapi.yaml` desde `db_schema.sql`

## 3. Agentes de implementación

- [x] 3.1 Crear `backend-agent.md` con responsabilidad de implementar FastAPI desde `openapi.yaml`
- [x] 3.2 Crear `frontend-agent.md` con responsabilidad de implementar React + Vite + Tailwind desde `openapi.yaml` y la guía del diseñador

## 4. Agentes de verificación y documentación

- [x] 4.1 Crear `tester.md` con responsabilidad de generar tests pytest (backend) y vitest (frontend)
- [x] 4.2 Crear `reviewer.md` con responsabilidad de revisar código, detectar errores y sugerir mejoras
- [x] 4.3 Crear `documenter.md` con responsabilidad de generar documentación técnica, CHECKLIST.md y actualizar README.md
