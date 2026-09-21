import { authHttp } from "./http.js";
import { refresh } from "./auth.repository.js";
import { getToken } from "../dtos/token.js";
import { clearAuthData, setAuthData } from "../auth/auth.service.js";
import { BACKEND_STATUS_DOWN, BACKEND_STATUS_UP, BACKEND_STATUS_ERROR, setBackendDown } from '../stores/backend-status.js';

let isRefreshing = false;
let failedQueue = [];
const MAX_RETRIES = 10;
const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 16000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

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
  setBackendDown(BACKEND_STATUS_UP);
  return response;
}

async function onResponseUseRejected(error) {
  const originalRequest = error.config;

  const isNetworkOrTimeoutError =
    !error.response && (error.code === 'ECONNABORTED' || error.message === 'Network Error');

  if (isNetworkOrTimeoutError) {
    originalRequest._retryCount = originalRequest._retryCount || 0;
    originalRequest._delay = originalRequest._delay || INITIAL_DELAY_MS;
    
    if (originalRequest._retryCount >= MAX_RETRIES) {
      setBackendDown(BACKEND_STATUS_DOWN);
      return Promise.reject(error);
    }
    
    
    originalRequest._retryCount += 1;
    originalRequest._delay = (originalRequest._delay < MAX_DELAY_MS)? originalRequest._delay * 2 : MAX_DELAY_MS;
    await wait(originalRequest._delay);
    setBackendDown(BACKEND_STATUS_ERROR);

    return authHttp(originalRequest);
  }

  setBackendDown(BACKEND_STATUS_UP);

  if (!error.response) {
    return Promise.reject(error);
  }

  const isAuthRefreshCall = originalRequest.url.includes("/auth/refresh");

  if (error.response.status === 401 && !originalRequest._retry && !isAuthRefreshCall) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return authHttp(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const data = await refresh();
      setAuthData(data);
      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return authHttp(originalRequest);
    } catch (err) {
      processQueue(err, null);
      clearAuthData();
      window.location.href = "/";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
}

export function setupInterceptors() {
  authHttp.interceptors.request.use(onRequestUseFullFilled, onRequestUseRejected);
  authHttp.interceptors.response.use(onResponseUseFullFilled, onResponseUseRejected);
}