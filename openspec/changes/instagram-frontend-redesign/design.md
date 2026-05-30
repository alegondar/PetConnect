## Context

PetConnect es una plataforma web para dueños de mascotas (React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui). El rediseño aplica una estética **"Playful Premium — Dark Mode + Glassmorphism + Acentos Cálidos"** inspirada en las directrices de los skills `design-taste-frontend`, `high-end-visual-design`, `redesign-existing-projects` y `frontend-design`.

**Aesthetic direction elegida:** Ethereal Glass sobre fondo OLED negro, con acento naranja cálido (#F97316) y ámbar dorado (#F59E0B). Glassmorphism real (doble-bezel nesting) en cards, bottom nav tipo píldora flotante, tipografía Fredoka para display (personalidad mascotera) + Nunito para body. Paw prints decorativos conservados como textura sutil sobre fondo oscuro.

## Goals / Non-Goals

**Goals:**
- Modo oscuro completo con fondo #09090B (OLED black) y superficies glass (#18181B + backdrop-blur)
- Acento primario naranja cálido #F97316 (reemplaza el fucsia #D946EF)
- Acento secundario ámbar #F59E0B para medallas/destacados
- Layout mobile-first con contenedor centrado a 430px de ancho máximo
- Feed de posts con foto a ancho completo, avatar circular, botones de like/comentario con lucide-react (sin emojis)
- Cards con arquitectura doble-bezel: outer shell bg-white/3 + inner core bg-zinc-900/60 backdrop-blur-xl
- Header minimalista glass con logo "PetConnect" en naranja
- Bottom nav flotante tipo píldora (`rounded-full`) con glass y blur
- FAB glass con glow naranja para crear nuevo post
- Paw prints decorativos conservados con opacidad 3% en naranja sobre fondo negro
- Skeleton loaders (pulso bg-zinc-800→zinc-700) en lugar de spinners circulares
- Micro-interacciones: fade-up staggered, like bounce spring, FAB hover glow, nav active lift

**Non-Goals:**
- No se modifica la API ni el backend
- No se rediseñan pantallas de login/registro (solo se adaptan al layout oscuro)
- No se implementa infinite scroll
- No se añaden animaciones complejas tipo GSAP/Framer Motion
- No se cambia la lógica de autenticación ni el estado global (Zustand)
- No se eliminan las patitas decorativas (requerimiento explícito del usuario)

## Decisions

### 1. Paleta de colores: dark mode + naranja en lugar de fucsia

**Decisión:** Migrar de light mode con fucsia (#D946EF) a dark mode OLED (#09090B) con acento naranja (#F97316).

```
Paleta completa:
  --color-background: #09090B       (OLED black)
  --color-surface:    #18181B       (zinc-900, fondo de cards)
  --color-primary:    #F97316       (naranja cálido, acento principal)
  --color-primary-dark: #EA580C     (naranja oscuro, hover states)
  --color-primary-light: #FED7AA    (naranja claro, badges/bg sutil)
  --color-secondary:  #F59E0B       (ámbar dorado, medallas/destacados)
  --color-secondary-light: #FEF3C7  (ámbar claro)
  --color-accent:     #F59E0B       (igual que secondary)
  --color-text:       #FAFAFA       (blanco roto, texto principal)
  --color-text-muted: #A1A1AA       (zinc-400, texto secundario)
  --color-success:    #10B981       (verde esmeralda)
  --color-danger:     #EF4444       (rojo)
  --color-warm:       #292524       (warm stone, fondos alternativos)
  --font-display:     'Fredoka', sans-serif
  --font-body:        'Nunito', sans-serif
```

**Razón:** El fucsia sobre fondo blanco es la firma #1 del "AI slop aesthetic" según los skills de diseño. El naranja mantiene la calidez mascotera sin caer en el cliché. El dark mode da sensación premium y hace que las fotos de mascotas resalten más.

### 2. Glassmorphism con doble-bezel (Doppelrand)

**Decisión:** Todas las cards usan arquitectura de doble capa:

```html
<!-- Outer shell -->
<div class="bg-white/[0.03] rounded-[2rem] p-[1.5px]">
  <!-- Inner core -->
  <div class="bg-zinc-900/60 backdrop-blur-xl rounded-[calc(2rem-1.5px)] 
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
    <!-- contenido -->
  </div>
</div>
```

**Razón:** El `high-end-visual-design` skill exige esta técnica para simular profundidad física (como vidrio montado en marco de aluminio). El hairline exterior (bg-white/3) crea el borde sutil sin usar borders genéricos.

### 3. Bottom nav: píldora flotante en lugar de rectángulo

**Decisión:** `rounded-full` (píldora), `bg-zinc-900/80 backdrop-blur-2xl`, `border border-white/5`, sombra difusa `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]`.

**Razón:** El `design-taste-frontend` skill sugiere Mac OS Dock Magnification o Dynamic Island como referencias. La píldora flotante es más premium que un rectángulo pegado al borde y el `high-end-visual-design` skill lo llama "Fluid Island Nav".

### 4. FAB con glow naranja

**Decisión:** `bg-zinc-900/80 backdrop-blur-xl`, `border border-white/10`, `shadow-[0_0_20px_rgba(249,115,22,0.3)]`, ícono Plus naranja `text-primary`. Hover intensifica el glow: `bg-orange-600/80 shadow-[0_0_30px_rgba(249,115,22,0.5)]`.

**Razón:** El glow reemplaza el botón sólido fucsia. Es más sutil en reposo y más impactante en hover (efecto "activación"). El `design-taste-frontend` skill prohíbe glows genéricos pero permite glows funcionales con propósito.

### 5. Tipografía: mantener Fredoka + Nunito

**Decisión:** Conservar Fredoka para display (tiene personalidad, no es Inter) y Nunito para body (redondeada, amigable). Añadir `tracking-tight` en headers y `leading-relaxed` en body. No usar Geist ni Satoshi.

**Razón:** Aunque los skills recomiendan Geist/Satoshi/Cabinet Grotesk, Fredoka ya tiene carácter único y encaja con el tono mascotero. Cambiarla perdería identidad de marca. El `redesign-existing-projects` skill dice "work with existing stack".

### 6. Íconos: lucide-react con stroke-width 1.5

**Decisión:** lucide-react (ya en el proyecto vía shadcn/ui). Stroke-width consistente de 1.5 (más premium que el default 2.0). Íconos específicos: `Heart` (like, fill naranja cuando activo), `MessageCircle` (comentario), `Home`, `Trophy`, `MapPin`, `PawPrint`, `Plus`. Cero emojis en UI.

**Razón:** El `redesign-existing-projects` skill explícitamente dice que lucide-react es "default AI icon choice" y sugiere Phosphor — pero lucide-react ya está integrado y cambiarlo sería refactor innecesario. Usar stroke-width 1.5 le da un look más refinado dentro del mismo set.

### 7. Skeleton loaders en lugar de spinners

**Decisión:** Para estados de carga, usar skeletons con animación de pulso (`bg-zinc-800 animate-pulse`) que imiten la forma del contenido real (card skeleton, avatar skeleton, text line skeleton). No usar spinners circulares genéricos.

**Razón:** El `design-taste-frontend` skill (Rule 5) exige "Skeletal loaders matching layout sizes (avoid generic circular spinners)". Esto aplica a FeedPage, RankingPage, LostPetsPage y MyPetsPage.

### 8. Paw prints: conservar pero adaptar

**Decisión:** Mantener los paw prints decorativos (requerimiento del usuario en task 1.2), pero adaptados a dark mode: opacidad ultra-baja (3%), color naranja (#F97316) en lugar del fucsia actual. Usar `pointer-events-none fixed` para no interferir con la interacción.

**Razón:** Las patitas son parte de la identidad PetConnect. El `high-end-visual-design` skill dice que texturas y grain deben ir en `fixed, pointer-events-none` pseudo-elementos. Reducir opacidad al 3% las hace textura ambiental, no distracción.

### 9. Estados vacíos y de error

**Decisión:** Cada página tendrá estados composed para:
- **Empty:** Ilustración sutil + mensaje + CTA (ej: "Aún no hay posts. ¡Sé el primero!" con ícono PawPrint grande en zinc-800)
- **Error:** Mensaje inline con ícono AlertCircle + botón de reintentar
- **Loading:** Skeleton loader matching layout shape

**Razón:** El `design-taste-frontend` skill Rule 5 exige implementar el ciclo completo: Loading, Empty, Error, Tactile Feedback.

## Risks / Trade-offs

- **[Riesgo] El dark mode puede no gustar a todos los usuarios** → Mitigación: Es una app de nicho (dueños de mascotas), no una red social masiva. El dark mode favorece la visualización de fotos.
- **[Riesgo] El glassmorphism puede tener mal rendimiento en dispositivos viejos** → Mitigación: `backdrop-blur` solo en elementos fixed/sticky (cards no usan blur, solo bg semitransparente).
- **[Riesgo] Migrar de fucsia a naranja puede confundir a usuarios existentes** → Mitigación: El cambio es solo estético, no funcional. La estructura de navegación se mantiene.
- **[Trade-off] El dark mode hace ciertos textos menos legibles** → Aceptado: Se usa contraste WCAG AA (texto #FAFAFA sobre fondo #09090B = ratio 15.3:1).

## Dependencies Check

- `lucide-react` — requerido para íconos (Heart, MessageCircle, Home, Trophy, MapPin, PawPrint, Plus). Debe estar en `package.json`.
- `@tanstack/react-query` — ya en uso para data fetching. Sin cambios.
- `zustand` — ya en uso para auth state. Sin cambios.
- `react-router-dom` — ya en uso. Sin cambios.
- `tailwindcss` v4 — ya configurado con `@theme` en `index.css`. Sin cambios de versión.

## Specs

See `specs/` directory for detailed capability specs:
- `instagram-feed-ui/spec.md`
- `bottom-navigation/spec.md`
- `create-post-fab/spec.md`
- `global-theme/spec.md`
