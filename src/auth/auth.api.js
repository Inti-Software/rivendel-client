import axios from "axios";
import { http } from "../api/http";

export async function login(email, password) {
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });
    const { data } = response;
    return { data: data };
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
  const res = await http({ method: "post", url: "/auth/refresh" });
  return res.data;
}

export async function logout() {
  await http.post("/auth/logout");
}
