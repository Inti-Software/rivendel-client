let isAuthenticated = false;
let isAuthenticatedListeners = new Set();
let authResolved = false;
let authResolvedListeners = new Set();

export function setAuthenticated(value) {
  isAuthenticated = value;
  isAuthenticatedListeners.forEach((l) => l(isAuthenticated));
}

export function getAuthenticated() {
  return isAuthenticated;
}

export function subscribe(listener) {
  isAuthenticatedListeners.add(listener);
  return () => isAuthenticatedListeners.delete(listener);
}

export function setAuthResolved(value) {
  authResolved = value;
  authResolvedListeners.forEach((l) => l(authResolved));
}

export function getAuthResolved() {
  return authResolved;
}

export function subscribeAuthResolved(listener) {
  authResolvedListeners.add(listener);
  return () => authResolvedListeners.delete(listener);
}