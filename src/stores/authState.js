let isAuthenticated = false;
let isAuthenticatedListeners = new Set();
let userName = null;
let googleCalendarConnected = false;
let calendarListeners = new Set();
let authResolved = false;
let authResolvedListeners = new Set();

export function getGoogleCalendarConnected() {
  return googleCalendarConnected;
}

export function setGoogleCalendarConnected(value) {
  googleCalendarConnected = value;
  calendarListeners.forEach((l) => l(googleCalendarConnected));
}

export function subscribeCalendar(listener) {
  calendarListeners.add(listener);
  return () => calendarListeners.delete(listener);
}

export function setUserName(name) {
  userName = name;
}

export function getUserName() {
  return userName;
}

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