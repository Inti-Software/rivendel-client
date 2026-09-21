let googleCalendarConnected = false;
let calendarListeners = new Set();

export function getGoogleCalendarConnected() {
  return googleCalendarConnected;
}

export function setGoogleCalendarConnected(value) {
  googleCalendarConnected = value;
  calendarListeners.forEach((l) => l(googleCalendarConnected));
}

export function subscribeCalendar(listener) {
  calendarListeners.add(listener);
  return () => calendarListeners.delete(listener);
}
