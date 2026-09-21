let authResolved = false;
let authResolvedListeners = new Set();

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