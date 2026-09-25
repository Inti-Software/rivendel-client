import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCalendarConnected,
  setCalendarConnected,
  subscribeCalendar,
} from "./calendar.js";

describe("calendar store", () => {
  beforeEach(() => {
    setCalendarConnected(false);
  });

  it("guarda y devuelve el estado de conexión", () => {
    setCalendarConnected(true);

    expect(getCalendarConnected()).toBe(true);
  });

  it("notifica a los suscriptores cuando cambia el estado", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeCalendar(listener);

    setCalendarConnected(true);
    setCalendarConnected(false);

    expect(listener).toHaveBeenNthCalledWith(1, true);
    expect(listener).toHaveBeenNthCalledWith(2, false);
    unsubscribe();
  });

  it("deja de notificar después de cancelar la suscripción", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeCalendar(listener);
    unsubscribe();

    setCalendarConnected(true);

    expect(listener).not.toHaveBeenCalled();
  });
});
