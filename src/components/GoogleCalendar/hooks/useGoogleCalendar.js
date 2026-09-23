import { useState } from 'react';
import { GoogleCalendar } from '../../../api/repositories/google-calendar';
import { setCalendarConnected } from '../../../stores/calendar';

export function useGoogleCalendar() {
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);
    try {
      const response = await GoogleCalendar.authUrl();
      if (response.ok) {
        window.location.href = response.data.url;
      }
    } catch {
      // La UI no necesita propagar errores de navegación o autorización.
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    try {
      const response = await GoogleCalendar.disconnect();
      if (response.ok) {
        setCalendarConnected(false);
      }
    } catch {
      // La UI conserva el estado de conexión si la desconexión falla.
    } finally {
      setLoading(false);
    }
  };

  return { connect, disconnect, loading };
}