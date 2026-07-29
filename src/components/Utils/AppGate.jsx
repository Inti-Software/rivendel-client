import { BACKEND_STATUS_ERROR } from '../../api/backendStatusStore';
import { useBackendStatus } from '../../contexts/Constants';
import WakeUpSpinner from './WakeUpSpinner';
import { getBackendDown, subscribeBackendStatus } from "../../api/backendStatusStore";

export function AppGate({ children }) {
  const { isBackendDown } = useBackendStatus();

  if (isBackendDown === BACKEND_STATUS_ERROR) {
    return <WakeUpSpinner message="Iniciando el servidor, puede tardar unos segundos..." />;
  }

  return children;
}