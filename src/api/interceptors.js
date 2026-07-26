import { authHttp } from "./http.js";
import { refresh } from "../auth/auth.api.js";
import { getToken, clearAuthData, setAuthData } from "./tokenStore.js";
import { setBackendDown } from './backendStatusStore.js';

let isRefreshing = false;
let failedQueue = [];
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

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
  setBackendDown(false);
  return response;
}

async function onResponseUseRejected(error) {
  console.log('INTERCEPTOR ERROR:', {
    code: error.code,
    message: error.message,
    hasResponse: !!error.response,
    status: error.response?.status,
  });  
  
  const originalRequest = error.config;

  const isNetworkOrTimeoutError =
    !error.response && (error.code === 'ECONNABORTED' || error.message === 'Network Error');

  if (isNetworkOrTimeoutError) {
    console.log('is network error');
    originalRequest._retryCount = originalRequest._retryCount || 0;

    console.log('originalRequest._retryCount >= MAX_RETRIES', originalRequest._retryCount >= MAX_RETRIES, 'originalRequest._retryCount, MAX_RETRIES', originalRequest._retryCount, MAX_RETRIES);
    if (originalRequest._retryCount >= MAX_RETRIES) {
      console.log('originalRequest._retryCount >= MAX_RETRIES');
      setBackendDown(true);
      return Promise.reject(error);
    }

    originalRequest._retryCount += 1;
    console.log('originalRequest._retryCount += 1');
    setBackendDown(true);
    await wait(RETRY_DELAY_MS);

    return authHttp(originalRequest);
  }

  console.log('!isNetworkOrTimeoutError');

  setBackendDown(false);

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