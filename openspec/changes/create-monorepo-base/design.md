## Context

PetConnect es un proyecto nuevo sin estructura de código existente. Se necesita establecer un monorepo que contenga backend (FastAPI), frontend (React + Vite) y documentación, sentando las bases para el desarrollo future.

## Goals / Non-Goals

**Goals:**
- Estructura de carpetas clara y separada por dominio (backend, frontend, docs)
- Backend listo para empezar a desarrollar con FastAPI
- Frontend configurado con React + Vite usando pnpm como gestor de paquetes
- Archivo `openapi.yaml` como placeholder para documentación de API
- README.md descriptivo con tecnologías y setup inicial
- `.gitignore` global que cubra Python, Node.js y archivos comunes

**Non-Goals:**
- Implementar lógica de negocio
- Definir modelos de datos
- Configurar CI/CD
- Desplegar a producción

## Decisions

- **Monorepo vs multi-repo**: Se elige monorepo para facilitar la coordinación entre backend y frontend en etapa temprana. Alternativa considerada: múltiples repositorios — se descarta por sobrecarga de gestión.
- **pnpm como gestor de paquetes**: Se elige pnpm sobre npm/yarn por su eficiencia en espacio en disco y velocidad en monorepos. El monorepo frontend usará `pnpm-workspace.yaml`.
- **FastAPI sobre Django/Flask**: FastAPI ofrece tipado moderno, rendimiento async y generación automática de OpenAPI. Alternativa considerada: Django — se descarta por ser demasiado pesado para una API REST inicial.
- **React + Vite sobre Next.js/CRA**: Vite ofrece desarrollo rápido con HMR nativo. Alternativa considerada: Next.js — se descarta porque no necesitamos SSR inicialmente.

## Risks / Trade-offs

- **[Riesgo] Estructura de monorepo puede volverse compleja si crece mucho** → Mitigación: mantener separación clara por directorios desde el inicio
- **[Riesgo] pnpm requiere instalación global** → Mitigación: documentar en README cómo instalarlo (`npm i -g pnpm` o `corepack enable`)
