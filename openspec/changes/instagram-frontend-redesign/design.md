## Context

PetConnect es una plataforma web y Android para dueños de mascotas. El stack frontend usa React 18 + Vite + TypeScript + Tailwind CSS v3 + shadcn/ui. La versión actual carece de una identidad visual cohesiva y los patrones de navegación no siguen los estándares de apps sociales modernas. Los usuarios objetivo están familiarizados con experiencias tipo Instagram: feed visual centrado en fotos, navegación inferior con iconos, y acciones principales vía FAB. Este rediseño adapta esos patrones al dominio de mascotas sin modificar el backend.

## Goals / Non-Goals

**Goals:**
- Layout mobile-first con contenedor centrado a 430px de ancho máximo
- Feed de posts con foto a ancho completo, avatar circular del dueño/mascota, botones de like y comentario, y contador de likes
- Header minimalista con logo "PetConnect" en color primario #D946EF
- FAB circular "+" en #D946EF abajo-derecha para crear nuevo post
- Bottom nav flotante con íconos para Feed, Ranking, Perdidos y Mis Pets
- Separar el ranking en su propia pantalla (sin widget en el home)
- Consistencia visual: cards con rounded-xl + shadow-sm, fondo #F9FAFB, texto #111827, tipografía limpia con espaciado generoso

**Non-Goals:**
- No se modifica la API ni el backend
- No se rediseñan pantallas de login/registro, adopciones, ni InstaPet (solo se adaptan al nuevo layout global)
- No se implementa infinite scroll (se mantiene paginación tradicional)
- No se añaden animaciones complejas ni transiciones de navegación
- No se cambia la lógica de autenticación ni el estado global (Zustand)

## Decisions

**1. Tailwind CSS theme extend vs CSS custom properties**

Decisión: Extender `tailwind.config.js` con los colores corporativos (`primary: #D946EF`, `background: #F9FAFB`, `foreground: #111827`) y definir `maxWidth: { mobile: '430px' }` en el theme.

Alternativa: Usar solo CSS custom properties en `index.css`.  
Razón: Tailwind theme extend permite usar clases utilitarias como `text-primary`, `bg-background`, `max-w-mobile` en todo el proyecto sin repetir valores hex. Esto es más mantenible y alineado con el enfoque utility-first.

**2. Layout: max-width container vs viewport completo**

Decisión: Contenedor `max-w-[430px] mx-auto` con fondo `#F9FAFB` que ocupe toda la pantalla en desktop. En mobile, el contenido tapa todo el viewport.

Alternativa: Usar `max-w-screen-sm` (640px).  
Razón: 430px es el ancho de un iPhone 14 Pro Max, el dispositivo más común entre usuarios de apps sociales. Un contenedor más estrecho da la sensación de "app nativa" incluso en desktop, mejorando la familiaridad para el usuario.

**3. Bottom nav: fija vs parte del scroll**

Decisión: Bottom nav flotante (`fixed bottom-4`, `rounded-2xl`, `shadow-lg`, fondo blanco, centrada horizontalmente) que se superpone al contenido con un margen inferior. El contenido del feed debe tener padding-bottom suficiente para no quedar oculto.

Alternativa: Nav fija pegada al borde inferior sin márgenes.  
Razón: El diseño flotante con bordes redondeados y sombra es el estándar moderno de apps como Instagram. Da sensación de superposición elegante y deja espacio visual para el FAB.

**4. FAB position: esquina inferior derecha vs centrado**

Decisión: FAB posicionado `fixed bottom-20 right-4` (o `right-[calc(50%-215px+1rem)]` para alinearse con el contenedor de 430px), circular de 56px, color `#D946EF`, con icono "+" blanco y sombra `shadow-lg`.

Alternativa: FAB centrado en la bottom nav.  
Razón: La posición abajo-derecha es el estándar Material Design y de Instagram. No interfiere con la bottom nav centrada y es fácilmente alcanzable con el pulgar derecho.

**5. Post card: componente independiente vs inline**

Decisión: Componente `<PostCard />` autocontenido que recibe props del post (foto, avatar, nombre mascota, raza, likes, si el usuario ya dio like). Usa React Query para mutaciones de like y navegación programática para comentarios.

Alternativa: Renderizado inline en el feed sin abstracción.  
Razón: Un componente reutilizable permite usar la misma card en feed global, perfil de mascota, y búsqueda sin duplicar código.

**6. Íconos: librería lucide-react**

Decisión: Mantener `lucide-react` como librería de iconos (ya incluida en el proyecto vía shadcn/ui). Los iconos específicos son: `Heart` (like), `MessageCircle` (comentario), `Home` (feed), `Trophy` (ranking), `MapPin` (perdidos), `PawPrint` (mis pets), `Plus` (FAB).

Alternativa: Usar emojis o SVG custom.  
Razón: lucide-react ya está en el proyecto, tiene tree-shaking, y sus iconos son consistentes con el estilo visual limpio buscado.

## Risks / Trade-offs

- **[Riesgo] El contenedor de 430px puede verse extraño en tablets** → Mitigación: En viewports > 430px se centra el contenido con fondo gris claro a los lados, similar a la versión web de Instagram.
- **[Riesgo] El FAB puede solaparse con el último post** → Mitigación: Agregar `pb-24` al contenedor del feed para asegurar que el último elemento sea visible por encima del FAB y la bottom nav.
- **[Riesgo] Eliminar el widget de ranking del home puede confundir a usuarios existentes** → Mitigación: El ranking es accesible con un solo tap desde la bottom nav (segundo ícono), más visible que antes.
- **[Trade-off] La bottom nav flotante ocupa espacio vertical** → Aceptado: El diseño moderno prioriza la estética y usabilidad sobre el espacio de contenido. Las apps sociales exitosas hacen este mismo trade-off.

## Open Questions

- ¿Se debe ocultar la bottom nav al hacer scroll hacia abajo (como Instagram)? → Decidir durante implementación según feedback visual.
- ¿La pantalla de "Mis Pets" debe mostrar lista o grid de mascotas? → Grid de 2 columnas con cards pequeñas, consistente con el diseño mobile-first.
- ¿El header debe mostrar avatar del usuario logueado además del logo? → Por simplicidad inicial, solo mostrar logo "PetConnect". Se puede iterar después.
