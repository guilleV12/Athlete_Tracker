# Deploy — solo Vercel

Guía para publicar **Athlete Tracker** en un único proyecto de Vercel: frontend + API en el mismo dominio.

Orden: **1) Turso (base de datos) → 2) Vercel (app completa) → 3) seed demo**.

---

## Por qué no Render

Vercel sirve el frontend estático y la API como **serverless functions** (`/api/v1/*`). No hace falta un servidor Node aparte en Render.

La base de datos **no puede** ser un archivo SQLite local en Vercel (las funciones son efímeras). Usamos **Turso** (SQLite en la nube, plan gratis) — solo hay que copiar dos variables de entorno en Vercel.

---

## 0. Subir el código a GitHub

```bash
cd app-athlete-tracker
git add .
git commit -m "Deploy: Vercel monorepo con API serverless"
git push origin main
```

Repo: `https://github.com/guilleV12/Athlete_Tracker`

---

## 1. Base de datos en Turso

1. Creá cuenta en [turso.tech](https://turso.tech) (gratis).
2. Instalá la CLI (opcional pero útil): [docs.turso.tech/cli](https://docs.turso.tech/cli).
3. Creá la base:

```bash
turso db create athlete-tracker
turso db tokens create athlete-tracker
```

4. Copiá:
   - **URL** → `TURSO_DATABASE_URL` (formato `libsql://...`)
   - **Token** → `TURSO_AUTH_TOKEN`

5. Aplicá el schema y el seed **desde tu máquina** (una sola vez):

```bash
cd athlete-tracker-server

# Windows PowerShell — reemplazá con tus valores reales
$env:TURSO_DATABASE_URL="libsql://..."
$env:TURSO_AUTH_TOKEN="..."
$env:DATABASE_URL="file:./dev.db"

npm install
npx prisma db push
npm run seed
```

> `prisma db push` sincroniza el schema con Turso. El seed crea logros + usuario demo.

Credenciales demo: `demo@athlete-tracker.dev` / `Demo1234`

---

## 2. Proyecto en Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → importá `Athlete_Tracker`.
2. Configuración:

| Campo | Valor |
|--------|--------|
| Root Directory | `.` (raíz del repo) |
| Framework Preset | Other |

Vercel usa el `vercel.json` de la raíz (cliente + función `/api`).

3. **Environment Variables** (Production):

| Variable | Valor |
|----------|--------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | String largo y aleatorio (32+ caracteres) |
| `TURSO_DATABASE_URL` | URL de Turso (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Token de Turso |
| `FRONTEND_URL` | URL de Vercel, ej. `https://athlete-tracker-gray.vercel.app` |

**No hace falta** `VITE_API_URL` en producción: el cliente usa `/api/v1` (mismo dominio, sin CORS).

4. **Deploy**.

---

## 3. Verificar

1. Health: `https://TU-APP.vercel.app/api/v1/health` → `{ "status": "ok", ... }`
2. Abrí la app → **Ingresar** con demo:
   - Email: `demo@athlete-tracker.dev`
   - Contraseña: `Demo1234`
3. Probá registro de un usuario nuevo.

---

## 4. Checklist final

- [ ] `GET .../api/v1/health` responde OK
- [ ] Login demo funciona
- [ ] Registro funciona (no error de red / localhost)
- [ ] Dashboard carga stats
- [ ] README tiene link a la demo en vivo

---

## Problemas frecuentes

| Síntoma | Solución |
|---------|----------|
| Requests a `localhost:3000` | Redeploy en Vercel (build viejo). El cliente ya usa `/api/v1` en prod. |
| 500 en `/api/v1/*` | Revisá `TURSO_*`, `JWT_SECRET` y logs en Vercel → Functions. |
| Tablas vacías / demo no existe | Corré `npx prisma db push` y `npm run seed` contra Turso (paso 1). |
| Prisma client error | El build ejecuta `prisma generate` vía `postinstall` del server. |
| CORS | Con mismo dominio no debería aparecer. Si usás dominio custom, actualizá `FRONTEND_URL`. |

---

## Desarrollo local (sin cambios)

- **API:** `athlete-tracker-server` con SQLite (`DATABASE_URL="file:./dev.db"`) — sin variables Turso.
- **Cliente:** `VITE_API_URL=http://localhost:3000/api/v1` en `.env`.

---

## URLs para el portfolio

- **Live demo:** https://athlete-tracker-gray.vercel.app  
- **API health:** https://athlete-tracker-gray.vercel.app/api/v1/health  
- **Repo:** https://github.com/guilleV12/Athlete_Tracker  
