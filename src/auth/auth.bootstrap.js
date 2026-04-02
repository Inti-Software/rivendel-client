import { refresh } from "./auth.api";
import { clearAuthData, setAuthData } from "../api/tokenStore";

export async function initializeAuth() {
  try {
    const data = await refresh();
    setAuthData(data);
  } catch {
    clearAuthData();
    window.location.href = "/";
  }
}
