/** Enlace "Añadir a Google Calendar" (plantilla web, 45 min, Europe/Madrid). */
export function buildGoogleCalendarUrl(booking: {
  serviceType: string;
  date: string;
  time: string;
  name: string;
}): string {
  const [year, month, day] = booking.date.split("-").map(Number);
  const [hour, minute] = booking.time.split(":").map(Number);
  const startDate = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}00`;
  const endMinuteTotal = hour * 60 + minute + 45;
  const endHour = Math.floor(endMinuteTotal / 60);
  const endMinute = endMinuteTotal % 60;
  const endDate = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(endHour).padStart(2, "0")}${String(endMinute).padStart(2, "0")}00`;
  const title = encodeURIComponent(`Asesoría - ${booking.name} (${booking.serviceType})`);
  const details = encodeURIComponent(
    `Cliente: ${booking.name}\nServicio: ${booking.serviceType}\nHora: ${booking.time}\nDuración: 45 min`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&ctz=Europe/Madrid`;
}
