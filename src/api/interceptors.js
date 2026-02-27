import { http } from "./http.js";
import { refresh } from "../auth/auth.api.js";
import { getToken, clearAuthData, setAuthData } from "./tokenStore.js";

async function onRequestUseFullFilled(config) {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

async function onRequestUseRejected(error) {
  return Promise.reject(error);
}

async function onResponseUseFullFilled(response) {
  return response;
}

async function onResponseUseRejected(error) {
  console.log("Error en respuesta:", error.response?.status);
  if (error.response?.status === 401) {
    return refresh()
      .then((data) => {
        setAuthData(data);
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return http(error.config);
      })
      .catch((err) => {
        clearAuthData();
        window.location.href = "/";
        return Promise.reject(err);
      });
  }
  return Promise.reject(error);
}

export function setupInterceptors() {
  http.interceptors.request.use(onRequestUseFullFilled, onRequestUseRejected);
  http.interceptors.response.use(onResponseUseFullFilled, onResponseUseRejected);
}