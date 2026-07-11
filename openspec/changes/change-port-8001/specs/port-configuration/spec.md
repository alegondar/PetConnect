## ADDED Requirements

### Requirement: Puerto del servidor configurable vía variable de entorno

El servidor Hono SHALL exponer el puerto de escucha mediante la variable de entorno `PORT`, con un valor por defecto de `8001` cuando la variable no esté definida.

#### Scenario: Puerto por defecto sin variable de entorno

- **WHEN** la variable de entorno `PORT` no está definida
- **THEN** el servidor SHALL escuchar en el puerto `8001`

#### Scenario: Puerto personalizado vía variable de entorno

- **WHEN** la variable de entorno `PORT` está definida como `9000`
- **THEN** el servidor SHALL escuchar en el puerto `9000`

#### Scenario: Variable de entorno con valor inválido

- **WHEN** la variable de entorno `PORT` tiene un valor no numérico (ej. `"abc"`)
- **THEN** el servidor SHALL usar el puerto por defecto `8001`

### Requirement: Archivo .env y .env.example contienen PORT=8001

Los archivos de configuración `.env` y `.env.example` en `backend-node/` SHALL incluir `PORT=8001` como valor documentado para desarrollo local.

#### Scenario: .env contiene el puerto correcto

- **WHEN** un desarrollador copia `.env.example` a `.env`
- **THEN** el servidor SHALL arrancar en el puerto `8001` sin configuración adicional

### Requirement: Proxy del frontend apunta al puerto 8001

El archivo `frontend/vite.config.ts` SHALL configurar el proxy de desarrollo para redirigir peticiones `/api` a `http://localhost:8001`.

#### Scenario: Proxy redirige correctamente en desarrollo

- **WHEN** el frontend hace una petición a `/api/v1/pets`
- **THEN** Vite SHALL redirigir la petición a `http://localhost:8001/api/v1/pets`

### Requirement: OpenAPI spec referencia el puerto 8001

El archivo `docs/openapi.yaml` SHALL declarar la URL del servidor como `http://localhost:8001/api/v1`.

#### Scenario: Documentación de API muestra la URL correcta

- **WHEN** un desarrollador consulta `docs/openapi.yaml`
- **THEN** la propiedad `servers[0].url` SHALL ser `http://localhost:8001/api/v1`
