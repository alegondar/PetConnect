## Why

El frontend actual de PetConnect carece de una identidad visual definida y una experiencia de navegación móvil pulida. Los usuarios objetivo (dueños de mascotas) están acostumbrados a patrones de interacción tipo Instagram: feed visual atractivo, navegación inferior simple y acciones rápidas. Rediseñar con este estilo aumentará el engagement y la retención de usuarios.

## What Changes

- Rediseño completo del layout: mobile-first, centrado, max-width 430px, fondo #F9FAFB
- Header simple con logo "PetConnect" en color primary #D946EF
- Feed de posts estilo Instagram: foto a ancho completo, avatar circular, nombre/raza, botones like/comentario, contador de likes
- FAB circular "+" en color #D946EF para crear nuevo post
- Bottom nav flotante con fondo blanco, bordes redondeados, sombra suave: Feed / Ranking / Perdidos / Mis Pets
- Cards con esquinas redondeadas (rounded-xl) y sombra suave (shadow-sm)
- Eliminación del widget de ranking del home (el ranking va en su propia pantalla vía bottom nav)
- Paleta de colores definida: primary #D946EF, texto #111827, fondo #F9FAFB
- Tipografía limpia y espaciado generoso entre posts

## Capabilities

### New Capabilities

- `instagram-feed-ui`: Feed de posts estilo Instagram con avatar circular, foto a ancho completo, botones de interacción y contador de likes
- `bottom-navigation`: Barra de navegación inferior flotante con íconos para Feed, Ranking, Perdidos, Mis Pets
- `create-post-fab`: Botón flotante de acción (FAB) circular para crear nuevo post
- `global-theme`: Sistema de tema global con colores, tipografía y estilos consistentes

### Modified Capabilities

- `ranking-widget`: El widget de ranking se elimina del home y se traslada a su propia pantalla accesible desde el bottom nav

## Impact

- `frontend/src/` — Reescritura significativa de componentes, layouts y estilos
- `frontend/src/App.tsx` — Nuevo sistema de rutas y layout principal
- `frontend/src/index.css` — Variables CSS globales y configuración Tailwind
- `frontend/tailwind.config.js` — Extensión de theme con colores corporativos, max-width y sombras
- No afecta al backend ni la API
