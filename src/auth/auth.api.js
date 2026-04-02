import { authHttp, publicHttp } from "../api/http";

export async function login(email, password) {
  try {
    const response = await publicHttp.post("/auth/login", { email, password });
    return { data: response.data };
  } catch (error) {
    const msg = "Error al iniciar sesión. Por favor, inténtelo de nuevo.";
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        return { error: true, message: "El usuario o la contraseña son incorrectos." };
      } else if (status >= 500) {
        return { error: true, message: "Error del servidor. Por favor, inténtelo de nuevo más tarde." };
      } else {
        return { error: true, message: msg };
      }
    }
    return { error: msg };
  }
}

export async function refresh() {
  try {
    const res = await authHttp({ method: "post", url: "/auth/refresh" });
    return res.data;    
  } catch {
    return Promise.reject("No se pudo refrescar el token. Por favor, inicie sesión nuevamente.");
  }
}

export async function logout() {
  await authHttp.post("/auth/logout");
}
