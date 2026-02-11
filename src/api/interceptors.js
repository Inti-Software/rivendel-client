import { http } from "./http.js";
import { refresh } from "../auth/auth.api.js";
import { getToken, setToken, clearToken } from "./tokenStore.js";

let isRefreshing = false;
let subscribers = [];

function subscribe(cb) {
  subscribers.push(cb);
}

function notify(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

export function setupInterceptors() {
  http.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      console.log("Attaching token to request:", token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (res) => res,
    async (error) => {
      console.log("Interceptor caught an error:", error);

      const original = error.config;

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribe((token) => {
              console.log("Retrying original request with new token:", token);
              original.headers.Authorization = `Bearer ${token}`;
              resolve(http(original));
            });
          });
        }

        isRefreshing = true;

        try {
          const newToken = await refresh();
          setToken(newToken);
          notify(newToken);
          return http(original);
        } catch (err) {
          clearToken();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
