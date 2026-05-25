## Context

El backend de PetConnect verifica tokens JWT en `backend/app/core/auth.py` usando `python-jose` con el algoritmo HS256 fijo:

```python
payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})
```

Supabase migró su infraestructura de autenticación a ECC P-256 (ES256), un algoritmo asimétrico. Los tokens emitidos por Supabase Auth ahora están firmados con ES256. Intentar decodificarlos con HS256 usando un secreto simétrico falla irremediablemente, causando 401 en todas las rutas protegidas.

El cliente oficial `supabase-py` ya expone `supabase.auth.get_user(token)` que delega la verificación a la API de Supabase Auth. Este método:
- Valida el token contra el servicio de Supabase (sin importar el algoritmo)
- Retorna el `user_id` correcto
- Maneja expiración, revocación y rotación de claves automáticamente

## Goals / Non-Goals

**Goals:**
- Verificar tokens JWT de Supabase sin hardcodear el algoritmo de firma
- Usar el cliente oficial `supabase-py` para la validación
- Mantener el contrato existente: header `Authorization: Bearer <token>`, respuesta 401 si falla
- Mantener el lookup del perfil en la tabla `profiles`

**Non-Goals:**
- No se cambia el flujo de login/registro
- No se modifica el frontend
- No se elimina `JWT_SECRET` del config (podría tener otros usos futuros)
- No se elimina `python-jose` de requirements (verificar si tiene otros consumidores)

## Decisions

**1. Usar `supabase.auth.get_user(token)` en vez de `jwt.decode()`**

Decisión: Reemplazar toda la lógica de decodificación manual por una llamada al cliente Supabase.

Alternativa 1: Agregar `algorithms=["ES256", "HS256"]` al `jwt.decode`.  
Razón del rechazo: Requiere conocer la clave pública de Supabase para ES256, que no está disponible como variable de entorno simple. Además, no maneja revocación de tokens.

Alternativa 2: Usar `supabase.auth.get_user(token)` directamente.  
Razón: El cliente Supabase ya maneja toda la complejidad criptográfica. Valida contra la API de Supabase en tiempo real, cubriendo expiración, revocación y rotación de claves sin configuración adicional.

**2. Mantener `HTTPBearer` para extraer el token del header**

Decisión: Conservar `HTTPBearer` como dependencia para extraer el token del header `Authorization: Bearer <token>`. Solo cambiar qué se hace con el token extraído.

Alternativa: Usar `OAuth2PasswordBearer`.  
Razón del rechazo: `HTTPBearer` ya está implementado y es más simple. Cambiar a otro extractor no aporta valor.

**3. Mantener el lookup en `profiles` con `user_id`**

Decisión: Después de validar el token con Supabase, buscar el perfil en la tabla `profiles` usando `user_id` (el `id` del usuario de Supabase Auth).

Alternativa: Retornar directamente el resultado de `get_user`.  
Razón del rechazo: El perfil contiene campos adicionales (`username`, `avatar_url`, etc.) que los endpoints necesitan. Además, el `profiles.id` es usado como `owner_id` en muchas tablas.

## Risks / Trade-offs

- **[Riesgo]** `supabase.auth.get_user(token)` hace una llamada HTTP a la API de Supabase → **Mitigación**: Supabase Auth tiene baja latencia (~50ms). El impacto es aceptable comparado con el costo de mantener lógica criptográfica manual.
- **[Riesgo]** Si Supabase Auth está caído, todas las peticiones autenticadas fallan → **Mitigación**: Es un servicio gestionado con 99.9% SLA. Si Supabase Auth cae, el login también falla, así que el impacto es equivalente.
- **[Trade-off]** Se pierde la capacidad de verificar tokens offline → Aceptado: la verificación online es más segura (soporta revocación inmediata) y más simple (sin gestión de claves).
