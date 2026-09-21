import { refresh } from "./auth.api";
import { clearAuthData, setAuthData } from "../stores/token";
import { setAuthenticated, setAuthResolved } from './authState';

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
