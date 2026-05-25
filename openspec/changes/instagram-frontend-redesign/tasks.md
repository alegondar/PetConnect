## 1. Configuración del tema global

- [ ] 1.1 Actualizar `frontend/src/index.css`: reemplazar el fondo con `bg-[#F9FAFB]` sólido (sin gradiente), ajustar `--color-background: #F9FAFB`, `--color-text: #111827`, `--color-text-muted: #6B7280`, mantener colores primary/secondary/accent existentes, eliminar animaciones innecesarias, simplificar estilos de cards a `rounded-xl` + `shadow-sm` + `bg-white`
- [ ] 1.2 ~~Eliminar el fondo de paw prints decorativos (paw-print class) del CSS~~ → NO ELIMINAR. El usuario quiere conservar las patitas transparentes de fondo.
- [ ] 1.3 Verificar que las variables CSS de Tailwind (`@theme`) sean accesibles como clases utilitarias (`text-primary`, `bg-background`, etc.)

## 2. Header y layout principal

- [ ] 2.1 Rediseñar `frontend/src/components/Layout.tsx`: cambiar el header a un diseño simple con "PetConnect" centrado en `text-primary` `font-bold` `text-xl`, fondo blanco con `border-b border-gray-100`, sin avatar de usuario ni botón de following
- [ ] 2.2 Eliminar el botón de perfil/avatar y el botón de following del header (se accederá desde Mis Pets)
- [ ] 2.3 Cambiar el contenedor principal a `max-w-[430px] mx-auto` y eliminar el `max-w-lg` actual
- [ ] 2.4 Asegurar que `main` tenga padding-bottom suficiente (`pb-24`) para que el contenido no quede oculto por el FAB y bottom nav

## 3. Bottom navigation flotante

- [ ] 3.1 Reemplazar la nav actual por una barra flotante con `fixed bottom-4`, `bg-white`, `rounded-2xl`, `shadow-lg`, centrada horizontalmente, con íconos de lucide-react (Home, Trophy, MapPin, PawPrint)
- [ ] 3.2 Estilizar el ítem activo con `text-[#D946EF]` y el inactivo con `text-gray-400`, añadir labels debajo de cada ícono en `text-[10px]`
- [ ] 3.3 Asegurar que la bottom nav tenga `max-w-[430px]` y se centre en desktop, mientras en mobile ocupe el ancho completo con márgenes laterales de 16px
- [ ] 3.4 Configurar React Router para que la ruta `/feed` sea la activa por defecto y el ícono Home se muestre en primary

## 4. FAB (Floating Action Button) para crear post

- [ ] 4.1 Crear componente `frontend/src/components/CreatePostFab.tsx` con botón circular de 56px, `bg-[#D946EF]`, icono Plus blanco de lucide-react, `rounded-full`, `shadow-lg`
- [ ] 4.2 Posicionar el FAB con `fixed bottom-20 right-4` en mobile, y alineado al borde derecho del contenedor de 430px en desktop
- [ ] 4.3 Agregar estados hover (`bg-[#C026D3]`) y active (`scale-95`) con transición suave
- [ ] 4.4 Conectar el FAB al modal `CreatePostModal` existente para abrirlo al hacer clic
- [ ] 4.5 Eliminar el botón "+ Post" actual del header de FeedPage y del layout

## 5. Rediseño del PostCard estilo Instagram

- [ ] 5.1 Reescribir `frontend/src/components/PostCard.tsx` con nuevo layout: foto a ancho completo (sin `max-h`), avatar circular de 40px del pet arriba-izquierda, nombre de mascota y raza al lado del avatar, sin gradiente de avatar (usar `pet.photo_url` o inicial)
- [ ] 5.2 Reemplazar emojis (❤️🤍💬) por iconos de lucide-react: Heart outline/filled para like, MessageCircle para comentarios
- [ ] 5.3 Posicionar los botones de like y comentario debajo de la foto, con el contador de likes en `font-semibold` debajo de los botones, formato "X likes"
- [ ] 5.4 Implementar toggle visual de like: Heart en `text-[#D946EF]` y `fill-[#D946EF]` cuando está likeado, outline cuando no. Animación sutil al dar like (scale bounce)
- [ ] 5.5 Añadir `rounded-xl` y `shadow-sm` al card, con `bg-white`, y `mb-6` de separación entre posts
- [ ] 5.6 Mostrar la fecha del post con formato relativo ("hace 2h", "ayer") en la esquina superior derecha del card

## 6. Adaptar FeedPage

- [ ] 6.1 Simplificar `frontend/src/pages/FeedPage.tsx`: eliminar el header interno con título "Feed" y botón "+", ya que el header global y el FAB cubren esa funcionalidad
- [ ] 6.2 Cambiar el espaciado de la lista de posts de `space-y-4` a `space-y-6` (24px entre posts)
- [ ] 6.3 Mantener el componente `CreatePostModal` conectado al FAB

## 7. Pantalla de Ranking independiente

- [ ] 7.1 Eliminar cualquier widget de ranking del home/FeedPage (si existiera)
- [ ] 7.2 Actualizar `frontend/src/pages/RankingPage.tsx`: rediseñar cards con `rounded-xl`, `shadow-sm`, `bg-white`, avatar circular del pet, nombre, username del dueño y badge de likes
- [ ] 7.3 Usar color `#F59E0B` (accent) para las medallas del top 3 (🥇🥈🥉) y para el contador de likes semanales
- [ ] 7.4 Añadir espaciado consistente entre cards (`space-y-3`) y padding adecuado

## 8. Páginas LostPets y MyPets

- [ ] 8.1 Adaptar `frontend/src/pages/LostPetsPage.tsx` al nuevo estilo de cards: `rounded-xl`, `shadow-sm`, `bg-white`, consistente con el resto de la app
- [ ] 8.2 Adaptar `frontend/src/pages/MyPetsPage.tsx` al nuevo estilo de cards con grid de 2 columnas y espaciado consistente
- [ ] 8.3 Asegurar que el header de cada página secundaria sea sutil y consistente con el diseño general

## 9. Revisión y consistencia visual

- [ ] 9.1 Revisar que todas las cards de la app usen `rounded-xl`, `shadow-sm` y `bg-white`
- [ ] 9.2 Verificar que el fondo general sea `#F9FAFB` en todas las pantallas
- [ ] 9.3 Verificar que los textos usen `#111827` para contenido principal y `#6B7280` (gray-500) para texto secundario
- [ ] 9.4 Asegurar que los iconos de lucide-react sean consistentes en toda la app (no mezclar con emojis)
- [ ] 9.5 Probar la app en viewports móvil (375px) y desktop (>430px) para verificar el centrado y la responsividad
- [ ] 9.6 Ejecutar `npm run lint` y `npm run typecheck` para verificar que no haya errores
