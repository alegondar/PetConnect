# PetConnect

Plataforma para conectar dueños de mascotas con servicios veterinarios, cuidadores y otros dueños de mascotas.

## Tecnologías

- **Backend:** Python 3.11+, FastAPI, Uvicorn
- **Frontend:** React 18, Vite, TypeScript
- **Gestor de paquetes:** pnpm

## Estructura

```
PetConnect/
├── backend/          # API REST con FastAPI
│   └── app/
│       ├── __init__.py
│       └── main.py
├── frontend/         # Aplicación React + Vite
├── docs/             # Documentación
│   └── openapi.yaml
├── pnpm-workspace.yaml
└── README.md
```

## Requisitos

- Python 3.11 o superior
- Node.js 18 o superior
- pnpm (`npm install -g pnpm` o `corepack enable`)

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
pnpm install
cd frontend
pnpm dev
```
