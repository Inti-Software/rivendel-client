import { useState } from 'react';
import { GoogleCalendar } from '../../../api/endpoints/google-calendar';
import { setGoogleCalendarConnected } from '../../../auth/authState';

export function useGoogleCalendar() {
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);
    const response = await GoogleCalendar.authUrl();
    if (response.ok) {
      window.location.href = response.data.url;
    }
    setLoading(false);
  };

  const disconnect = async () => {
    setLoading(true);
    const response = await GoogleCalendar.disconnect();
    if (response.ok) {
      setGoogleCalendarConnected(false);
    }
    setLoading(false);
  };

  return { connect, disconnect, loading };
}