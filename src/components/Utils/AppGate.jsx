import { BACKEND_STATUS_UP, BACKEND_STATUS_DOWN, BACKEND_STATUS_CHECKING, setBackendDown } from '../../stores/backend-status';
import { useBackendStatus } from '../../contexts/Constants';
import WakeUpSpinner from './WakeUpSpinner';
import { Health } from '../../api/endpoints/health';

export function AppGate({ children }) {
  const { isBackendDown } = useBackendStatus();

  const handleRetry = async () => {
    setBackendDown(BACKEND_STATUS_CHECKING);
    const result = await Health.get();
    setBackendDown(result.ok ? BACKEND_STATUS_UP : BACKEND_STATUS_DOWN);
  };

  if (isBackendDown === BACKEND_STATUS_DOWN) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center px-3">
        <p className="text-muted mb-3">
          No pudimos conectar con el servidor. Puede que esté iniciando todavía.
        </p>
        <button className="btn btn-primary" onClick={handleRetry}>
          Reintentar
        </button>
      </div>
    );
  }  

  if (isBackendDown !== BACKEND_STATUS_UP) {
    return <WakeUpSpinner message="Iniciando el servidor, puede tardar unos segundos..." />;
  }

  return children;
}