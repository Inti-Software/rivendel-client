import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { useGoogleCalendarCallback } from '../hooks/useGoogleCalendarCallback';
import { toast } from 'react-toastify'; // o lo que uses para notificaciones
import { getGoogleCalendarConnected, setGoogleCalendarConnected } from '../../../auth/authState';

export function GoogleCalendarButton() {
  const { connect, disconnect, loading } = useGoogleCalendar();

  useGoogleCalendarCallback({
    onSuccess: () => {
      toast.success('Google Calendar conectado correctamente');
      setGoogleCalendarConnected(true);
    },
    onError: () => {
      toast.error('No se pudo conectar Google Calendar');
    },
  });

  if (getGoogleCalendarConnected()) {
    return (
      <button onClick={disconnect} disabled={loading}>
        {loading ? 'Desconectando...' : '📅 Desconectar Google Calendar'}
      </button>
    );
  }

  return (
    <button onClick={connect} disabled={loading}>
      {loading ? 'Redirigiendo...' : '📅 Conectar Google Calendar'}
    </button>
  );
}