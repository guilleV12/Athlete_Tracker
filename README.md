# Athlete Tracker

App full-stack para atletas: entrenamientos, comidas con macros, perfil nutricional (Mifflin-St Jeor), dashboard con insights y sistema de logros estilo gamificación.

Monorepo con **React + Vite + Tailwind v4** (cliente) y **Express + Prisma + SQLite** (API).

---

## Demo

| Campo | Valor |
|--------|--------|
| Email | `demo@athlete-tracker.dev` |
| Contraseña | `Demo1234` |

El usuario demo incluye perfil completo, comidas de hoy con P/C/G, entrenamientos de la semana, historial de peso y logros desbloqueados.

---

## Características

- **Auth:** registro, login, JWT, recuperación de contraseña (link en consola en dev)
- **Perfil nutricional:** edad, peso, altura, actividad, modos mantenimiento / déficit / superávit / comer libre
- **Metas de macros:** definidas por el usuario en el perfil (sugerencia opcional, no automática)
- **Comidas:** registro con proteína, carbos y grasa; kcal = `4·P + 4·C + 9·G`
- **Dashboard:** calorías vs meta, progreso de macros, gráfico semanal de entrenos
- **Logros:** catálogo ordenado (obtenidos / por conseguir) con toast de celebración
- **Onboarding:** redirección suave al perfil tras registrarse
- **Landing pública** en `/` y app en `/dashboard`

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19, Vite, React Router, Tailwind CSS v4, Recharts, RHF + Zod |
| Backend | Express 5, JWT, bcrypt |
| Base de datos | SQLite + Prisma ORM |
| Validación | Zod (cliente y reglas en servidor) |

---

## Requisitos

- Node.js **18+**
- npm

---

## Instalación local

### 1. Clonar e instalar

```bash
git clone <tu-repo>
cd app-athlete-tracker
```

### 2. API (`athlete-tracker-server`)

```bash
cd athlete-tracker-server
cp .env.example .env
# Editá JWT_SECRET en .env

npm install
npx prisma migrate dev
npm run seed
npm run dev
```

API en **http://localhost:3000** — health: `GET /api/v1/health`

> **Windows:** si `prisma generate` falla con EPERM, detené el server antes de migrar o generar el client.

### 3. Cliente (`athlete-tracker-client`)

```bash
cd athlete-tracker-client
cp .env.example .env
npm install
npm run dev
```

App en **http://localhost:5173**

---

## Scripts útiles

### Server

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | API con nodemon |
| `npm start` | API producción |
| `npm run seed` | Logros + usuario demo |
| `npm run db:migrate` | Aplicar migraciones (deploy) |
| `npm test` | Tests de `calorieTargets.js` |

### Client

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Build producción |
| `npm run preview` | Preview del build |

---

## Variables de entorno

### Server (`.env`)

```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=un-secreto-largo-y-aleatorio
FRONTEND_URL=http://localhost:5173
```

### Client (`.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Deploy (portfolio)

### Frontend → Vercel

1. Root directory: `athlete-tracker-client`
2. Build: `npm run build`
3. Output: `dist`
4. Variable: `VITE_API_URL=https://tu-api.onrender.com/api/v1`
5. `vercel.json` incluido para rutas SPA

### API → Render

1. Conectá el repo y usá `render.yaml` (Blueprint) o configurá manualmente:
   - Root: `athlete-tracker-server`
   - Build: `npm install && npx prisma migrate deploy && npm run seed`
   - Start: `npm start`
2. Variables: `JWT_SECRET`, `FRONTEND_URL` (URL de Vercel), `DATABASE_URL`
3. **Nota:** SQLite en Render usa disco efímero; para demo alcanza. Para producción real conviene **PostgreSQL** (cambiar `provider` en Prisma).

### Checklist post-deploy

Ver guía detallada: [`docs/DEPLOY.md`](docs/DEPLOY.md)

- [ ] `FRONTEND_URL` apunta al dominio del cliente
- [ ] `VITE_API_URL` apunta al dominio de la API
- [ ] Seed ejecutado (`demo@athlete-tracker.dev` / `Demo1234`)
- [ ] Probar login y dashboard

---

## Estructura del repo

```
app-athlete-tracker/
├── athlete-tracker-client/   # React SPA
├── athlete-tracker-server/   # Express API + Prisma
├── render.yaml               # Blueprint Render (API)
└── README.md
```

### Rutas API principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/register` | Registro |
| GET/PUT | `/api/v1/profile` | Perfil nutricional |
| GET | `/api/v1/stats/dashboard` | Stats del dashboard |
| GET | `/api/v1/achievements` | Catálogo de logros |
| CRUD | `/api/v1/workouts`, `/api/v1/meals` | Entrenos y comidas |

---

## Decisiones de diseño

- **Déficit / superávit:** ajuste fijo −400 / +300 kcal sobre TDEE (simple y predecible para demo).
- **Macros:** metas guardadas en perfil; consumo sumado desde comidas registradas.
- **Logros:** no bloquean flujos; se devuelven en `newAchievements` al crear comida/entreno.
- **Reset de contraseña:** en desarrollo el link se loguea en consola del server.

---

## Capturas

> Agregá screenshots en `docs/screenshots/` y enlazalos aquí para el portfolio (landing, dashboard, logros, perfil).

---

## Licencia

Proyecto de portafolio — uso libre con atribución.
