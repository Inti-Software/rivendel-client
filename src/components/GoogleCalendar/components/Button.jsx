import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { getGoogleCalendarConnected, subscribeCalendar } from '../../../auth/authState';
import { useEffect, useState } from 'react';

export function Button() {
  const [connected, setConnected] = useState(getGoogleCalendarConnected());
  const { connect, disconnect, loading } = useGoogleCalendar();

  useEffect(() => {
    const unsub = subscribeCalendar(setConnected);
    return unsub; // cleanup al desmontar
  }, []);

  if (connected) {
    return (
      <button onClick={disconnect} disabled={loading} className="btn btn-sm btn-link">
        {loading ? 'Desconectando...' : '📅 Desconectar de Google Calendar'}
      </button>
    );
  }

  return (
    <button onClick={connect} disabled={loading} className="btn btn-primary btn-sm">
      {loading ? 'Redirigiendo...' : '📅 Conectar a Google Calendar'}
    </button>
  );
}