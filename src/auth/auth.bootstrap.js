import { refresh } from "../api/auth.repository";
import { clearAuthData, setAuthData } from "../auth/auth.service";
import { setAuthenticated } from '../stores/auth-status';
import { setAuthResolved } from '../stores/auth-resolution';

export async function initializeAuth() {
  try {
    const data = await refresh();
    setAuthData(data);
    setAuthenticated(true);
  } catch {
    clearAuthData();
    setAuthenticated(false);
  } finally {
    setAuthResolved(true);
  }
}
