let isBackendDown = false;
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
