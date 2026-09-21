import { setAuthenticated } from "../stores/auth-status";
import { setUserName } from "../stores/userName";
import { setGoogleCalendarConnected } from "../stores/googleCalendar";
import { setToken } from "../stores/token";

export function setAuthData(data) {
	setToken(data.accessToken);
  setAuthenticated(true);
  setUserName(data.userName);
  setGoogleCalendarConnected(data.googleCalendarConnected);
}

export function clearAuthData() {
	setToken(null);
  setAuthenticated(false);
  setUserName(null);
  setGoogleCalendarConnected(false);
}
