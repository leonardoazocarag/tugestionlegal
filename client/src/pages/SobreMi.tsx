import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Target, Eye, Heart, Award, Users, Globe, Calendar, ArrowRight } from "lucide-react";

const ABOUT_IMG = "/images/sobre-mi.png";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function SobreMi() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#112250] text-white py-20">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.span variants={fadeUp} className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Sobre Mí</motion.span>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-bold mt-3 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Conoce a Tu Gestión Legal
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/80 text-lg leading-relaxed">
              Somos un despacho especializado en derecho de extranjería, gestión documental y trámites administrativos.
              Nuestra misión es ofrecer soluciones legales claras, accesibles y eficaces para ciudadanos extranjeros y nacionales,
              tanto dentro como fuera de España.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img src={ABOUT_IMG} alt="Tu Gestión Legal" className="rounded-xl shadow-2xl w-full object-cover max-h-[500px] object-top" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-bold text-[#112250] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Experiencia y Compromiso al Servicio de Nuestros Clientes
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En Tu Gestión Legal entendemos que cada caso es único. Por eso, ofrecemos un trato personalizado y cercano,
                adaptándonos a las necesidades específicas de cada cliente. Nuestro equipo cuenta con amplia experiencia en
                derecho de extranjería e internacional, lo que nos permite ofrecer soluciones eficaces y actualizadas.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Atendemos a ciudadanos extranjeros y nacionales, tanto en España como a nivel internacional.
                Ofrecemos nuestros servicios en español e inglés, garantizando una comunicación clara y efectiva
                en todo momento.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Award, label: "Profesionales cualificados" },
                  { icon: Users, label: "+500 clientes satisfechos" },
                  { icon: Globe, label: "Servicio internacional" },
                  { icon: Shield, label: "Confidencialidad total" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#C19D4E]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#C19D4E]" />
                    </div>
                    <span className="text-sm font-medium text-[#112250]">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Nuestros Pilares</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#112250] mt-3 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Misión, Visión y Valores
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Misión",
                text: "Ofrecer servicios legales y administrativos de calidad, accesibles y personalizados, que permitan a nuestros clientes resolver sus trámites migratorios y documentales con total tranquilidad y confianza.",
              },
              {
                icon: Eye,
                title: "Visión",
                text: "Ser el despacho de referencia en España para servicios de extranjería y gestión documental, reconocido por nuestra excelencia profesional, innovación tecnológica y compromiso con la satisfacción del cliente.",
              },
              {
                icon: Heart,
                title: "Valores",
                text: "Profesionalidad, transparencia, empatía y compromiso. Creemos en un servicio legal humano, donde cada cliente es tratado con respeto, cercanía y la máxima dedicación a su caso.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#112250] flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-7 h-7 text-[#C19D4E]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#112250] mb-4" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#112250] text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>¿Listo para Resolver tus Trámites?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">Contacta con nosotros y descubre cómo podemos ayudarte.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/reservas">
              <Button size="lg" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
                <Calendar className="w-5 h-5 mr-2" /> Reservar Asesoría
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contactar <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
