// Shared data constants for Tu Gestión Legal

export const CONTACT_INFO = {
  phone: "+34 614 00 25 10",
  email: "info@tugestionlegal.es",
  whatsapp: "https://wa.me/34614002510",
  instagram: "https://www.instagram.com/tugestionlegal",
  facebook: "https://www.facebook.com/share/1AtqGWqSZh/",
  tiktok: "https://www.tiktok.com/@tugestionlegal",
  address: "España - Atención Online",
  googleMapsUri: "https://maps.google.com/?cid=6408978783119166493",
  googleWriteReviewUri: "https://g.page/r/CR1M1Tw_RPFYEBM/review",
  googlePlaceId: "ChIJM_DeDM_wpw8RHUzVPD9E8Vg",
} as const;

export const ASESORIAS = [
  {
    id: "asesoria-videoconferencia",
    name: "Asesoría por Videoconferencia",
    subtitle: "Zoom / Google Meet",
    price: 47,
    duration: "45 minutos",
    targetAudience: "Clientes que necesitan orientación personalizada sobre su caso, ya sea de extranjería, administrativo o inmobiliario.",
    description: "Sesión personalizada por videoconferencia donde analizamos tu caso en detalle. Recibirás orientación profesional y un plan de acción claro.",
    includes: [
      "Videollamada de 45 minutos",
      "Análisis personalizado de tu caso",
      "Plan de acción detallado",
      "Resumen por email post-consulta",
      "Orientación sobre documentación necesaria",
    ],
    popular: true,
  },
  {
    id: "asesoria-inmobiliaria",
    name: "Asesoría Inmobiliaria",
    subtitle: "Compraventa / Alquiler",
    price: 60,
    duration: "45 minutos",
    targetAudience: "Compradores, vendedores o inquilinos que necesitan asesoramiento legal antes de firmar un contrato inmobiliario.",
    description: "Asesoramiento legal especializado en operaciones inmobiliarias: compraventa, alquileres, contratos y cuestiones registrales. Te acompañamos para que tomes decisiones seguras.",
    includes: [
      "Revisión de contratos de compraventa o alquiler",
      "Análisis de situación registral del inmueble",
      "Orientación sobre impuestos asociados (ITP, IBI)",
      "Asesoría sobre cláusulas contractuales",
      "Informe con recomendaciones",
    ],
  },
] as const;

// ── SERVICIOS JURÍDICOS ──

export const SERVICIOS_EXTRANJERIA = [
  {
    id: "residencias",
    name: "Residencias",
    description: "Gestión integral de autorizaciones de residencia en España: solicitudes iniciales, renovaciones y modificaciones. Te acompañamos en todo el proceso para que mantengas tu estatus legal.",
    requirements: ["Pasaporte en vigor", "Empadronamiento", "Justificante de medios económicos", "Seguro médico (si aplica)", "Documentación específica según tipo de residencia"],
  },
  {
    id: "arraigos",
    name: "Arraigos",
    description: "Tramitación de autorizaciones de residencia por arraigo. Puede ser laboral, social, familiar o para la formación. Analizamos tu caso y preparamos toda la documentación necesaria para la modalidad que mejor se adapte a tu situación.",
    requirements: ["Permanencia continuada en España", "Pasaporte", "Empadronamiento", "Documentación específica según tipo de arraigo", "Contrato de trabajo o vínculos familiares (según modalidad)"],
  },
  {
    id: "renovaciones",
    name: "Renovaciones",
    description: "Gestión de renovaciones de autorizaciones de residencia y trabajo. Controlamos los plazos y preparamos toda la documentación para que no pierdas tu estatus legal.",
    requirements: ["Autorización de residencia vigente o en plazo de renovación", "Pasaporte en vigor", "Empadronamiento actualizado", "Justificante de medios económicos", "Documentación laboral o de estudios según caso"],
  },
  {
    id: "reagrupacion-familiar",
    name: "Reagrupación Familiar",
    description: "Gestión del proceso de reagrupación familiar para traer a tus seres queridos a España de forma legal.",
    requirements: ["Autorización de residencia renovada", "Medios económicos suficientes", "Vivienda adecuada", "Documentación del familiar a reagrupar"],
  },
  {
    id: "tarjeta-comunitaria",
    name: "Tarjeta de Familiar de Ciudadano Español / Comunitario",
    description: "Solicitud de tarjeta de familiar de ciudadano español o de la Unión Europea. Tramitamos tu derecho a residir en España.",
    requirements: [
      "Vínculo con ciudadano español/UE.",
      "Pasaporte",
      "Documentación acreditativa del vínculo",
      "Documentación específica según tipo solicitud.",
    ],
  },
  {
    id: "estancia-estudios",
    name: "Estancia por Estudios",
    description: "Tramitación de visados y autorizaciones de estancia por estudios en España.",
    requirements: ["Carta de admisión del centro educativo", "Seguro médico", "Medios económicos", "Pasaporte"],
  },
] as const;

