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
npm install
npm run db:sync:turso
npm run seed
```

> `db:sync:turso` aplica las migraciones SQL a Turso (Prisma CLI solo escribe en SQLite local). El seed crea logros + usuario demo. Requiere `TURSO_*` en `.env`.

Credenciales demo: `demo@athlete-tracker.dev` / `Demo1234`

---

## 2. Proyecto en Vercel

1. [vercel.com](https://vercel.com) → tu proyecto → **Settings** → **General** → **Build & Development Settings**.

2. Configuración (**importante: desactivá overrides viejos**):

| Campo | Valor |
|--------|--------|
| Root Directory | `.` (raíz del repo, **no** `athlete-tracker-client`) |
| Framework Preset | **Other** |
| Build Command | **vacío** |
| Install Command | **vacío** |
| Output Directory | **vacío** (Vercel usa `dist` vía `vercel.json`) |

> Si ves `exited with 127` o `No Output Directory named "dist"`, borrá overrides viejos en el dashboard y asegurate que Root Directory sea `.`.

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
| "No se pudo conectar con el servidor" | Ver filas de abajo. |
| Build `exited with 127` | Vercel → Settings → **Build Command vacío**. Root Directory = `.`. Redeploy. |
| `No Output Directory named "dist"` | Root Directory = `.` (raíz). Output Directory **vacío** en dashboard. Redeploy. |
| `/api/v1/health` devuelve HTML o "No routes matched" | Redeploy con `api/index.js` + rewrites en `vercel.json`. Root Directory = `.`. |
| Requests a `localhost:3000` | Redeploy en Vercel (build viejo). El cliente ya usa `/api/v1` en prod. |
| 500 en `/api/v1/*` | Revisá `TURSO_*`, `JWT_SECRET` y logs en Vercel → Functions. |
| Turso 401 / tablas vacías | Regenerá el token en Turso (`turso db tokens create`) y corré `npm run db:sync:turso` + `npm run seed`. |
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
