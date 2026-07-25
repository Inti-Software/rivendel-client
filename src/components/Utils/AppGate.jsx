// AppGate.jsx
import { useBackendStatus } from './context/BackendStatusContext';
import WakeUpSpinner from './components/WakeUpSpinner';
import ErrorScreen from './components/ErrorScreen';

export function AppGate({ children }) {
  const { isBackendReady, isChecking } = useBackendStatus();

  if (isChecking) {
    return <WakeUpSpinner message="Iniciando el servidor, puede tardar unos segundos..." />;
  }

  if (!isBackendReady) {
    return (
      <ErrorScreen
        message="No se pudo conectar al servidor."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return children;
}