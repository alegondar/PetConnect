# PetConnect Backend — Cloudflare Workers

## Requisitos previos

- Node.js 18+ y pnpm instalados
- Cuenta de Cloudflare (free tier es suficiente)
- Proyecto de Supabase configurado (credenciales necesarias)

## Setup inicial (una sola vez)

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar sesión en Cloudflare
npx wrangler login

# 3. Configurar secretos (credenciales sensibles, NO van en wrangler.toml)
npx wrangler secret put SUPABASE_ANON_KEY
# Pegar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

npx wrangler secret put SUPABASE_SERVICE_KEY
# Pegar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Desarrollo local

```bash
# Iniciar worker localmente (puerto 8787 por defecto)
npx wrangler dev
```

Probar: `curl http://localhost:8787/` → `{"message":"PetConnect API is running"}`

## Deploy a producción

```bash
# 1. Verificar que FRONTEND_ORIGIN en wrangler.toml apunta al dominio real
#    (ej: "https://petconnect.pages.dev")

# 2. Desplegar
npx wrangler deploy

# 3. El worker queda disponible en:
#    https://petconnect-backend.<tu-subdominio>.workers.dev
```

## Variables de entorno

| Variable | En wrangler.toml? | Cómo configurarla |
|---|---|---|
| `FRONTEND_ORIGIN` | Sí (`[vars]`) | Editar `wrangler.toml` |
| `SUPABASE_URL` | Sí (`[vars]`) | Editar `wrangler.toml` |
| `SUPABASE_ANON_KEY` | No (secreto) | `wrangler secret put` |
| `SUPABASE_SERVICE_KEY` | No (secreto) | `wrangler secret put` |

## Notas importantes

- **No requiere Node.js en producción**: el código corre en V8 isolates de Cloudflare.
- **Cold starts**: típicamente <5ms (V8 isolates, no contenedores).
- **CPU budget**: 10ms por request en free tier, 30ms en plan paid. Suficiente para una API REST que solo hace queries HTTP a Supabase.
- **Timeout**: 30 segundos máximo por request (más que suficiente para queries a Supabase).
- **backend-node/ sigue funcionando**: este proyecto `backend-worker/` es independiente. Si algo falla, `backend-node/` sigue disponible para desarrollo local con `tsx watch`.
