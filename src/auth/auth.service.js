import { setAuthenticated } from "../stores/auth-status";
import { setUserName } from "../dtos/userName";
import { setCalendarConnected } from "../stores/calendar";
import { setToken } from "../dtos/token";

export function setAuthData(data) {
	setToken(data.accessToken);
  setAuthenticated(true);
  setUserName(data.userName);
  setCalendarConnected(data.googleCalendarConnected);
}

export function clearAuthData() {
	setToken(null);
  setAuthenticated(false);
  setUserName(null);
  setCalendarConnected(false);
}
