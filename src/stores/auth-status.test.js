import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthenticated, setAuthenticated, subscribeAuthenticated } from "./auth-status.js";

describe("auth-status store", () => {
  beforeEach(() => {
    setAuthenticated(false);
  });

  it("persistencia y suscripción del estado de autenticación", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAuthenticated(listener);

    setAuthenticated(true);

    expect(getAuthenticated()).toBe(true);
    expect(listener).toHaveBeenCalledWith(true);

    unsubscribe();
  });
});
