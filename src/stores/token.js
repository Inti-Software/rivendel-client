import { setAuthenticated, setUserName } from "../auth/authState";
import { setGoogleCalendarConnected } from "../auth/authState";

let accessToken = null;

export function setAuthData(data) {
  accessToken = data.accessToken;
  setAuthenticated(true);
  setUserName(data.userName);
  setGoogleCalendarConnected(data.googleCalendarConnected);
}

export function getToken() {
  return accessToken;
}

export function clearAuthData() {
  accessToken = null;
  setAuthenticated(false);
  setUserName(null);
  setGoogleCalendarConnected(false);
}
