import { http } from "./http.js";
import { refresh } from "../auth/auth.api.js";
import { getToken, setToken, clearToken } from "./tokenStore.js";

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
  if (error.response?.status === 401) {
    return refresh()
      .then((newToken) => {
        setToken(newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return http(error.config);
      })
      .catch((err) => {
        clearToken();
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