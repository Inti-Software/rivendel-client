import { setAuthenticated } from "../auth/authState";

let accessToken = null;

export function setToken(token) {
  accessToken = token;
  setAuthenticated(true);
}

export function getToken() {
  return accessToken;
}

export function clearToken() {
  accessToken = null;
  setAuthenticated(false);
}
