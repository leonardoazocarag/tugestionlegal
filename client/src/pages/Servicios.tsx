import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_INFO } from "@shared/data";
import {
  ArrowRight,
  Scale,
  FileText,
  Globe,
  Briefcase,
  MessageCircle,
  Calendar,
  Headphones,
  Package,
} from "lucide-react";

const SERVICE_SECTIONS = [
  {
    icon: Headphones,
    title: "Asesorías",
    desc: "Asesorías por videoconferencia y asesoría inmobiliaria. Orientación profesional adaptada a tu caso.",
    href: "/asesorias",
    features: ["Asesoría por Videoconferencia", "Asesoría Inmobiliaria"],
    color: "from-[#C19D4E]/20 to-[#C19D4E]/10",
  },
  {
    icon: Scale,
    title: "Servicios Jurídicos",
    desc: "Extranjería, nacionalidad española y recursos administrativos. Gestión integral de tu situación migratoria y legal en España.",
    href: "/servicios-juridicos",
    features: ["Residencias y Arraigos", "Reagrupación Familiar", "Nacionalidad Española", "Recursos Administrativos"],
    color: "from-[#112250]/20 to-[#112250]/10",
  },
  {
    icon: Briefcase,
    title: "Servicios Administrativos",
    desc: "Gestión de trámites administrativos, impuestos, certificados y gestiones con ayuntamientos. Simplificamos tu burocracia.",
    href: "/servicios-administrativos",
    features: ["Transferencia de Coche", "IRPF / IBI / IVTM", "Certificado Digital", "Empadronamiento"],
    color: "from-[#5D0018]/20 to-[#5D0018]/10",
  },
  {
    icon: Globe,
    title: "Servicios Internacionales",
    desc: "Gestión de documentos y trámites en Venezuela desde España. Partidas, antecedentes penales, poderes y apostillas sin necesidad de viajar.",
    href: "/servicios-internacionales",
    features: ["Partidas de Nacimiento", "Antecedentes Penales", "Poderes", "Legalización y Apostilla"],
    color: "from-[#C19D4E]/20 to-[#C19D4E]/10",
  },
  {
    icon: FileText,
    title: "Otros Servicios Administrativos",
    desc: "Solicitud de partidas, tramitación ante notarías, legalización y apostilla en España, y redacción de documentos para consulados.",
    href: "/otros-servicios",
    features: ["Solicitud de Partidas", "Documentos Notariales", "Legalización en España", "Documentos para Consulados"],
    color: "from-[#112250]/20 to-[#112250]/10",
  },
  {
    icon: Package,
    title: "Packs de Servicios",
    desc: "Paquetes diseñados para cubrir tus necesidades de forma integral. Packs de extranjería y de gestoría con atención personalizada.",
    href: "/packs",
    features: ["Pack Migrante", "Pack Post Jura", "Pack Asesoría Mensual", "Pack Trámites Express"],
    color: "from-[#5D0018]/20 to-[#5D0018]/10",
  },
];

export default function Servicios() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[#112250] text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-[#C19D4E]/20 text-[#C19D4E] text-sm font-medium rounded-full border border-[#C19D4E]/30 mb-4">
              Nuestros Servicios
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Servicios Legales y Administrativos
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Ofrecemos un servicio integral en materia de extranjería, gestión documental y trámites administrativos.
              Cada caso es único y merece atención personalizada.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICE_SECTIONS.map((section) => (
              <Link key={section.title} href={section.href}>
                <Card className="h-full bg-white hover:shadow-xl transition-all duration-300 group border-0 shadow-sm cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-br ${section.color} p-6 flex items-center gap-4`}>
                      <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <section.icon className="w-7 h-7 text-[#0A1635]" />
                      </div>
                      <h3 className="text-xl font-extrabold text-[#0A1635] group-hover:text-[#C19D4E] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                        {section.title}
                      </h3>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{section.desc}</p>
                      <ul className="space-y-2 mb-4">
                        {section.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-[#112250]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C19D4E]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center text-sm text-[#C19D4E] font-medium">
                        Ver detalles <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#5D0018] text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            ¿No sabes qué servicio necesitas?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Contacta con nosotros y te orientaremos sin compromiso sobre la mejor opción para tu caso.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/reservas">
              <Button size="lg" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Cita
              </Button>
            </Link>
            <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
