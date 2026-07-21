import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function GoogleCalendarCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get('google_calendar');
    const returnUrl = searchParams.get('returnUrl') ?? '/';

    if (status === 'connected') {
      toast.success('Google Calendar conectado correctamente');
    } else if (status === 'error') {
      toast.error('No se pudo conectar Google Calendar');
    }

    navigate(returnUrl, { replace: true });
  }, []);

  return <p>Conectando Google Calendar...</p>; // se ve un instante
}