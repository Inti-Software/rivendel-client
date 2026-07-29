export const BACKEND_STATUS_UP = 1;
export const BACKEND_STATUS_DOWN = 2;
export const BACKEND_STATUS_ERROR = 3

let isBackendDown = BACKEND_STATUS_UP;
let listeners = [];

export function setBackendDown(value) {
  isBackendDown = value;
  listeners.forEach((cb) => cb(value));
}

export function subscribeBackendStatus(cb) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function getBackendDown() {
  return isBackendDown;
}
