let isAuthenticated = false;
let listeners = new Set();
let userName = null;
let googleCalendarConnected = false;

export function setGoogleCalendarConnected(value) {
  googleCalendarConnected = value;
}

export function getGoogleCalendarConnected() {
  return googleCalendarConnected;
}

export function setUserName(name) {
  userName = name;
}

export function getUserName() {
  return userName;
}

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
