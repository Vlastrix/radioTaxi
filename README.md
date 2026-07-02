# 🚕 Radio Taxi - Sistema de Gestión

Un moderno sistema web integral para la administración y operación de una central de Radio Taxis. 

Este proyecto está construido como un **Monorepo** usando [Turborepo](https://turbo.build/), separando el frontend y el backend pero manteniendo un flujo de desarrollo unificado.

## 🛠️ Tecnologías Principales

- **Frontend (Sitio Web):** React 19, Vite, Tailwind CSS v4, TanStack Query (React Query), React Router, React Hook Form, Zod, Recharts.
- **Backend (API):** NestJS, TypeScript, Prisma ORM, PostgreSQL, Passport JWT, Bcrypt.
- **Gestión:** Turborepo, npm workspaces.

## 📦 Estructura del Proyecto

```text
radioTaxi/
├── apps/
│   ├── web/      # Aplicación Frontend en React (Puerto 5173)
│   └── api/      # Servidor Backend en NestJS (Puerto 3000)
├── packages/     # (Opcional) Paquetes compartidos o configuraciones de Turborepo
└── package.json  # Configuración global de espacios de trabajo
```

## 🚀 Cómo ejecutar el proyecto localmente

### 1. Requisitos Previos
- **Node.js** (v18 o superior).
- **PostgreSQL** corriendo localmente en el puerto `5501` (o actualiza el `.env`).

### 2. Configurar el Entorno (Variables)
El backend necesita saber dónde conectarse. Si las credenciales por defecto de tu Postgres son usuario `postgres` y clave `postgres`, la cadena de conexión ya está lista. Si no, verifica el archivo `apps/api/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5501/radiotaxi"
JWT_SECRET="SECRET_KEY_FOR_RADIO_TAXI_WIP"
```

### 3. Instalar Dependencias
Ubicado en la carpeta principal del proyecto (`radioTaxi/`), abre tu terminal y ejecuta:
```bash
npm install
```

### 4. Migraciones y Seed (Base de Datos)
Debes generar las tablas en tu base de datos e inyectar el usuario administrador:
```bash
# 1. Empujar la estructura a PostgreSQL
npx prisma db push --schema=apps/api/prisma/schema.prisma

# 2. Generar el cliente de Prisma
npx prisma generate --schema=apps/api/prisma/schema.prisma

# 3. Correr el script semilla (Crear Admin)
cd apps/api
npx tsx prisma/seed.ts
cd ../..
```

**Credenciales maestras generadas:**
- **Email:** `vladi@gmail.com`
- **Contraseña:** `1234`

### 5. Arrancar el Entorno de Desarrollo
Para levantar ambos servidores (API + Frontend) de manera simultánea con un solo comando, en la raíz del proyecto (`radioTaxi/`) corre:
```bash
npm run dev
```

### 6. Acceso
¡Listo! Podrás interactuar con el sistema abriendo en tu navegador web favorito:
👉 **[http://localhost:5173/](http://localhost:5173/)**

---
*Desarrollado con ♥ para gestionar el caos del transporte de manera elegante.*
