import { setAuthenticated } from "../stores/auth-status";
import { setUserName } from "../dtos/userName";
import { setGoogleCalendarConnected } from "../stores/googleCalendar";
import { setToken } from "../dtos/token";

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
