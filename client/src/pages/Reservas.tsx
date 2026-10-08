import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ALL_BOOKABLE_SERVICES } from "@shared/bookableServices";
import { ASESORIAS, CONTACT_INFO } from "@shared/data";
import { trpc } from "@/lib/trpc";
import { CalendarIcon, Clock, CheckCircle, Loader2, Info, Video, Building } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, isBefore, isSameDay, startOfDay, isSaturday, isSunday } from "date-fns";
import { es } from "date-fns/locale";
import { useSearch } from "wouter";

const ASESORIA_BLURBS: Record<string, string> = {
  "asesoria-videoconferencia": "Consulta online desde cualquier lugar. Ideal para orientación rápida sobre tu caso.",
  "asesoria-inmobiliaria": "Asesoramiento especializado en compraventa y alquiler.",
};

// Time slots: L-V morning 9-12, afternoon 17-19; Saturday 10-13
const TIME_SLOTS_WEEKDAY_MORNING = ["09:00", "10:00", "11:00", "12:00"];
const TIME_SLOTS_WEEKDAY_AFTERNOON = ["17:00", "18:00", "19:00"];
const TIME_SLOTS_SATURDAY = ["10:00", "11:00", "12:00", "13:00"];

// Spanish national holidays (fixed dates that repeat every year)
// Format: "MM-DD"
const SPANISH_NATIONAL_HOLIDAYS = [
  "01-01", // Año Nuevo
  "01-06", // Epifanía del Señor (Reyes)
  "05-01", // Día del Trabajo
  "08-15", // Asunción de la Virgen
  "10-12", // Fiesta Nacional de España
  "11-01", // Todos los Santos
  "12-06", // Día de la Constitución
  "12-08", // Inmaculada Concepción
  "12-25", // Navidad
];

// Variable holidays for 2025-2027 (Easter-dependent: Jueves Santo, Viernes Santo)
const VARIABLE_HOLIDAYS = [
  "2025-04-17", // Jueves Santo 2025
  "2025-04-18", // Viernes Santo 2025
  "2026-04-02", // Jueves Santo 2026
  "2026-04-03", // Viernes Santo 2026
  "2027-03-25", // Jueves Santo 2027
  "2027-03-26", // Viernes Santo 2027
];

function isSpanishHoliday(date: Date): boolean {
  const mmdd = format(date, "MM-dd");
  if (SPANISH_NATIONAL_HOLIDAYS.includes(mmdd)) return true;
  const full = format(date, "yyyy-MM-dd");
  if (VARIABLE_HOLIDAYS.includes(full)) return true;
  return false;
}