export const NACIONALIDAD = {
  id: "nacionalidad-espanola",
  name: "Nacionalidad Española",
  description: "Tramitación completa de la solicitud de nacionalidad española. Ofrecemos diferentes paquetes según tus necesidades.",
  requirements: [
    "Residencia legal continuada",
    "Carecer de antecedentes penales",
    "CCSE aprobado",
    "DELE A2 o superior",
    "Empadronamiento",
    "Documentación específica según tipo solicitud.",
  ],
  packs: [
    { id: "paquete-basico", name: "Paquete Básico", description: "Preparación y presentación de la solicitud de nacionalidad. Incluye revisión documental y seguimiento básico del expediente." },
    { id: "paquete-completo", name: "Paquete Completo", description: "Servicio integral: preparación, presentación, seguimiento continuo, recursos si es necesario y todos los trámites post-concesión (DNI, pasaporte, Seguridad Social)." },
  ],
} as const;

export const RECURSOS_ADMINISTRATIVOS = {
  id: "recursos-administrativos",
  name: "Recursos Administrativos",
  description: "Interposición de recursos administrativos contra denegaciones o resoluciones desfavorables en materia de extranjería y nacionalidad.",
  requirements: [
    "Documentación del expediente original",
    "Documentación específica según tipo solicitud.",
  ],
} as const;

// ── SERVICIOS ADMINISTRATIVOS ──

export const SERVICIOS_ADMINISTRATIVOS = [
  {
    id: "dgt",
    name: "DGT",
    description: "Gestión integral de trámites ante la Dirección General de Tráfico: transferencias de vehículos, matriculaciones, bajas, duplicados de permisos y más.",
  },
  {
    id: "aeat",
    name: "AEAT",
    description: "Trámites y gestiones ante la Agencia Tributaria: declaraciones de IRPF, certificados tributarios, consultas fiscales, sanciones, procedimiento sancionador, entre otros.",
  },
  {
    id: "seguridad-social",
    name: "Seguridad Social",
    description: "Gestiones ante la Seguridad Social: vida laboral, prestaciones, informes de cotización, sanciones, devolución de ingresos indebidos y más.",
  },
  {
    id: "ibi",
    name: "IBI",
    description: "Gestión del Impuesto sobre Bienes Inmuebles: altas, bajas, bonificaciones y recursos ante el Ayuntamiento.",
  },
  {
    id: "ivtm",
    name: "IVTM",
    description: "Tramitación del Impuesto sobre Vehículos de Tracción Mecánica: altas, bajas, exenciones y bonificaciones.",
  },
  {
    id: "bonificaciones",
    name: "Bonificaciones",
    description: "Gestión de bonificaciones fiscales y administrativas a las que puedas tener derecho: familia numerosa, discapacidad, eficiencia energética y más.",
  },
  {
    id: "certificados",
    name: "Certificados",
    description: "Solicitud y obtención de todo tipo de certificados administrativos: certificado de empadronamiento, de convivencia, de estar al corriente de pagos y más.",
  },
  {
    id: "gestiones-ayuntamientos",
    name: "Gestiones con Ayuntamientos",
    description: "Tramitación de gestiones ante ayuntamientos: licencias, permisos, solicitudes y cualquier procedimiento municipal.",
  },
  {
    id: "certificado-digital",
    name: "Certificado Digital",
    description: "Asistencia en la obtención y renovación del certificado digital de persona física o jurídica ante la FNMT.",
  },
] as const;

