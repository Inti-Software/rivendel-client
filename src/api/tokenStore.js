import { setAuthenticated, setUserName } from "../auth/authState";

let accessToken = null;

export function setAuthData(data) {
  accessToken = data.accessToken;
  setAuthenticated(true);
  setUserName(data.userName);
}

export function getToken() {
  return accessToken;
}

export function clearAuthData() {
  accessToken = null;
  setAuthenticated(false);
  setUserName(null);
}
