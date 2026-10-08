# Documentación Técnica — Tu Gestión Legal

**Fecha:** 20 de agosto de 2026
**Versión:** 1a4de039
**Autor:** Manus AI

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 19.x |
| Routing | Wouter | 3.x |
| Estilos | Tailwind CSS | 4.x |
| Componentes UI | shadcn/ui | latest |
| Bundler | Vite | 6.x |
| Backend | Express | 4.x |
| API | tRPC | 11.x |
| ORM | Drizzle ORM | 0.39.x |
| Base de datos | MySQL / TiDB | 8.0+ |
| Pagos | Stripe | 17.x |
| Email | Nodemailer (Gmail SMTP) | 6.x |
| Almacenamiento | AWS S3 | SDK v3 |
| Lenguaje | TypeScript | 5.x |
| Tests | Vitest | 3.x |
| Runtime | Node.js | 22.x |
| Gestor paquetes | pnpm | 9.x |

---

## 2. Arquitectura del Proyecto

El proyecto sigue una arquitectura monolítica full-stack con separación clara entre cliente y servidor. El servidor Express sirve tanto la API tRPC como los archivos estáticos del frontend compilado. La comunicación entre frontend y backend es exclusivamente a través de tRPC, lo que garantiza tipado end-to-end.

```
┌─────────────────────────────────────────────┐
│                  CLIENTE                     │
│  React 19 + Tailwind 4 + shadcn/ui          │
│  ├── Pages (18 rutas)                       │
│  ├── Components (Layout, Navigation, UI)    │
│  └── tRPC Client (hooks tipados)            │
├─────────────────────────────────────────────┤
│                  SERVIDOR                    │
│  Express 4 + tRPC 11                        │
│  ├── Routers (booking, blog, contact, etc.) │
│  ├── Stripe Webhook (/api/stripe/webhook)   │
│  ├── Booking Actions (confirm/reject)       │
│  ├── Scheduled Jobs (reminders, newsletter) │
│  └── Email Service (Nodemailer/Gmail)       │
├─────────────────────────────────────────────┤
│              ALMACENAMIENTO                  │
│  MySQL/TiDB (datos) + S3 (archivos)         │
└─────────────────────────────────────────────┘
```

---

## 3. Estructura de Archivos

```
tu-gestion-legal/
├── client/
│   ├── index.html              ← HTML principal con meta tags, GA y Schema markup
│   ├── public/                 ← favicon.ico, robots.txt
│   └── src/
│       ├── App.tsx             ← Rutas y layout principal
│       ├── main.tsx            ← Providers (Theme, tRPC, Auth)
│       ├── index.css           ← Variables CSS, tema global, Tailwind
│       ├── pages/              ← 18 componentes de página
│       │   ├── Home.tsx        ← Landing con contadores, reseñas, FAQ
│       │   ├── Reservas.tsx    ← Sistema de reservas con Stripe
│       │   ├── Blog.tsx        ← Listado + newsletter
│       │   ├── BlogPost.tsx    ← Detalle editorial con compartir
│       │   └── ...             ← Resto de páginas
│       ├── components/
│       │   ├── Layout.tsx      ← Header, nav desplegable, footer
│       │   └── ui/             ← Componentes shadcn/ui
│       ├── lib/
│       │   └── trpc.ts         ← Cliente tRPC configurado
│       └── hooks/              ← Custom hooks
├── server/
│   ├── _core/                  ← Framework (NO EDITAR)
│   │   ├── index.ts            ← Express app, Stripe webhook, booking actions
│   │   ├── env.ts              ← Variables de entorno tipadas
│   │   ├── heartbeat.ts        ← SDK tareas programadas
│   │   └── ...                 ← OAuth, context, trpc setup
│   ├── routers.ts              ← Procedimientos tRPC (booking, blog, contact, reviews, newsletter)
│   ├── db.ts                   ← Helpers de base de datos (Drizzle)
│   ├── email.ts                ← 5 funciones de email (notificación, confirmación, rechazo, recordatorio, newsletter)
│   ├── stripe-products.ts      ← Productos Stripe (videoconferencia 47€, inmobiliaria 63€)
│   ├── storage.ts              ← Helpers S3 (storagePut, storageGet)
│   └── *.test.ts               ← Tests unitarios (4 archivos, 33 tests)
├── shared/
│   ├── data.ts                 ← Datos centrales: servicios, asesorías, packs, contacto, redes sociales
│   └── bookableServices.ts     ← Servicios reservables (videoconferencia, inmobiliaria)
├── drizzle/
│   ├── schema.ts               ← Esquema de 6 tablas
│   └── 000X_*.sql              ← Migraciones SQL
├── package.json
├── tsconfig.json
├── vite.config.ts
└── todo.md                     ← Historial completo de features
```

