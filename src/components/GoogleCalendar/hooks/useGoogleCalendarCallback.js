import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useGoogleCalendarCallback({ onSuccess, onError } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('google_calendar');

    if (status === 'connected') {
      onSuccess?.();
      // Limpiar el query param de la URL
      setSearchParams(prev => {
        prev.delete('google_calendar');
        return prev;
      });
    }

    if (status === 'error') {
      onError?.();
      setSearchParams(prev => {
        prev.delete('google_calendar');
        return prev;
      });
    }
  }, []);
}