// ── SERVICIOS INTERNACIONALES: VENEZUELA ──

export const SERVICIOS_VENEZUELA = [
  {
    id: "partida-nacimiento",
    name: "Partida de Nacimiento",
    description: "Gestión y obtención de partidas de nacimiento venezolanas. Tramitamos la solicitud ante los organismos competentes de Venezuela sin que necesites desplazarte.",
  },
  {
    id: "acta-matrimonio",
    name: "Acta de Matrimonio",
    description: "Obtención de actas de matrimonio emitidas en Venezuela. Gestionamos todo el proceso de solicitud y envío del documento.",
  },
  {
    id: "acta-defuncion",
    name: "Acta de Defunción",
    description: "Tramitación de actas de defunción venezolanas necesarias para procesos legales en España u otros países.",
  },
  {
    id: "antecedentes-penales",
    name: "Certificado de Antecedentes Penales",
    description: "Obtención del certificado de antecedentes penales venezolano, documento esencial para trámites de extranjería en España.",
  },
  {
    id: "cancelacion-antecedentes",
    name: "Cancelación de Antecedentes Penales",
    description: "Gestión del proceso de cancelación de antecedentes penales ante las autoridades venezolanas competentes.",
  },
  {
    id: "poderes",
    name: "Poderes",
    description: "Redacción y tramitación de poderes notariales para gestiones en Venezuela desde España. Poderes generales y especiales.",
  },
  {
    id: "permisos-viaje",
    name: "Permisos de Viaje",
    description: "Gestión de permisos de viaje para menores venezolanos. Tramitación ante las autoridades competentes.",
  },
  {
    id: "apostilla-documentos",
    name: "Legalización y Apostilla de Documentos",
    description: "Servicio de legalización y apostilla de documentos venezolanos ante el Ministerio de Relaciones Exteriores de Venezuela.",
  },
] as const;

// ── OTROS SERVICIOS ADMINISTRATIVOS ──

export const OTROS_SERVICIOS = [
  {
    id: "solicitud-partidas",
    name: "Solicitud de Partidas",
    description: "Gestión de solicitud de partidas de nacimiento, matrimonio, defunción, etc. ante registros civiles españoles e internacionales.",
  },
  {
    id: "documentos-notariales",
    name: "Tramitación de Documentos ante Notarías en España",
    description: "Gestión y tramitación de todo tipo de documentos notariales: poderes, actas, escrituras y certificaciones ante notarías españolas.",
  },
  {
    id: "legalizacion-apostilla-espana",
    name: "Legalización y Apostilla de Documentos en España",
    description: "Servicio de legalización y apostilla de documentos en España para su validez internacional conforme al Convenio de La Haya.",
  },
  {
    id: "redaccion-consulados",
    name: "Redacción de Documentos para Consulados Extranjeros",
    description: "Redacción profesional de documentos requeridos por consulados y embajadas para trámites consulares y firma en consulados extranjeros.",
  },
] as const;

// ── PACKS ──

