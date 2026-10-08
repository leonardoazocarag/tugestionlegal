import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TRAMITES_EXTRANJERIA, CONTACT_INFO } from "@shared/data";
import {
  Home,
  Anchor,
  RefreshCw,
  Users,
  CreditCard,
  GraduationCap,
  Flag,
  Scale,
  Shield,
  Crown,
  CheckCircle,
  Calendar,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

const ICON_MAP: Record<string, LucideIcon> = {
  "residencias": Home,
  "arraigos": Anchor,
  "renovaciones": RefreshCw,
  "reagrupacion-familiar": Users,
  "tarjeta-comunitaria": CreditCard,
  "estancia-estudios": GraduationCap,
  "nacionalidad-espanola": Flag,
  "recursos-administrativos": Scale,
};

export default function ServiciosJuridicos() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <section className="bg-[#112250] text-white py-20">
        <div className="container">
          <div className="max-w-3xl animate-fade-up">
            <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Servicios Jurídicos</span>
            <h1 className="text-4xl lg:text-5xl font-bold mt-3 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Servicios Jurídicos
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Servicios jurídicos especializados en extranjería, nacionalidad y recursos administrativos.
              Residencias, arraigos, reagrupación familiar y más. Te acompañamos en cada paso del proceso.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRAMITES_EXTRANJERIA.map((t) => {
              const Icon = ICON_MAP[t.id] || Scale;
              return (
                <Card key={t.id} className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#112250] flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-[#C19D4E]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-extrabold text-[#0A1635] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{t.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.description}</p>

                        {"packs" in t && t.packs && (
                          <div className="mb-4 space-y-2">
                            <p className="text-sm font-semibold text-[#112250]">Ofrecemos diferentes paquetes según tus necesidades:</p>
                            {t.packs.map((p) => (
                              <div key={p.name} className="flex items-start gap-2 p-2 bg-[#F5F0E9] rounded-lg">
                                <Crown className="w-4 h-4 text-[#C19D4E] shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-[#112250]">{p.name}</p>
                                  <p className="text-xs text-gray-500">{p.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                          className="text-sm text-[#C19D4E] font-medium hover:underline mb-3"
                        >
                          {expanded === t.id ? "Ocultar requisitos" : "Ver requisitos"}
                        </button>

                        {expanded === t.id && (
                          <div className="mb-4 animate-fade-up">
                            <p className="text-sm font-semibold text-[#112250] mb-2">Requisitos principales:</p>
                            <ul className="space-y-1.5">
                              {t.requirements.map((req: string) => (
                                <li key={req} className="flex items-start gap-2 text-sm text-gray-600">
                                  <CheckCircle className="w-3.5 h-3.5 text-[#C19D4E] shrink-0 mt-0.5" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="border-[#112250] text-[#112250] hover:bg-[#112250] hover:text-white">
                              <MessageCircle className="w-3.5 h-3.5 mr-1" /> Consultar
                            </Button>
                          </a>
                          <Link href={`/reservas?servicio=${encodeURIComponent(t.name)}`}>
                            <Button size="sm" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
                              <Calendar className="w-3.5 h-3.5 mr-1" /> Solicitar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#112250] text-white">
        <div className="container text-center">
          <Shield className="w-12 h-12 text-[#C19D4E] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Cada Caso es Único</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Analizamos tu situación particular y te ofrecemos la mejor estrategia legal. Reserva una asesoría para que evaluemos tu caso.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/reservas">
              <Button size="lg" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
                <Calendar className="w-5 h-5 mr-2" /> Reservar Asesoría
              </Button>
            </Link>
            <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
