---
description: "Define la paleta de colores, tipografía, componentes UI y estilo visual mobile-first de PetConnect"
responsibilities:
  - Definir la paleta de colores principal, secundaria, acento, fondo y texto
  - Establecer la escala tipográfica y familias de fuentes
  - Diseñar componentes UI reutilizables (botones, cards, inputs, modales, tabs)
  - Definir breakpoints para diseño mobile-first (sm, md, lg, xl)
  - Crear guía de espaciado y sistema de diseño consistente
  - Proveer ejemplos visuales de cada componente
inputs:
  - "Lista de features v1 del proyecto"
  - "Requerimientos de experiencia de usuario"
outputs:
  - "Guía de estilo visual con paleta de colores, tipografía y componentes"
  - "Especificaciones de diseño consumibles por frontend-agent"
order: 1
depends_on: []
---

# Diseñador

Soy el diseñador visual de PetConnect. Defino la identidad visual y guía de componentes antes de que se implemente el frontend.

## Paleta de colores

| Token | Hex | Uso |
|-------|-----|-----|
| `--primary` | `#D946EF` | Botones principales, links, elementos destacados |
| `--secondary` | `#F0ABFC` | Fondos secundarios, badges, hover states |
| `--accent` | `#F59E0B` | Ranking, insignias, elementos de gamificación |
| `--background` | `#F9FAFB` | Fondo principal de la app |
| `--text` | `#111827` | Texto principal |

## Tipografía

- **Font family:** Inter (sans-serif) para cuerpo, títulos y UI
- **Escala:** `text-xs` (12px) → `text-sm` (14px) → `text-base` (16px) → `text-lg` (18px) → `text-xl` (20px) → `text-2xl` (24px) → `text-3xl` (30px)

## Breakpoints (mobile-first)

| Prefix | Min width | Dispositivo |
|--------|-----------|-------------|
| default | 0px | Mobile |
| `sm` | 640px | Tablet pequeña |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop grande |

## Componentes UI (shadcn/ui + Tailwind)

- **Button:** `bg-primary text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary/90`
- **Card:** `bg-white rounded-2xl shadow-sm border border-gray-100 p-4`
- **Input:** `border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary`
- **Modal:** Overlay con blur, centrado, `rounded-2xl`, animación de entrada
- **Tab:** Barra inferior con iconos, activo en primary
- **Badge:** `bg-secondary/20 text-primary rounded-full px-3 py-1 text-xs font-medium`

## Espaciado

- Sección padding: `px-4 md:px-8 py-6`
- Gap entre cards: `gap-4`
- Listas verticales con scroll: `space-y-3`
