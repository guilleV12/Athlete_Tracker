# Deploy — Vercel + Render

Guía paso a paso para publicar **Athlete Tracker** en vivo (demo de portfolio).

Orden recomendado: **1) subir código → 2) Render (API) → 3) Vercel (cliente) → 4) enlazar URLs**.

---

## 0. Subir el código a GitHub

Si todavía no pusheaste los cambios recientes:

```bash
cd app-athlete-tracker
git add .
git commit -m "Portfolio: README, seed demo, deploy config"
git push origin main
```

Repo actual: `https://github.com/guilleV12/Athlete_Tracker`

---

## 1. API en Render

### Opción A — Blueprint (`render.yaml`)

1. Entrá a [render.com](https://render.com) → **New** → **Blueprint**.
2. Conectá el repo `Athlete_Tracker`.
3. Render detecta `render.yaml` y crea el servicio `athlete-tracker-api`.
4. Antes de deployar, en **Environment** agregá:
   - `FRONTEND_URL` → la dejás vacía por ahora; la completás después del paso 2 con la URL de Vercel (ej. `https://athlete-tracker.vercel.app`).

### Opción B — Manual

| Campo | Valor |
|--------|--------|
| Root Directory | `athlete-tracker-server` |
| Runtime | Node |
| Build Command | `npm install && npx prisma migrate deploy && npm run seed` |
| Start Command | `npm start` |
| Health Check Path | `/api/v1/health` |

**Variables de entorno (Render → Environment):**

| Variable | Valor |
|----------|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `file:./dev.db` |
| `JWT_SECRET` | Generá uno largo (Render puede auto-generar) |
| `FRONTEND_URL` | URL de Vercel (paso 2) |

5. **Deploy**. Cuando termine, copiá la URL de la API, ej.:
   `https://athlete-tracker-api.onrender.com`

6. Verificá en el navegador:
   - `https://TU-API.onrender.com/api/v1/health` → `{ "status": "ok", ... }`

> **Nota:** SQLite en Render usa disco efímero: si el servicio se reinicia, la DB puede resetearse. Para demo de portfolio alcanza; volvé a correr seed desde Shell de Render si hace falta: `npm run seed`.

### Seed en Render (si no hay usuario demo)

Render Dashboard → tu servicio → **Shell**:

```bash
npm run seed
```

Credenciales: `demo@athlete-tracker.dev` / `Demo1234`

---

## 2. Cliente en Vercel

1. Entrá a [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Importá el repo `Athlete_Tracker`.
3. Configuración:

| Campo | Valor |
|--------|--------|
| Framework Preset | Vite |
| Root Directory | `athlete-tracker-client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. **Environment Variables:**

| Variable | Valor |
|----------|--------|
| `VITE_API_URL` | `https://TU-API.onrender.com/api/v1` |

(Sin barra final. Reemplazá con tu URL real de Render.)

5. **Deploy**. Copiá la URL del sitio, ej. `https://athlete-tracker.vercel.app`

---

## 3. Enlazar frontend ↔ API

1. **Render** → Environment → editá `FRONTEND_URL` = URL de Vercel (sin `/` final).
2. **Redeploy** el servicio en Render (Manual Deploy) para aplicar CORS.
3. Abrí la URL de Vercel → **Ingresar** con demo:
   - Email: `demo@athlete-tracker.dev`
   - Contraseña: `Demo1234`

---

## 4. Checklist final

- [ ] `GET .../api/v1/health` responde OK
- [ ] Login demo funciona en producción
- [ ] Dashboard carga stats (no error de red/CORS)
- [ ] README del repo tiene link a la demo en vivo
- [ ] (Opcional) Capturas en `docs/screenshots/`

---

## Problemas frecuentes

| Síntoma | Solución |
|---------|----------|
| CORS / blocked by browser | `FRONTEND_URL` en Render debe coincidir exacto con la URL de Vercel |
| 401 en todas las rutas | Revisá `JWT_SECRET` en Render |
| Prisma / `proteinG` unknown | Build debe incluir `prisma migrate deploy` y `prisma generate` (postinstall) |
| Demo no existe | `npm run seed` en Shell de Render |
| Render “spin down” | Plan free duerme ~15 min; primera request tarda ~30 s |

---

## URLs para el portfolio

En tu README y CV, algo así:

- **Live demo:** https://tu-app.vercel.app  
- **API health:** https://tu-api.onrender.com/api/v1/health  
- **Repo:** https://github.com/guilleV12/Athlete_Tracker  
