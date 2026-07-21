import { useState } from 'react';
import { GoogleCalendar } from '../../../api/endpoints/google-calendar';

export function useGoogleCalendar() {
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);
    try {
      const { data } = await GoogleCalendar.authUrl();
      window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    try {
      await GoogleCalendar.disconnect();
    } finally {
      setLoading(false);
    }
  };

  return { connect, disconnect, loading };
}