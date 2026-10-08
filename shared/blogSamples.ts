/** Artículos de respaldo cuando la BD no tiene posts publicados. */

export type SampleBlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  createdAt: Date;
  published: boolean;
  content: string;
  imageUrl: string | null;
  authorId: number | null;
  updatedAt: Date;
};

const IMG_EXTRANJERIA =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663477079238/EPsBEv5tgtumuds5mHeEv6/icon-visados-CZGAQJNJUhJHH7FxgjBRWg.webp";

export const SAMPLE_BLOG_POSTS: SampleBlogPost[] = [
  {
    id: 101,
    title:
      "El Tribunal Supremo tumba varios artículos del Reglamento de Extranjería: así cambia la protección de menores, familias y arraigos",
    slug: "tribunal-supremo-reglamento-extranjeria-rd-1155-2024",
    excerpt:
      "El pasado 13 de julio, la Sala de lo Contencioso-Administrativo del Tribunal Supremo dictó una sentencia muy esperada sobre el Reglamento de Extranjería aprobado por el Real Decreto 1155/2024. El fallo anula una serie de artículos que...",
    category: "Extranjería",
    createdAt: new Date("2026-07-20"),
    published: true,
    imageUrl: IMG_EXTRANJERIA,
    authorId: null,
    updatedAt: new Date("2026-07-20"),
    content: `
<p>El 13 de julio de 2026, la Sala de lo Contencioso-Administrativo del Tribunal Supremo resolvió un recurso contra el Reglamento de Extranjería aprobado por el <strong>Real Decreto 1155/2024</strong>. El fallo anula varios preceptos y obliga a revisar cómo se aplican determinadas vías de regularización y protección.</p>
<h2>Impacto práctico</h2>
<ul>
  <li><strong>Menores y familias:</strong> se refuerza la necesidad de valorar el interés superior del menor en cada expediente.</li>
  <li><strong>Arraigos y autorizaciones:</strong> algunos criterios del reglamento quedan sin cobertura normativa inmediata hasta nueva regulación o instrucción.</li>
  <li><strong>Renovaciones y modificaciones:</strong> conviene revisar plazos y documentación con asesoramiento actualizado.</li>
</ul>
<h2>Qué te recomendamos</h2>
<p>Si tienes un expediente en curso o vas a presentar una solicitud próximamente, no asumas que el criterio anterior sigue vigente. En Tu Gestión Legal analizamos tu caso concreto y te orientamos sobre la vía más segura tras este fallo.</p>
<p><em>Este artículo es informativo y no sustituye una asesoría personalizada.</em></p>
`,
  },
  {
    id: 1,
    title: "Guía completa del arraigo social en 2025",
    slug: "guia-arraigo-social-2025",
    excerpt:
      "Todo lo que necesitas saber sobre los requisitos, documentación y proceso para solicitar el arraigo social en España. Actualizado con los últimos cambios normativos.",
    category: "Extranjería",
    createdAt: new Date("2025-12-15"),
    published: true,
    content: `
<p>El arraigo social es una autorización de residencia temporal por circunstancias excepcionales dirigida a personas extranjeras que llevan un tiempo en España e integradas en el entorno social.</p>
<h2>Requisitos habituales</h2>
<ul>
  <li>Permanencia continuada en España (según normativa vigente).</li>
  <li>Empadronamiento y documentación identificativa.</li>
  <li>Vínculos familiares o informe de inserción social, según el caso.</li>
  <li>Medios económicos o contrato de trabajo cuando proceda.</li>
</ul>
<p>Reserva una asesoría si quieres un plan de acción adaptado a tu caso.</p>
`,
    imageUrl: null,
    authorId: null,
    updatedAt: new Date("2025-12-15"),
  },
  {
    id: 2,
    title: "Nuevos requisitos para la nacionalidad española por residencia",
    slug: "requisitos-nacionalidad-espanola",
    excerpt:
      "Descubre los cambios recientes en los requisitos para obtener la nacionalidad española. Analizamos las pruebas CCSE y DELE, plazos y documentación necesaria.",
    category: "Nacionalidad",
    createdAt: new Date("2025-11-20"),
    published: true,
    content: `
<p>Para solicitar la nacionalidad española por residencia debes acreditar residencia legal continuada, integración y carecer de antecedentes penales, entre otros requisitos.</p>
<h2>Pruebas CCSE y DELE</h2>
<ul>
  <li><strong>CCSE:</strong> conocimientos constitucionales y socioculturales de España.</li>
  <li><strong>DELE A2</strong> (o superior): acreditación de lengua española, con excepciones según nacionalidad o estudios.</li>
</ul>
<p>Te acompañamos en la preparación del expediente y el seguimiento.</p>
`,
    imageUrl: null,
    authorId: null,
    updatedAt: new Date("2025-11-20"),
  },
  {
    id: 3,
    title: "Cómo apostillar documentos venezolanos desde España",
    slug: "apostillar-documentos-venezolanos",
    excerpt:
      "Guía paso a paso para apostillar tus documentos venezolanos sin necesidad de viajar a Venezuela. Proceso, tiempos y costes actualizados.",
    category: "Trámites Venezolanos",
    createdAt: new Date("2025-10-05"),
    published: true,
    content: `
<p>Muchos trámites en España exigen documentos venezolanos apostillados. Es posible gestionar partidas, actas y antecedentes sin desplazarte a Venezuela.</p>
<ol>
  <li>Identificar el documento necesario.</li>
  <li>Solicitarlo ante el organismo competente.</li>
  <li>Tramitar la apostilla.</li>
  <li>Recibir el documento para usarlo en España.</li>
</ol>
`,
    imageUrl: null,
    authorId: null,
    updatedAt: new Date("2025-10-05"),
  },
  {
    id: 4,
    title: "Renovación de residencia: errores comunes y cómo evitarlos",
    slug: "renovacion-residencia-errores",
    excerpt:
      "Los errores más frecuentes al renovar la tarjeta de residencia y cómo evitarlos. Plazos, documentación y consejos prácticos.",
    category: "Extranjería",
    createdAt: new Date("2025-09-12"),
    published: true,
    content: `
<p>Errores frecuentes: presentar fuera de plazo, medios económicos insuficientes, empadronamiento desactualizado u omisiones documentales.</p>
<p>Revisa el calendario de caducidad y prepara el expediente con antelación. Una revisión profesional reduce denegaciones y requerimientos.</p>
`,
    imageUrl: null,
    authorId: null,
    updatedAt: new Date("2025-09-12"),
  },
  {
    id: 5,
    title: "Reagrupación familiar: todo lo que debes saber",
    slug: "reagrupacion-familiar-guia",
    excerpt:
      "Guía completa sobre el proceso de reagrupación familiar en España. Requisitos económicos, vivienda y documentación necesaria.",
    category: "Extranjería",
    createdAt: new Date("2025-08-28"),
    published: true,
    content: `
<p>La reagrupación familiar permite traer a familiares a España de forma legal cuando cumples los requisitos de residencia, vivienda y medios económicos.</p>
<p>Analizamos tu caso y preparamos el expediente completo.</p>
`,
    imageUrl: null,
    authorId: null,
    updatedAt: new Date("2025-08-28"),
  },
  {
    id: 6,
    title: "Diferencias entre arraigo social, laboral y familiar",
    slug: "diferencias-arraigos",
    excerpt:
      "Analizamos las diferencias clave entre los tres tipos de arraigo disponibles en España y cuál se adapta mejor a tu situación.",
    category: "Extranjería",
    createdAt: new Date("2025-07-15"),
    published: true,
    content: `
<p>Cada modalidad de arraigo responde a una realidad distinta: integración social, vínculo laboral o familiar. Elegir mal la vía retrasa el proceso.</p>
<p>En una asesoría te indicamos la opción más sólida y el checklist de documentos.</p>
`,
    imageUrl: null,
    authorId: null,
    updatedAt: new Date("2025-07-15"),
  },
];

export function getSamplePostBySlug(slug: string): SampleBlogPost | undefined {
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  return SAMPLE_BLOG_POSTS.find((p) => p.slug.toLowerCase() === normalized);
}
