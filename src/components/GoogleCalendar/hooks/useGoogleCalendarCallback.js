import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRef } from 'react';

export function useGoogleCalendarCallback({ onSuccess, onError } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const executed = useRef(false);

  useEffect(() => {
    if (executed.current) return;
    executed.current = true;

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