import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setGoogleCalendarConnected } from '../../../auth/authState';
import Spinner from '../../Shared/Spinner';

export function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get('google_calendar');
    const returnUrl = searchParams.get('returnUrl') ?? '/';

    if (status === 'connected') {
      setGoogleCalendarConnected(true);
      toast.success('Google Calendar conectado correctamente');
    } else if (status === 'error') {
      toast.error('No se pudo conectar Google Calendar');
    }

    navigate(returnUrl, { replace: true });
  }, []);

  return (
    <div className="text-center mt-5">
      <Spinner text={"Conectando..."} />
      <p>Conectando Google Calendar...</p>
    </div>
  );
}
