let isAuthenticated = false;
let isAuthenticatedListeners = new Set();

export function setAuthenticated(value) {
  isAuthenticated = value;
  isAuthenticatedListeners.forEach((l) => l(isAuthenticated));
}

export function getAuthenticated() {
  return isAuthenticated;
}

export function subscribeAuthenticated(listener) {
  isAuthenticatedListeners.add(listener);
  return () => isAuthenticatedListeners.delete(listener);
}

