let googleCalendarConnected = false;
let calendarListeners = new Set();

export function getCalendarConnected() {
  return googleCalendarConnected;
}

export function setCalendarConnected(value) {
  googleCalendarConnected = value;
  calendarListeners.forEach((l) => l(googleCalendarConnected));
}

export function subscribeCalendar(listener) {
  calendarListeners.add(listener);
  return () => calendarListeners.delete(listener);
}
