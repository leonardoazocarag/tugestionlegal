# Análisis SEO — Tu Gestión Legal

**Fecha:** 20 de agosto de 2026
**Dominio:** www.tugestionlegal.es
**Autor:** Manus AI

---

## 1. Estado Actual del SEO

### 1.1 Meta Tags

La página principal cuenta con meta tags optimizados que cumplen con las mejores prácticas de SEO on-page.

| Meta Tag | Valor | Estado |
|----------|-------|--------|
| Title | "Tu Gestión Legal - Despacho de Extranjería y Gestión Documental" | Correcto (62 caracteres, dentro del rango 50-60) |
| Description | "Despacho especializado en extranjería y gestión documental. Trámites administrativos, nacionalidad y asesoría legal en español e inglés." | Correcto (142 caracteres, dentro del rango 120-160) |
| Keywords | "extranjería, nacionalidad española, trámites administrativos, trámites venezolanos, asesoría legal online, gestiones administrativas" | Presente (6 keywords relevantes) |
| OG:Title | "Tu Gestión Legal - Despacho de Extranjería" | Correcto |
| OG:Description | "Soluciones legales claras para tu tranquilidad..." | Correcto |
| OG:Type | "website" | Correcto |
| Viewport | "width=device-width, initial-scale=1.0, maximum-scale=1" | Correcto |
| Charset | UTF-8 | Correcto |

### 1.2 Datos Estructurados (Schema Markup)

Se han implementado 2 bloques de JSON-LD con datos estructurados que permiten a Google mostrar información enriquecida en los resultados de búsqueda.

**LocalBusiness / LegalService:**
- Nombre, descripción, teléfono, email, URL
- Horario de apertura (L-V 9:00-17:00, S 10:00-14:00)
- Área de servicio: España
- Idiomas: español, inglés
- 2 ofertas con precio (Videoconferencia 47€, Inmobiliaria 63€)

**FAQPage:**
- 6 preguntas frecuentes indexables por Google
- Temas: documentos necesarios, duración, cancelación, videoconferencia, plazos, idiomas

Estos datos estructurados permiten que Google muestre rich snippets con estrellas, precios, horarios y FAQs directamente en los resultados de búsqueda.

### 1.3 Rendimiento y Accesibilidad

| Factor | Estado | Nota |
|--------|--------|------|
| HTTPS/SSL | Activo | Certificado SSL válido en www.tugestionlegal.es |
| Responsive | Completo | Diseño mobile-first con breakpoints |
| Lazy loading | Parcial | Páginas con lazy loading (React.lazy) |
| Imágenes WebP | Sí | Todas las imágenes en formato WebP optimizado |
| CDN | Sí | Imágenes servidas desde CloudFront |
| robots.txt | Presente | En client/public/ |
| Fuentes | Google Fonts (Montserrat) | Carga externa |

---

## 2. Fortalezas SEO

El sitio tiene una estructura semántica HTML correcta con encabezados jerárquicos (H1, H2, H3) bien organizados. Los datos estructurados JSON-LD proporcionan información rica a los motores de búsqueda. Las URLs son limpias y descriptivas en español (`/servicios-juridicos`, `/asesorias`, `/packs`). El contenido del blog con 3 artículos publicados genera tráfico orgánico de cola larga. Las 6 preguntas frecuentes (FAQ) en la home están marcadas con Schema FAQPage, lo que permite aparecer en los featured snippets de Google. La integración con Google Reviews muestra la puntuación 5.0 con estrellas, generando confianza social.

---

## 3. Áreas de Mejora SEO

### 3.1 Prioridad Alta

| Mejora | Impacto | Implementación |
|--------|---------|----------------|
| Google Analytics | Alto | Crear propiedad GA4, añadir ID en Settings > Secrets. Ya está preparado en el código |
| Google Search Console | Alto | Verificar propiedad, enviar sitemap.xml, monitorizar indexación |
| Sitemap.xml dinámico | Alto | Generar sitemap.xml con todas las rutas y artículos del blog |
| Meta tags por página | Alto | Cada página debería tener su propio title y description únicos |
| Imagen OG | Alto | Añadir og:image con imagen representativa del despacho |

