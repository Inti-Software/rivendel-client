import { setAuthenticated } from "./auth-status";
import { setUserName } from "../stores/userName";
import { setGoogleCalendarConnected } from "../stores/googleCalendar";

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
