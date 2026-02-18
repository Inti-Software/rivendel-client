import { refresh } from "./auth.api";
import { clearToken, setToken } from "../api/tokenStore";

export async function initializeAuth() {
  try {
    const newToken = await refresh();
    setToken(newToken);
  } catch {
    clearToken();
  }
}
