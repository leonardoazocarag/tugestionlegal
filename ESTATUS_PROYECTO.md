# Estatus del proyecto — Tu Gestión Legal

**Fecha:** 23 de septiembre de 2026  
**Repo:** https://github.com/VRB235/TuGestionLegal  
**URL prod:** https://www.tugestionlegal.es  
**URL Railway:** https://web-production-8a7ae.up.railway.app

---

## Veredicto

Dominio **www** en Railway (IONOS): verificado + TLS OK + health 200.  
Pendientes: **`RESEND_API_KEY`**, smoke Stripe UI, backup MySQL, opcional alinear CNAME a `a5p3tnti.up.railway.app`.

---

## Roadmap

| Fase | Estado |
|------|--------|
| **0–2** | ✅ |
| **3** Producción | 🟡 ~90% — dominio www + TLS OK; falta email/backup |
| **4** Stripe | 🟡 ~95% — claves cuenta actual + webhook OK; booking #8 paid vía webhook |
| **5** Mejoras | ⏳ |

### Hecho (22-sep)
- Claves Stripe test de la cuenta actual en Railway + webhook
- Smoke: `booking.create` → Checkout URL → webhook firmado → **#8** `paid`/`confirmed`
- Health Railway `200`
- `PUBLIC_APP_URL` = URL Railway (correcto mientras www no resuelva)

### DNS (23-sep)
- IONOS: CNAME `www` → Railway; dominio **verified** + cert **VALID**
- Health `https://www.tugestionlegal.es/api/health` → 200
- `PUBLIC_APP_URL` = `https://www.tugestionlegal.es`

### Pendiente corto
1. Pegar `RESEND_API_KEY` — ver `EMAIL_RESEND.md`
2. Pago manual `4242` en Chrome (opcional)
3. Backup MySQL — ver `BACKUP_RAILWAY.md`
4. Opcional IONOS: CNAME `www` → `a5p3tnti.up.railway.app` (destino nuevo Railway)

---

## Fuentes

- `DEPLOY.md` · `DEPLOY_RAIOLA.md` · `DNS_RAILWAY.md` · `EMAIL_RESEND.md` · `STRIPE.md` · `BACKUP_RAILWAY.md`
