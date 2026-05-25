## Context

El frontend actual es un scaffold de Vite + React + TypeScript sin lógica de negocio. El contrato `docs/openapi.yaml` define ~47 operaciones que deben consumirse desde la UI siguiendo la guía visual del diseñador (paleta #D946EF, mobile-first, shadcn/ui).

## Goals / Non-Goals

**Goals:**
- Todas las páginas definidas en los features v1 funcionales
- API client con Axios interceptando JWT automáticamente
- React Query para fetching/mutaciones con caché
- Zustand para estado global de auth
- Tailwind con tokens de color del diseñador
- Mobile-first (375px base)

**Non-Goals:**
- PWA / Service Workers
- Animaciones complejas
- Tests (los hará tester-agent)
- Deploy a Vercel

## Decisions

- **React Query v5 sobre SWR**: Mejor DX para mutaciones, invalidación de caché y optimistic updates. Alternativa: SWR — descartado por menor soporte de mutaciones.
- **Zustand sobre Redux/Context**: API mínima, sin boilerplate, tipado nativo. Alternativa: Context API — descartado por re-renders innecesarios en árboles grandes.
- **Páginas con lazy loading**: `React.lazy()` + `Suspense` para code splitting por ruta.
- **Bottom tab navigation mobile-first**: Barra de navegación inferior con iconos para mobile, sidebar en desktop.

## Risks / Trade-offs

- **[Riesgo] React Query cache puede servir datos stale** → Mitigación: `staleTime: 30_000` para listas, invalidar en mutaciones
- **[Riesgo] Sin UI library completa, más código manual** → Mitigación: shadcn/ui provee componentes base bien estilizados con Tailwind