---

## 4. Base de Datos (6 tablas)

### users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK AUTO | ID único |
| openId | VARCHAR(255) UNIQUE | ID OAuth de Manus |
| name | VARCHAR(255) | Nombre del usuario |
| role | ENUM('admin','user') | Rol (admin para panel) |
| createdAt | TIMESTAMP | Fecha de registro |
| lastSignedIn | TIMESTAMP | Último acceso |

### bookings
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK AUTO | ID único |
| name | VARCHAR(255) | Nombre del cliente |
| email | VARCHAR(320) | Email del cliente |
| phone | VARCHAR(50) | Teléfono |
| serviceType | VARCHAR(100) | Tipo de asesoría |
| date | VARCHAR(20) | Fecha (YYYY-MM-DD) |
| time | VARCHAR(10) | Hora (HH:MM) |
| message | TEXT | Descripción del caso |
| stripeSessionId | VARCHAR(255) | ID sesión Stripe |
| paymentStatus | ENUM('unpaid','paid','refunded') | Estado del pago |
| status | ENUM('pending','confirmed','cancelled') | Estado de la cita |
| reminderSent | BOOLEAN | Si se envió recordatorio |
| createdAt | TIMESTAMP | Fecha de creación |

### contactMessages
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK AUTO | ID único |
| name, email, phone | VARCHAR | Datos del contacto |
| subject | VARCHAR(255) | Asunto |
| message | TEXT | Mensaje |
| read | BOOLEAN | Leído por admin |
| createdAt | TIMESTAMP | Fecha |

### blogPosts
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK AUTO | ID único |
| title | VARCHAR(500) | Título del artículo |
| slug | VARCHAR(500) UNIQUE | URL amigable |
| excerpt | TEXT | Extracto |
| content | TEXT | Contenido HTML |
| category | VARCHAR(100) | Categoría |
| imageUrl | TEXT | URL imagen destacada |
| published | BOOLEAN | Publicado |
| authorId | INT | Autor |
| createdAt, updatedAt | TIMESTAMP | Fechas |

### clientDocuments
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK AUTO | ID único |
| clientName, clientEmail | VARCHAR | Datos del cliente |
| fileName, fileKey, fileUrl | VARCHAR/TEXT | Referencia S3 |
| mimeType | VARCHAR(100) | Tipo MIME |
| fileSize | INT | Tamaño en bytes |
| createdAt | TIMESTAMP | Fecha |

### newsletterSubscribers
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT PK AUTO | ID único |
| name | VARCHAR(255) | Nombre |
| email | VARCHAR(320) UNIQUE | Email |
| active | BOOLEAN | Suscripción activa |
| createdAt | TIMESTAMP | Fecha |

---

## 5. Endpoints API

### tRPC Procedures

| Router | Procedimiento | Tipo | Auth | Descripción |
|--------|--------------|------|------|-------------|
| booking | create | mutation | public | Crear reserva + checkout Stripe |
| booking | list | query | admin | Listar todas las reservas |
| booking | updateStatus | mutation | admin | Confirmar/rechazar reserva |
| booking | occupiedSlots | query | public | Slots ocupados por fecha |
| blog | published | query | public | Artículos publicados |
| blog | bySlug | query | public | Artículo por slug |
| blog | create | mutation | admin | Crear artículo |
| blog | update | mutation | admin | Editar artículo |
| blog | delete | mutation | admin | Eliminar artículo |
| contact | submit | mutation | public | Enviar formulario contacto |
| documents | upload | mutation | public | Subir documento a S3 |
| newsletter | subscribe | mutation | public | Suscribirse al newsletter |
| newsletter | unsubscribe | mutation | public | Cancelar suscripción |
| reviews | getGoogleReviews | query | public | Obtener reseñas de Google |
| auth | me | query | public | Usuario actual |
| auth | logout | mutation | protected | Cerrar sesión |