export const PACKS_EXTRANJERIA = [
  {
    id: "pack-migrante",
    name: "Pack Migrante",
    category: "Extranjería",
    targetAudience: "Personas que acaban de llegar a España o están iniciando su proceso migratorio y necesitan orientación integral.",
    description: "Todo lo que necesitas para iniciar tu proceso migratorio en España. Incluye asesoría inicial, revisión de documentación y acompañamiento en los primeros trámites.",
    includes: [
      "Asesoría migratoria inicial (30 min)",
      "Revisión de documentación personal",
      "Orientación sobre vías de regularización",
      "Preparación de expediente básico",
      "Seguimiento durante 30 días",
    ],
    note: "Las tasas administrativas no están incluidas en el precio del pack.",
  },
  {
    id: "pack-post-jura",
    name: "Pack Post Jura Nacionalidad",
    category: "Extranjería",
    targetAudience: "Personas que acaban de jurar la nacionalidad española y necesitan completar todos los trámites posteriores.",
    description: "Todos los trámites necesarios después de obtener la nacionalidad española. Te acompañamos en la última etapa de tu proceso.",
    includes: [
      "Solicitud de DNI español",
      "Actualización de datos en Seguridad Social",
      "Gestión de pasaporte español",
      "Inscripción en el Registro Civil",
      "Asesoría sobre derechos como ciudadano español",
    ],
    note: "Las tasas administrativas no están incluidas en el precio del pack.",
  },
] as const;

export const PACKS_GESTORIA = [
  {
    id: "pack-asesoria-mensual",
    name: "Pack Asesoría Mensual",
    category: "Gestoría",
    targetAudience: "Autónomos, pequeñas empresas o particulares que necesitan asesoramiento legal continuo durante un periodo.",
    description: "Acompañamiento legal continuo durante un mes completo. Ideal para quienes necesitan seguimiento constante de sus trámites y gestiones.",
    includes: [
      "4 sesiones de asesoría (30 min c/u)",
      "Consultas ilimitadas por WhatsApp",
      "Revisión de documentación",
      "Seguimiento de expedientes",
      "Alertas de plazos y vencimientos",
    ],
    note: "Las tasas administrativas no están incluidas en el precio del pack.",
  },
  {
    id: "pack-tramites-express",
    name: "Pack Trámites Express",
    category: "Gestoría",
    targetAudience: "Cualquier persona que necesite resolver trámites con urgencia y plazos reducidos.",
    description: "Para quienes necesitan resolver sus gestiones con urgencia. Tramitación prioritaria con plazos reducidos y atención preferente.",
    includes: [
      "Tramitación prioritaria",
      "Atención preferente 24/48h",
      "Gestión documental completa",
      "Seguimiento en tiempo real",
      "Comunicación directa con el gestor",
    ],
    note: "Las tasas administrativas no están incluidas en el precio del pack.",
  },
] as const;

// Combined packs for backward compatibility
export const PACKS = [...PACKS_EXTRANJERIA, ...PACKS_GESTORIA] as const;

// Legacy exports for backward compatibility
export const TRAMITES_VENEZUELA = SERVICIOS_VENEZUELA;
export const TRAMITES_EXTRANJERIA = [...SERVICIOS_EXTRANJERIA, NACIONALIDAD, RECURSOS_ADMINISTRATIVOS] as const;

export const TESTIMONIALS = [
  {
    name: "María G.",
    text: "Gracias a Tu Gestión Legal conseguí mi arraigo social sin complicaciones. Me explicaron todo paso a paso y siempre estuvieron disponibles para resolver mis dudas.",
    rating: 5,
    service: "Arraigo Social",
  },
  {
    name: "Carlos R.",
    text: "Excelente servicio para la renovación de mi residencia. Todo fue rápido y profesional. Muy recomendable para cualquier trámite de extranjería.",
    rating: 5,
    service: "Renovación de Residencia",
  },
  {
    name: "Ana P.",
    text: "Me ayudaron con todos los trámites de Venezuela que necesitaba desde España. La apostilla de documentos fue gestionada de forma impecable.",
    rating: 5,
    service: "Trámites Venezolanos",
  },
  {
    name: "José M.",
    text: "La asesoría por videoconferencia fue muy útil. En 30 minutos tuve claro qué pasos seguir para mi proceso de nacionalidad española.",
    rating: 5,
    service: "Asesoría por Videoconferencia",
  },
] as const;
