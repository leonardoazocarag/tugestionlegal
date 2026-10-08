import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_INFO, TESTIMONIALS } from "@shared/data";
import { trpc } from "@/lib/trpc";
import {
  Calendar,
  MessageCircle,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Shield,
  Clock,
  Headphones,
  BookOpen,
  Scale,
  FileText,
  Globe,
  Briefcase,
  ExternalLink,
  Loader2,
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477079238/EPsBEv5tgtumuds5mHeEv6/hero-european-gYnvYcPGvEEYQrwSCxgqbr.webp";
const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477079238/EPsBEv5tgtumuds5mHeEv6/about-european-TjUcMekAGTUewJs4F7FKjh.webp";

const ICON_VISADOS = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477079238/EPsBEv5tgtumuds5mHeEv6/icon-visados-CZGAQJNJUhJHH7FxgjBRWg.webp";
const ICON_NACIONALIDAD = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477079238/EPsBEv5tgtumuds5mHeEv6/icon-nacionalidad-k5rtmAENNYwAPzwbQUth8u.webp";
const ICON_DOCUMENTOS = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477079238/EPsBEv5tgtumuds5mHeEv6/icon-documentos-c8BndfDKXvL5fRNQrqk67E.webp";
const ICON_ASESORIA = "https://d2xsxph8kpxj0f.cloudfront.net/310519663477079238/EPsBEv5tgtumuds5mHeEv6/icon-asesoria-RS9NCnrvFrsmGJnGW78oWb.webp";

// 4 main service blocks for the home page
const SERVICE_BLOCKS = [
  {
    icon: Scale,
    illustration: ICON_VISADOS,
    title: "Servicios Jurídicos",
    desc: "Extranjería, nacionalidad y recursos administrativos. Residencias, arraigos, reagrupación familiar y más.",
    href: "/servicios",
    color: "from-[#112250] to-[#1a3470]",
  },
  {
    icon: FileText,
    illustration: ICON_DOCUMENTOS,
    title: "Servicios Administrativos",
    desc: "DGT, AEAT, Seguridad Social, IBI, IVTM, certificados, certificado digital y gestiones con ayuntamientos.",
    href: "/servicios-administrativos",
    color: "from-[#5D0018] to-[#8a0025]",
  },
  {
    icon: Globe,
    illustration: ICON_NACIONALIDAD,
    title: "Servicios Internacionales",
    desc: "Trámites en Venezuela: partidas, actas, antecedentes penales, poderes, permisos de viaje y apostilla de documentos.",
    href: "/servicios-venezuela",
    color: "from-[#112250] to-[#1a3470]",
  },
  {
    icon: Briefcase,
    illustration: ICON_ASESORIA,
    title: "Asesorías y Packs",
    desc: "Asesorías por videoconferencia, asesoría inmobiliaria y packs personalizados para cada necesidad.",
    href: "/asesorias",
    color: "from-[#5D0018] to-[#8a0025]",
  },
];

const STEPS = [
  { num: "01", title: "Contacta con Nosotros", desc: "Escríbenos por WhatsApp, email o reserva una cita online. Te respondemos en menos de 24 horas." },
  { num: "02", title: "Evaluamos tu Caso", desc: "Analizamos tu situación particular y te ofrecemos una orientación clara sobre las opciones disponibles." },
  { num: "03", title: "Preparamos tu Expediente", desc: "Recopilamos y preparamos toda la documentación necesaria para tu trámite o gestión." },
  { num: "04", title: "Gestionamos y Resolvemos", desc: "Presentamos tu expediente y hacemos seguimiento hasta obtener la resolución." },
];

export default function Home() {
  const { data: places, isLoading: placesLoading } = trpc.places.summary.useQuery(undefined, {
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  const googleReviews = places?.reviews ?? [];
  const useGoogle = googleReviews.length > 0;

  return (
    <>
      {/* HERO - Broader messaging */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Despacho legal profesional"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#112250]/95 via-[#112250]/80 to-[#112250]/40" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-[#C19D4E]/20 text-[#C19D4E] text-sm font-medium rounded-full border border-[#C19D4E]/30">
                Tu Despacho de Confianza
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Especialistas en{" "}
              <span className="text-gold-gradient">Derecho de Extranjería</span>{" "}
              y Gestión Documental
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
              Soluciones legales claras para tu tranquilidad. Te acompañamos en cada paso de tus trámites migratorios y administrativos con profesionalidad y cercanía.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/reservas">
                <Button size="lg" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white text-base px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservar Cita
                </Button>
              </Link>
              <Link href="/servicios">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base px-8">
                  Ver Servicios
                </Button>
              </Link>
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-base px-8">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C19D4E]" />
                Atención personalizada
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C19D4E]" />
                Español e inglés
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR - Montserrat font for stats */}
      <section className="bg-white py-8 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "+500", label: "Clientes atendidos" },
              { num: "+1000", label: "Trámites gestionados" },
              { num: "98%", label: "Casos resueltos" },
              { num: "24h", label: "Tiempo de respuesta" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-3xl lg:text-4xl font-extrabold text-[#112250]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {stat.num}
                </p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 SERVICE BLOCKS */}
      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Nuestros Servicios</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#112250] mt-3 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Todo lo que Necesitas en un Solo Lugar
            </h2>
            <div className="section-divider mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos un servicio integral que va más allá de la extranjería. Desde asesoría legal hasta gestiones administrativas y trámites internacionales, cubrimos todas tus necesidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICE_BLOCKS.map((block) => (
              <Link key={block.title} href={block.href}>
                <Card className="h-full bg-white hover:shadow-xl transition-all duration-300 group border-0 shadow-md cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-r ${block.color} p-6 flex items-center gap-4`}>
                      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <img
                          src={block.illustration}
                          alt={block.title}
                          className="w-10 h-10 object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#C19D4E] transition-colors">
                          {block.title}
                        </h3>
                        <div className="flex items-center text-sm text-white/70 mt-1">
                          Ver detalles <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-600 leading-relaxed">{block.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Proceso</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#112250] mt-3 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Cómo Trabajamos
            </h2>
            <div className="section-divider mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un proceso claro y transparente para que siempre sepas en qué punto se encuentra tu trámite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-[#112250] text-[#C19D4E] flex items-center justify-center mx-auto mb-4 text-xl font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {step.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-gradient-to-r from-[#C19D4E] to-[#C19D4E]/20" />
                )}
                <h3 className="text-lg font-semibold text-[#112250] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-20 bg-[#112250] text-white overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={ABOUT_IMG}
                alt="Equipo de Tu Gestión Legal"
                className="rounded-xl shadow-2xl w-full object-cover max-h-[400px]"
                loading="lazy"
              />
            </div>
            <div>
              <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Sobre Nosotros</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Tu Tranquilidad es Nuestra Prioridad
              </h2>
              <p className="text-white/80 leading-relaxed mb-6">
                En Tu Gestión Legal ofrecemos soluciones legales y administrativas integrales. No somos solo un despacho de extranjería: te acompañamos en todos tus trámites, desde la gestión de tu residencia hasta tus impuestos, pasando por asesoría inmobiliaria y gestiones internacionales.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Shield, text: "Profesionalidad" },
                  { icon: Clock, text: "Rapidez" },
                  { icon: Headphones, text: "Cercanía" },
                  { icon: CheckCircle, text: "Resultados" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#C19D4E]/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#C19D4E]" />
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/sobre-mi">
                <Button className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
                  Conocer Más <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — Google Places reviews with static fallback */}
      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Testimonios</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#112250] mt-3 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Lo Que Dicen Nuestros Clientes
            </h2>
            <div className="section-divider mx-auto" />
            {places && places.userRatingCount > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(places.rating) ? "fill-[#C19D4E] text-[#C19D4E]" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-[#112250]">{places.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">
                    ({places.userRatingCount} reseñas en Google)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {places.googleMapsUri && (
                    <a href={places.googleMapsUri} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="border-[#112250] text-[#112250]">
                        Ver en Google <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </a>
                  )}
                  <a href={places.writeReviewUri || CONTACT_INFO.googleWriteReviewUri} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
                      Dejar reseña
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>

          {placesLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#C19D4E]" />
            </div>
          )}

          {!placesLoading && useGoogle && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {googleReviews.map((r) => (
                  <Card key={`${r.authorName}-${r.publishTime || r.relativeTime}`} className="h-full bg-white border-0 shadow-sm">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start gap-3 mb-3">
                        {r.authorPhotoUri ? (
                          <img
                            src={r.authorPhotoUri}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#112250]/10 flex items-center justify-center text-[#112250] font-semibold text-sm">
                            {r.authorName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          {r.authorUri ? (
                            <a
                              href={r.authorUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#112250] text-sm hover:underline truncate block"
                            >
                              {r.authorName}
                            </a>
                          ) : (
                            <p className="font-semibold text-[#112250] text-sm truncate">{r.authorName}</p>
                          )}
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < r.rating ? "fill-[#C19D4E] text-[#C19D4E]" : "text-gray-200"}`}
                                />
                              ))}
                            </div>
                            {r.relativeTime && (
                              <span className="text-xs text-gray-400">{r.relativeTime}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed italic flex-1 line-clamp-6">
                        "{r.text}"
                      </p>
                      {r.reviewUri && (
                        <a
                          href={r.reviewUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#C19D4E] mt-4 inline-flex items-center hover:underline"
                        >
                          Ver en Google <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-8">
                Reseñas públicas de Google · {places?.name}
              </p>
            </>
          )}

          {!placesLoading && !useGoogle && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TESTIMONIALS.map((t) => (
                <Card key={t.name} className="h-full bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C19D4E] text-[#C19D4E]" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{t.text}"</p>
                    <div className="border-t pt-3">
                      <p className="font-semibold text-[#112250] text-sm">{t.name}</p>
                      <p className="text-xs text-[#C19D4E]">{t.service}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#5D0018] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#C19D4E] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C19D4E] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container relative z-10 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ¿Necesitas Ayuda con tus Trámites?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            No dejes tus gestiones para después. Reserva tu cita hoy y da el primer paso hacia la solución de tu caso.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/reservas">
              <Button size="lg" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white text-base px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Cita
              </Button>
            </Link>
            <a href={`tel:${CONTACT_INFO.phone}`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base px-8">
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Blog</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#112250] mt-3 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Últimas Publicaciones
            </h2>
            <div className="section-divider mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mantente informado sobre las últimas novedades en extranjería, nacionalidad y gestiones administrativas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Guía completa del arraigo social en 2025", cat: "Extranjería", excerpt: "Todo lo que necesitas saber sobre los requisitos y el proceso para solicitar el arraigo social en España." },
              { title: "Nuevos requisitos para la nacionalidad española", cat: "Nacionalidad", excerpt: "Descubre los cambios recientes en los requisitos para obtener la nacionalidad española por residencia." },
              { title: "Cómo apostillar documentos venezolanos", cat: "Trámites", excerpt: "Guía paso a paso para apostillar tus documentos venezolanos sin necesidad de viajar a Venezuela." },
            ].map((post) => (
              <Link key={post.title} href="/blog">
                <Card className="h-full bg-[#F5F0E9] border-0 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gradient-to-br from-[#112250] to-[#5D0018]/80 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-[#C19D4E]/50" />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold text-[#C19D4E] uppercase tracking-wider">{post.cat}</span>
                      <h3 className="text-lg font-semibold text-[#112250] mt-2 mb-2 group-hover:text-[#C19D4E] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{post.excerpt}</p>
                      <div className="mt-4 flex items-center text-sm text-[#C19D4E] font-medium">
                        Leer más <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/blog">
              <Button variant="outline" className="border-[#112250] text-[#112250] hover:bg-[#112250] hover:text-white">
                Ver Todas las Publicaciones <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT QUICK */}
      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Contacto</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#112250] mt-3 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Estamos Aquí Para Ayudarte
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                ¿Tienes dudas? Contacta con nosotros y te orientaremos sin compromiso.
              </p>
              <div className="space-y-4">
                <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#112250]/5 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#112250]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-semibold text-[#112250]">{CONTACT_INFO.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#112250]/5 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#112250]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-[#112250]">{CONTACT_INFO.email}</p>
                  </div>
                </a>
                <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-semibold text-[#112250]">Escríbenos ahora</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#112250] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Envíanos tu Consulta
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Completa el formulario en nuestra página de contacto y te responderemos lo antes posible.
                </p>
                <Link href="/contacto">
                  <Button className="w-full bg-[#112250] hover:bg-[#1a2d5e] text-white">
                    Ir al Formulario de Contacto <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/reservas">
                  <Button variant="outline" className="w-full border-[#C19D4E] text-[#C19D4E] hover:bg-[#C19D4E] hover:text-white mt-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar Cita Online
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
