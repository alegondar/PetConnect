## Context

PetConnect ya tiene definida la estructura base del monorepo y los features v1. Se necesita un conjunto de agentes de OpenCode que automaticen el flujo de desarrollo full-stack de forma orquestada y reproducible. Cada agente se especializa en una fase del ciclo de desarrollo.

## Goals / Non-Goals

**Goals:**
- Definir 9 agentes en `.opencode/agents/*.md` con roles y responsabilidades claras
- Establecer un flujo de orquestación secuencial: schemas → specs → implementación → tests → revisión → docs
- Cada agente debe declarar explícitamente sus inputs, outputs y orden de ejecución
- El orquestador debe poder delegar tareas en el orden correcto sin intervención manual

**Non-Goals:**
- Implementar lógica de negocio o features concretos
- Configurar los agentes como subagents de OpenCode (solo definirlos)
- Integrar con CI/CD externo

## Decisions

- **Formato markdown con frontmatter YAML**: Se elige frontmatter para metadata estructurada (inputs, outputs, orden). Alternativa considerada: JSON puro — descartado por menor legibilidad humana.
- **Orquestador como entry point único**: Centraliza la lógica de secuenciación en vez de encadenar llamadas entre agentes. Esto evita dependencias circulares y permite modificar el orden fácilmente.
- **Dos tracks paralelos después de openapi**: backend-agent y frontend-agent + designer-agent se ejecutan en paralelo ya que no dependen entre sí, optimizando el tiempo. Se unen en tester-agent.
- **Nombrado kebab-case para archivos**: Coincide con convención de OpenCode (db-agent.md, backend-agent.md, etc).

## Risks / Trade-offs

- **[Riesgo] El orquestador puede desincronizarse si se modifica un agente** → Mitigación: el orquestador referencia agentes por nombre de archivo, no por contenido interno
- **[Riesgo] Agentes muy acoplados a docs/ como fuente de verdad** → Mitigación: usar `docs/openapi.yaml` como contrato explícito entre backend y frontend; cualquier cambio en schema requiere regenerar openapi.yaml
