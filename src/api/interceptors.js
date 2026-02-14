import { http } from "./http.js";
import { refresh } from "../auth/auth.api.js";
import { getToken, setToken, clearToken } from "./tokenStore.js";

export function setupInterceptors() {
   // Agregar un interceptor a la petición
  http.interceptors.request.use(function (config) {
      // Haz algo antes que la petición se ha enviada
      const token = getToken();
      console.log("Interceptor request use - current token:", token);
      if (token) {
        console.log("Attaching token to request:", token);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, function (error) {
      // Haz algo con el error de la petición
      console.log("Interceptor request use caught a request error:", error);
      return Promise.reject(error);
    });

  // Agregar una respuesta al interceptor
  http.interceptors.response.use(function (response) {
      // Cualquier código de estado que este dentro del rango de 2xx causa la ejecución de esta función 
      // Haz algo con los datos de la respuesta
      console.log("Response received:", response.status, response.config.url);
      return response;
    }, function (error) {
      // Cualquier código de estado que este fuera del rango de 2xx causa la ejecución de esta función
      // Haz algo con el error
      if (error.response?.status === 401) {
        console.log("Interceptor caught a 401 error:", error.config._retry, error.response?.status);
        const token = getToken();
        console.log("Current token before refresh attempt:", token);
        if (token) {
          console.log("Attempting to refresh token...");
          return refresh()
            .then((newToken) => {
              setToken(newToken);
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return http(error.config); // Reenviar la solicitud original con el nuevo token
            })
            .catch((err) => {
              clearToken();
              return Promise.reject(err);
            });
        }
      }
      return Promise.reject(error);
    });
}
