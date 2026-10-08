import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICIOS_ADMINISTRATIVOS, CONTACT_INFO } from "@shared/data";
import {
  Car,
  Receipt,
  HeartPulse,
  Building2,
  Truck,
  Gift,
  Award,
  Landmark,
  KeyRound,
  Calendar,
  MessageCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "dgt": Car,
  "aeat": Receipt,
  "seguridad-social": HeartPulse,
  "ibi": Building2,
  "ivtm": Truck,
  "bonificaciones": Gift,
  "certificados": Award,
  "gestiones-ayuntamientos": Landmark,
  "certificado-digital": KeyRound,
};

export default function ServiciosAdministrativos() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#112250] text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-[#C19D4E]/20 text-[#C19D4E] text-sm font-medium rounded-full border border-[#C19D4E]/30 mb-4">
              Servicios Administrativos
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Servicios Administrativos
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Gestionamos tus trámites administrativos, impuestos, certificados y gestiones con ayuntamientos para que tú no tengas que preocuparte.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICIOS_ADMINISTRATIVOS.map((svc) => {
              const Icon = ICON_MAP[svc.id] || Award;
              return (
                <Card key={svc.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#112250]/5 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#112250]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0A1635] mb-2 group-hover:text-[#C19D4E] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                      {svc.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{svc.description}</p>
                    <Link href={`/reservas?servicio=${encodeURIComponent(svc.name)}`}>
                      <span className="inline-flex items-center text-sm text-[#C19D4E] font-medium cursor-pointer">
                        Solicitar <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#5D0018] text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            ¿Necesitas ayuda con algún trámite?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Contacta con nosotros y te orientaremos sobre el servicio que necesitas.
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