export default function Reservas() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const preselectedService = params.get("servicio") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: preselectedService,
    time: "",
    message: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  // Pre-select service from URL param
  useEffect(() => {
    if (preselectedService) {
      const exact = ALL_BOOKABLE_SERVICES.find((s) => s.name === preselectedService);
      if (exact) {
        setFormData((prev) => ({ ...prev, serviceType: exact.name }));
      } else {
        const partial = ALL_BOOKABLE_SERVICES.find((s) =>
          s.name.toLowerCase().includes(preselectedService.toLowerCase()) ||
          preselectedService.toLowerCase().includes(s.name.toLowerCase())
        );
        if (partial) {
          setFormData((prev) => ({ ...prev, serviceType: partial.name }));
        }
      }
    }
  }, [preselectedService]);

  // Query occupied slots for the selected date
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const { data: occupiedSlots = [] } = trpc.booking.occupiedSlots.useQuery(
    { date: dateStr },
    { enabled: !!dateStr }
  );

  const createBooking = trpc.booking.create.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.success("Redirigiendo al pago seguro…");
        window.location.href = data.checkoutUrl;
        return;
      }
      setSubmitted(true);
      toast.success("Reserva enviada correctamente.");
    },
    onError: (err) => {
      toast.error("Error al enviar la reserva: " + err.message);
    },
  });

  // Mínimo 2 días de antelación: no permitir reservas "de un día para otro"
  const minBookableDate = useMemo(() => addDays(startOfDay(new Date()), 2), []);
  const tomorrow = useMemo(() => addDays(startOfDay(new Date()), 1), []);

  const disabledDays = (date: Date) => {
    return isBefore(date, minBookableDate) || isSunday(date) || isSpanishHoliday(date);
  };

  const isNextDayBlocked = selectedDate
    ? isSameDay(selectedDate, tomorrow) || isBefore(selectedDate, minBookableDate)
    : false;

  // Determine available time slots based on selected day
  const availableSlots = useMemo(() => {
    if (!selectedDate) return { morning: [], afternoon: [] };
    if (isSaturday(selectedDate)) {
      return { morning: TIME_SLOTS_SATURDAY, afternoon: [] };
    }
    return { morning: TIME_SLOTS_WEEKDAY_MORNING, afternoon: TIME_SLOTS_WEEKDAY_AFTERNOON };
  }, [selectedDate]);

  // Reset time when date changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, time: "" }));
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType || !selectedDate || !formData.time) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    createBooking.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceType: formData.serviceType,
      time: formData.time,
      message: formData.message,
      date: format(selectedDate, "yyyy-MM-dd"),
    });
  };

  const resetForm = () => {
    setSubmitted(false);
    setSelectedDate(undefined);
    setFormData({ name: "", email: "", phone: "", serviceType: "", time: "", message: "" });
  };

  if (submitted) {
    return (
      <>
        <section className="bg-[#112250] text-white py-20">
          <div className="container">
            <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Reservar Cita</h1>
          </div>
        </section>
        <section className="py-20 bg-[#F5F0E9]">
          <div className="container max-w-xl text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#112250] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Reserva Enviada Correctamente
            </h2>
            <p className="text-gray-600 mb-2">
              Hemos recibido tu solicitud de cita. Recibirás un email de confirmación cuando revisemos tu reserva.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Si necesitas algo urgente, no dudes en contactarnos por{" "}
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#C19D4E] underline">
                WhatsApp
              </a>.
            </p>
            <Button onClick={resetForm} className="bg-[#112250] hover:bg-[#1a2d5e] text-white">
              Hacer Otra Reserva
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-[#112250] text-white py-20">
        <div className="container">
          <div className="max-w-3xl animate-fade-up">
            <span className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Reservas</span>
            <h1 className="text-4xl lg:text-5xl font-bold mt-3 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Reservar Asesoría
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Selecciona el tipo de asesoría, elige fecha y hora disponible, y completa tus datos.
              Recibirás confirmación por email.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Selection — cards */}
                    <div>
                      <Label className="text-sm font-semibold text-[#112250] mb-3 block">Tipo de Asesoría *</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ASESORIAS.map((a) => {
                          const selected = formData.serviceType === a.name;
                          const isVideo = a.id === "asesoria-videoconferencia";
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, serviceType: a.name })}
                              className={`relative text-left rounded-xl border-2 p-4 transition-all bg-white ${
                                selected
                                  ? "border-[#C19D4E] shadow-md"
                                  : "border-gray-200 hover:border-[#C19D4E]/50"
                              }`}
                            >
                              {selected && (
                                <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#C19D4E] text-white flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4" />
                                </span>
                              )}
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                                selected ? "bg-[#C19D4E]/15" : "bg-gray-100"
                              }`}>
                                {isVideo ? (
                                  <Video className={`w-5 h-5 ${selected ? "text-[#C19D4E]" : "text-[#112250]"}`} />
                                ) : (
                                  <Building className={`w-5 h-5 ${selected ? "text-[#C19D4E]" : "text-[#112250]"}`} />
                                )}
                              </div>
                              <p className={`font-bold text-sm mb-1 ${selected ? "text-[#C19D4E]" : "text-[#0A1635]"}`}>
                                {a.name}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                {ASESORIA_BLURBS[a.id] || a.description}
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-bold text-[#0A1635]">{a.price}€</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-500">Máx. {a.duration.replace(" minutos", " min")}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Calendar and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-semibold text-[#112250] mb-2 block">
                          <CalendarIcon className="w-4 h-4 inline mr-1" /> Fecha *
                        </Label>
                        <div className="bg-white rounded-lg border p-1 flex justify-center">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={disabledDays}
                            locale={es}
                            className="rounded-md"
                          />
                        </div>
                        {selectedDate && (
                          <p className="text-sm text-[#112250] font-medium mt-2 text-center">
                            {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-[#112250] mb-2 block">
                          <Clock className="w-4 h-4 inline mr-1" /> Hora *
                        </Label>
                        {!selectedDate ? (
                          <p className="text-sm text-gray-500 italic mt-4">Selecciona una fecha primero</p>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
                                {isSaturday(selectedDate) ? "Mañana (Sábado)" : "Mañana"}
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {availableSlots.morning.map((t) => {
                                  const isOccupied = isNextDayBlocked || occupiedSlots.includes(t);
                                  return (
                                    <button
                                      key={t}
                                      type="button"
                                      disabled={isOccupied}
                                      onClick={() => setFormData({ ...formData, time: t })}
                                      className={`py-3 px-2 text-sm rounded-lg border transition-all font-medium ${
                                        isOccupied
                                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                                          : formData.time === t
                                          ? "bg-[#112250] text-white border-[#112250]"
                                          : "bg-white text-[#112250] border-gray-200 hover:border-[#C19D4E] hover:bg-[#C19D4E]/5"
                                      }`}
                                    >
                                      {t}
                                      {isOccupied && <span className="block text-[10px] mt-0.5">Ocupado</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            {availableSlots.afternoon.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">Tarde</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {availableSlots.afternoon.map((t) => {
                                    const isOccupied = isNextDayBlocked || occupiedSlots.includes(t);
                                    return (
                                      <button
                                        key={t}
                                        type="button"
                                        disabled={isOccupied}
                                        onClick={() => setFormData({ ...formData, time: t })}
                                        className={`py-3 px-2 text-sm rounded-lg border transition-all font-medium ${
                                          isOccupied
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                                            : formData.time === t
                                            ? "bg-[#112250] text-white border-[#112250]"
                                            : "bg-white text-[#112250] border-gray-200 hover:border-[#C19D4E] hover:bg-[#C19D4E]/5"
                                        }`}
                                      >
                                        {t}
                                        {isOccupied && <span className="block text-[10px] mt-0.5">Ocupado</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-[#112250] mb-2 block">Nombre completo *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Tu nombre"
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-[#112250] mb-2 block">Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu@email.com"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-[#112250] mb-2 block">Teléfono *</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+34 600 000 000"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-[#112250] mb-2 block">Mensaje (opcional)</Label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Comparte en este espacio (de forma muy breve) tu caso y las dudas que quieres aclarar. Esto le permitirá al profesional tener una idea general de la situación y sacar el máximo provecho al tiempo reservado para tu sesión."
                        rows={5}
                        className="bg-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createBooking.isPending}
                      className="w-full bg-[#C19D4E] hover:bg-[#a8873f] text-white text-base py-6"
                    >
                      {createBooking.isPending ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</>
                      ) : (
                        <><CalendarIcon className="w-5 h-5 mr-2" /> Confirmar Reserva</>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Tras el pago seguro con Stripe, recibirás un email de confirmación de la cita.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md bg-[#112250] text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Asesorías Disponibles</h3>
                  <div className="space-y-3 text-sm">
                    {ASESORIAS.map((a) => {
                      const isVideo = a.id === "asesoria-videoconferencia";
                      return (
                        <div key={a.id} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {isVideo ? (
                                <Video className="w-4 h-4 text-[#C19D4E]" />
                              ) : (
                                <Building className="w-4 h-4 text-[#C19D4E]" />
                              )}
                              <p className="font-semibold text-[#C19D4E]">
                                {isVideo ? "Videoconferencia" : "Inmobiliaria"}
                              </p>
                            </div>
                            <span className="font-bold text-white">{a.price}€</span>
                          </div>
                          <p className="text-white/70 text-xs">
                            {isVideo
                              ? `Sesión personalizada de ${a.duration.replace(" minutos", " min")} por Zoom/Meet`
                              : "Asesoría legal en compraventa y alquiler"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#112250] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Horarios</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-[#C19D4E] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#112250]">Lunes a Viernes</p>
                        <p>9:00 - 12:00 y 17:00 - 19:00</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-[#C19D4E] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#112250]">Sábados</p>
                        <p>10:00 - 13:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#112250] mb-3" style={{ fontFamily: "var(--font-heading)" }}>¿Cómo funciona?</h3>
                  <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#C19D4E] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                      Selecciona el tipo de asesoría
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#C19D4E] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                      Elige fecha y hora disponible
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#C19D4E] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                      Completa tus datos de contacto
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#C19D4E] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                      Recibe confirmación por email
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md border-l-4 border-l-[#C19D4E]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#C19D4E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#112250] mb-1">Nota importante</p>
                      <p className="text-xs text-gray-600">
                        Las asesorías tienen una duración máxima de 45 minutos. Las reservas están sujetas a confirmación. Los horarios ocupados aparecen deshabilitados. No es posible reservar de un día para otro.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
