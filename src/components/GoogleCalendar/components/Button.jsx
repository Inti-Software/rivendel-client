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
      <>
        <span>getGoogleCalendarConnected = {getGoogleCalendarConnected()}</span>
        <button onClick={disconnect} disabled={loading} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
          {loading ? 'Desconectando...' : '📅 Desconectar Google Calendar'}
        </button>
      </>
    );
  }

  return (
    <>
      <span className="d-block">getGoogleCalendarConnected = {getGoogleCalendarConnected()}</span>
      <button onClick={connect} disabled={loading} className="btn btn-primary btn-sm">
        {loading ? 'Redirigiendo...' : '📅 Conectar Google Calendar'}
      </button>
      <span className="d-block mt-1 text-sm text-gray small">Conecta tu calendario para sincronizar eventos</span>
    </>
  );
}