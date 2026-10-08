import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ReservaExito() {
  return (
    <>
      <section className="bg-[#112250] text-white py-16">
        <div className="container">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pago completado
          </h1>
        </div>
      </section>
      <section className="py-16 bg-[#F5F0E9]">
        <div className="container max-w-xl text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2
            className="text-2xl font-bold text-[#112250] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reserva Enviada Correctamente
          </h2>
          <p className="text-gray-600 mb-2">
            Hemos recibido tu pago y tu cita ha sido confirmada. Te hemos enviado un email de confirmación.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Si necesitas algo urgente, no dudes en contactarnos por WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#112250] hover:bg-[#1a2d5e]">
              <Link href="/reservas">Hacer Otra Reserva</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Ir al inicio</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
