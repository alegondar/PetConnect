## 1. Dependencias

- [x] 1.1 Instalar `leaflet`, `react-leaflet` y `@types/leaflet` en `frontend/package.json`
- [x] 1.2 Importar `leaflet/dist/leaflet.css` en `frontend/src/index.css`

## 2. Componente MapLocationPicker

- [x] 2.1 Crear `frontend/src/components/MapLocationPicker.tsx` con un mapa Leaflet de 200px de alto, centrado en geolocation del navegador (con fallback a Buenos Aires -34.6037, -58.3816, zoom 13)
- [x] 2.2 Agregar un marcador arrastrable (`draggable`) que emite lat/lng vía callback `onLocationChange(lat, lng)` al moverse
- [x] 2.3 Mostrar las coordenadas actuales como texto gris debajo del mapa (solo lectura)
- [x] 2.4 Llamar `map.invalidateSize()` en un `useEffect` al montar para corregir el renderizado de tiles dentro del modal
- [x] 2.5 Estilizar el contenedor del mapa con `rounded-xl overflow-hidden` para consistencia con el diseño

## 3. Campo de foto tipo file upload

- [x] 3.1 En el `LostPetForm`, reemplazar el `<input placeholder=\"URL de foto\">` por un input `type=\"file\"` oculto + botón visible \"Seleccionar foto\"
- [x] 3.2 Implementar previsualización de la foto seleccionada con `URL.createObjectURL(file)` y botón X para removerla
- [x] 3.3 Al hacer submit: si hay archivo seleccionado, hacer `POST /api/v1/pets/upload-photo` con FormData antes de crear el lost pet
- [x] 3.4 Mostrar estado de carga (\"Subiendo...\") en el botón de submit mientras la foto se sube
- [x] 3.5 Manejar error de upload: mostrar mensaje \"Error al subir la foto\" y no crear el lost pet

## 4. Integración en LostPetForm

- [x] 4.1 Eliminar los inputs de Latitud y Longitud del formulario (reemplazados por el mapa)
- [x] 4.2 Integrar `<MapLocationPicker />` arriba del formulario, conectando `onLocationChange` a los estados `lat` y `lng`
- [x] 4.3 Asegurar que el botón "Reportar" solo se active si nombre, especie, lat y lng están presentes (la foto sigue siendo opcional)
- [x] 4.4 Conservar el campo "Última ubicación" como texto informativo (opcional, muestra dirección si en el futuro se agrega geocodificación)

## 5. Verificación

- [x] 5.1 Probar en local: abrir modal en `/lost-pets`, verificar que el mapa carga tiles correctamente
- [x] 5.2 Probar: arrastrar el pin y verificar que lat/lng se actualizan en tiempo real
- [x] 5.3 Probar: seleccionar una foto, ver previsualización, removerla, volver a seleccionar
- [x] 5.4 Probar: submit con foto (verificar que se sube y el lost pet se crea con photo_url)
- [x] 5.5 Probar: submit sin foto (verificar que se crea sin photo_url)
- [x] 5.6 Ejecutar `npm run lint` en frontend para verificar que no hay errores
