import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthResolved, setAuthResolved, subscribeAuthResolved } from "./auth-resolution.js";

describe("auth-resolution store", () => {
  beforeEach(() => {
    setAuthResolved(false);
  });

  it("persistencia y suscripción de la resolución de autenticación", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAuthResolved(listener);

    setAuthResolved(true);

    expect(getAuthResolved()).toBe(true);
    expect(listener).toHaveBeenCalledWith(true);

    unsubscribe();
  });
});
