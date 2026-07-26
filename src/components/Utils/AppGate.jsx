import { useBackendStatus } from '../../contexts/Constants';
import WakeUpSpinner from './WakeUpSpinner';

export function AppGate({ children }) {
  const { isBackendDown } = useBackendStatus();

  console.log('isBackendDown', isBackendDown);

  if (isBackendDown) {
    return <WakeUpSpinner message="Iniciando el servidor, puede tardar unos segundos..." />;
  }

  return children;
}