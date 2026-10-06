# Migración a Raiola Networks — Tu Gestión Legal

**Decisión:** Hosting Code / Node.js (plan básico recomendado: 2 GB RAM, 50 GB NVMe, 150 % CPU).  
**Dominio:** ya en IONOS (`www.tugestionlegal.es`). No incluir dominio en la contratación salvo oferta anual.  
**Estado actual:** producción en Railway; DNS/TLS de `www` apuntando a Railway.

Stack: Express + Vite SPA + MySQL + Stripe + SMTP + cron interno.

---

## 0. Contratar (ahora)

1. Plan básico: **2 GB / 50 GB / 150 % CPU**.
2. Periodo: **mensual** las primeras semanas (validar migración); luego valorar **anual**.
3. Anotar acceso a: panel (cPanel), SSH, MySQL, correo.
4. **No mover el DNS** hasta que la app responda bien en la URL temporal de Raiola.

Referencia de producto: https://raiolanetworks.com/hosting-nodejs/

---

## 1. Correo (aprovechar el hosting)

1. Crear cuenta `info@tugestionlegal.es` (y alias si hace falta).
2. Anotar SMTP: host, puerto **587** (TLS) o **465** (SSL), usuario = email completo, contraseña.
3. Probar envío/recepción desde webmail.
4. Cuando el correo viva en Raiola: configurar **MX / SPF / DKIM** en IONOS según indique el panel Raiola.

En la app usar `SMTP_USER` / `SMTP_PASS` (y `EMAIL_FROM` si aplica). Con SMTP de Raiola no hace falta `RESEND_API_KEY` salvo que se quiera como respaldo.

---

## 2. Base de datos

1. En cPanel: crear base MySQL + usuario con privilegios.
2. Armar `DATABASE_URL`:

   ```text
   mysql://USUARIO:PASSWORD@localhost:3306/NOMBRE_BD
   ```

3. Exportar MySQL de **Railway** (dump / panel) e **importar** en Raiola.
4. Verificar tablas críticas (`bookings`, usuarios, etc.).
5. Si el dump no trae el schema al día: `pnpm exec drizzle-kit migrate` tras el deploy.

---

## 3. Desplegar la aplicación

1. Subir código (Git + SSH, o Application Manager / selector Node de Raiola).
2. Versión Node: LTS compatible (**18 / 20 / 22** según panel).
3. En el directorio del proyecto:

   ```bash
   corepack enable
   pnpm install --frozen-lockfile
   pnpm build
   pnpm exec drizzle-kit migrate   # si hace falta
   ```

4. Arranque producción (según lo que ofrezca Raiola):

   ```bash
   NODE_ENV=production node dist/index.js
   ```

   O el “startup file” / Application Manager / Passenger que indique su documentación.

5. Configurar proxy inverso al puerto de la app + **HTTPS** (Let’s Encrypt en cPanel).
6. Healthcheck: `GET /api/health` → `{ ok: true, database: "ok" }`.

> El `Dockerfile` del repo está pensado para Railway/Render. En Raiola Code lo habitual es deploy **sin Docker** (Node + MySQL del panel). Si más adelante usan VPS Raiola, sí se puede reutilizar Docker.

---

## 4. Variables de entorno

Definir en el panel / `.env` de producción (no versionar secretos):

| Variable | Notas |
|----------|--------|
| `DATABASE_URL` | MySQL Raiola |
| `JWT_SECRET` | String largo; puede reutilizar el de Railway o rotar |
| `NODE_ENV` | `production` |
| `PORT` | El que asigne Raiola / el que escuche la app |
| `PUBLIC_APP_URL` | Primero URL temporal Raiola; luego `https://www.tugestionlegal.es` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Login `/login` |
| `SMTP_USER` / `SMTP_PASS` | Cuenta de correo Raiola |
| `EMAIL_FROM` | Opcional; p. ej. `Tu Gestión Legal <info@tugestionlegal.es>` |
| `ADMIN_NOTIFY_EMAIL` | Opcional |
| `STRIPE_SECRET_KEY` | Test o live según entorno |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Requiere **rebuild** si cambia |
| `STRIPE_WEBHOOK_SECRET` | Tras crear webhook al dominio final |
| `CRON_SECRET` | Para `/api/scheduled/*` si usan cron externo |
| `GOOGLE_PLACES_API_KEY` (+ Place ID / review URL) | Si aplica |

Copiar el resto de vars útiles desde Railway (`npx @railway/cli variable list`) sin pegarlas en el chat ni en el repo.

---

## 5. Smoke en URL Raiola (DNS aún en Railway)

Probar **antes** de cambiar DNS:

- [ ] `GET /api/health`
- [ ] Home y páginas estáticas
- [ ] Login admin (`/login`)
- [ ] Crear reserva → fila en BD
- [ ] Stripe test (Checkout + webhook a la URL Raiola temporal, o Stripe CLI)
- [ ] Email de contacto / reserva por SMTP Raiola
- [ ] Subida de documentos (disco `uploads/` en este hosting **sí persiste**, a diferencia de PaaS efímero)

---

## 6. DNS (IONOS) — corte controlado

1. Anotar el destino que indique Raiola para `www` (CNAME o A).
2. En IONOS: cambiar CNAME/A de `www` **desde Railway → Raiola**.
3. Ajustar **MX** (y SPF/DKIM) si el correo pasa a Raiola.
4. Actualizar `PUBLIC_APP_URL=https://www.tugestionlegal.es` y reiniciar/redeploy.
5. **Stripe** → Webhooks: URL  
   `https://www.tugestionlegal.es/api/stripe/webhook`  
   Eventos: `checkout.session.completed`, `checkout.session.expired`.  
   Guardar el nuevo `whsec_…` en `STRIPE_WEBHOOK_SECRET`.
6. Comprobar TLS y `https://www.tugestionlegal.es/api/health`.
7. Redirect apex `tugestionlegal.es` → `https://www.tugestionlegal.es` (si aún no está).

---

## 7. Cierre y operación

1. Cron en cPanel (opcional, si quieren refuerzo):

   ```http
   POST https://www.tugestionlegal.es/api/scheduled/sendReminders
   Authorization: Bearer <CRON_SECRET>
   ```

   Igual para `sendNewsletter`. Los timers internos del proceso ya corren cada hora.

2. Activar **backups** MySQL / cPanel.
3. Dejar Railway encendido **48–72 h** en paralelo; si todo estable → pausar/eliminar proyecto Railway.
4. Actualizar `ESTATUS_PROYECTO.md` y este documento con fechas reales.

---

## Orden resumido

```text
Contratar
  → Correo + MySQL
  → Deploy + variables
  → Smoke en URL Raiola
  → DNS IONOS + webhook Stripe
  → Backups + apagar Railway
```

---

## Referencias

- App actual: `DEPLOY.md` (Railway)
- DNS IONOS: `DNS_RAILWAY.md` (actualizar destinos al migrar)
- Email: `EMAIL_RESEND.md` (queda como alternativa; prioridad SMTP Raiola)
- Stripe: `STRIPE.md`
- Backup: `BACKUP_RAILWAY.md` (equivalente en cPanel Raiola)
