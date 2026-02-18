let isAuthenticated = false;
let listeners = new Set();

export function setAuthenticated(value) {
  isAuthenticated = value;
  listeners.forEach((l) => l(isAuthenticated));
}

export function getAuthenticated() {
  return isAuthenticated;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
