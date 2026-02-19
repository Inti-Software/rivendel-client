let isAuthenticated = false;
let listeners = new Set();
let userName = null;

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