### Express Routes (fuera de tRPC)

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/stripe/webhook` | POST | Webhook de Stripe (raw body) |
| `/api/booking-action` | GET | Confirmar/rechazar desde email |
| `/api/scheduled/sendReminders` | POST | Cron: recordatorios 24h |
| `/api/scheduled/sendNewsletter` | POST | Cron: newsletter semanal |

---

## 6. Flujo de Pago (Stripe)

1. Cliente selecciona asesoría y completa formulario
2. Backend crea booking (status: pending, paymentStatus: unpaid)
3. Backend crea Stripe Checkout Session con precio correspondiente
4. Cliente es redirigido a Stripe Checkout (misma pestaña)
5. Tras pago exitoso, Stripe envía webhook `checkout.session.completed`
6. Backend actualiza paymentStatus a "paid" y envía email al admin
7. Admin confirma/rechaza desde el email
8. Cliente recibe email de confirmación (sin datos de pago si ya pagó online)

**Productos Stripe configurados:**
- Videoconferencia: 47€ (4700 cents)
- Inmobiliaria: 63€ (6300 cents)

---

## 7. Tareas Programadas (Heartbeat/Cron)

| Tarea | Frecuencia | Hora (España) | Descripción |
|-------|-----------|---------------|-------------|
| daily-reminder-24h | Diaria | 20:00 | Envía recordatorio a clientes con cita confirmada para mañana |
| weekly-newsletter | Lunes | 09:00 | Envía newsletter con artículos de la última semana |

Para servidor propio, reemplazar por cron jobs:
```bash
# Recordatorio diario 20:00 hora España (18:00 UTC verano)
0 18 * * * curl -X POST http://localhost:3000/api/scheduled/sendReminders
# Newsletter lunes 09:00 hora España (07:00 UTC verano)
0 7 * * 1 curl -X POST http://localhost:3000/api/scheduled/sendNewsletter
```

---

## 8. Despliegue en Servidor Propio

### Requisitos
- Node.js 18+ y pnpm
- MySQL 8.0+ o TiDB
- Nginx como reverse proxy
- PM2 como gestor de procesos
- Certificado SSL (Let's Encrypt)
- Bucket S3 compatible

### Pasos
```bash
# 1. Clonar e instalar
git clone <repo> && cd tu-gestion-legal
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con todas las variables (ver documento de secretos)

# 3. Compilar
pnpm build

# 4. Aplicar migraciones
# Ejecutar los SQL de drizzle/*.sql en orden

# 5. Iniciar con PM2
pm2 start dist/server/index.js --name tu-gestion-legal

# 6. Configurar Nginx
# Ver ejemplo de configuración abajo

# 7. Configurar cron jobs
crontab -e
# Añadir las líneas de la sección 7
```

### Nginx (ejemplo)
```nginx
server {
    listen 443 ssl;
    server_name www.tugestionlegal.es;
    ssl_certificate /etc/letsencrypt/live/tugestionlegal.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tugestionlegal.es/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 9. Adaptaciones para Servidor Propio

### Autenticación
El sistema actual usa Manus OAuth. Para servidor propio, implementar autenticación propia en `server/_core/oauth.ts` y `server/_core/context.ts`. Las páginas públicas no requieren autenticación. Solo el panel admin (`/admin/reservas`) necesita login.

### Almacenamiento S3
Reconfigurar `server/storage.ts` con credenciales propias de AWS S3, MinIO o DigitalOcean Spaces. Las funciones `storagePut` y `storageGet` son agnósticas del proveedor.

### Tareas Programadas
Reemplazar Heartbeat por cron jobs del sistema operativo (ver sección 7). Los endpoints `/api/scheduled/*` ya están implementados y solo necesitan ser llamados periódicamente.

---

## 10. Convenciones de Código

- **TypeScript estricto** en todo el proyecto (0 errores TSC).
- **tRPC** para toda comunicación frontend-backend (nunca fetch/axios directo).
- **Drizzle ORM** para queries (helpers en `server/db.ts`).
- **shadcn/ui** para componentes de interfaz.
- **Tailwind CSS 4** con variables CSS para tema.
- **Vitest** para tests unitarios.
- **Timestamps UTC** en base de datos, conversión a local en frontend.
- **S3** para archivos, nunca almacenar bytes en la base de datos.
