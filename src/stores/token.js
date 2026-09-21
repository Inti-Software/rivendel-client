import { setAuthenticated, setUserName } from "../stores/authState";
import { setGoogleCalendarConnected } from "../stores/authState";

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