### 3.2 Prioridad Media

| Mejora | Impacto | Implementación |
|--------|---------|----------------|
| Blog regular | Alto | Publicar 1-2 artículos semanales sobre novedades en extranjería |
| Landing pages específicas | Alto | Crear páginas dedicadas para "arraigo social España", "nacionalidad española requisitos", etc. |
| Alt text en imágenes | Medio | Añadir atributos alt descriptivos a todas las imágenes |
| Canonical URLs | Medio | Añadir link rel="canonical" en cada página |
| Hreflang | Medio | Si se implementa versión en inglés, añadir hreflang tags |
| Velocidad de carga | Medio | Optimizar First Contentful Paint y Largest Contentful Paint |

### 3.3 Prioridad Baja

| Mejora | Impacto | Implementación |
|--------|---------|----------------|
| Breadcrumbs | Bajo | Añadir migas de pan con Schema BreadcrumbList |
| Internal linking | Medio | Mejorar enlaces internos entre servicios relacionados |
| Blog categories | Bajo | Crear páginas de categoría (/blog/extranjeria, /blog/fiscal) |
| AMP | Bajo | Versión AMP para artículos del blog (opcional) |

---

## 4. Keywords Objetivo

Basándose en el nicho de extranjería y gestión documental en España, estas son las keywords principales a trabajar:

### Keywords Principales (alta competencia)
| Keyword | Volumen estimado | Página objetivo |
|---------|-----------------|-----------------|
| abogado extranjería | Alto | /servicios-juridicos |
| nacionalidad española | Alto | /servicios-juridicos |
| arraigo social España | Alto | /servicios-juridicos |
| trámites extranjería | Alto | /servicios-juridicos |
| asesoría legal online | Medio | /asesorias |

### Keywords de Cola Larga (menor competencia, mayor conversión)
| Keyword | Página objetivo |
|---------|-----------------|
| renovación residencia España | /servicios-juridicos |
| reagrupación familiar requisitos | /servicios-juridicos |
| apostillar documentos venezolanos | /servicios-internacionales |
| partida de nacimiento Venezuela España | /servicios-internacionales |
| asesoría inmobiliaria extranjeros | /asesorias |
| pack trámites extranjería | /packs |
| certificado digital España | /servicios-administrativos |

---

## 5. Competencia SEO

Los principales competidores en el nicho de extranjería online en España incluyen webs como legalizados.es, parainmigrantes.info, y extranjeria.gob.es. La ventaja competitiva de Tu Gestión Legal reside en la combinación de servicios jurídicos + administrativos + internacionales en una sola plataforma, con reserva y pago online integrado. El blog con contenido actualizado sobre novedades legales es una herramienta clave para posicionamiento orgánico.

---

## 6. Recomendaciones Inmediatas

1. **Configurar Google Search Console** verificando la propiedad con el registro DNS TXT o el meta tag. Enviar el sitemap.xml y monitorizar la indexación de las 18 páginas.

2. **Activar Google Analytics** creando una propiedad GA4 en analytics.google.com para www.tugestionlegal.es y añadiendo el ID de medición (G-XXXXXXXXXX) en Settings > Secrets del panel de gestión.

3. **Publicar contenido regular en el blog** con al menos 1-2 artículos semanales sobre temas de alta búsqueda: "requisitos arraigo social 2026", "cómo renovar residencia España", "documentos nacionalidad española". Cada artículo debe tener entre 800-1500 palabras con keywords naturales.

4. **Crear landing pages específicas** para los servicios más buscados (arraigo social, nacionalidad, reagrupación familiar) con contenido detallado, FAQs específicas y CTAs claros.

5. **Añadir og:image** con una imagen profesional del despacho para mejorar la apariencia cuando se comparte en redes sociales.

