import { beforeEach, describe, expect, it, vi } from "vitest";
import { initializeAuth } from "./auth.bootstrap.js";
import { refresh } from "../api/auth.repository.js";
import { clearAuthData, setAuthData } from "./auth.service.js";
import { getAuthenticated, setAuthenticated } from "../stores/auth-status.js";
import { getAuthResolved, setAuthResolved } from "../stores/auth-resolution.js";

vi.mock("../api/auth.repository.js", () => ({
  refresh: vi.fn(),
}));

vi.mock("./auth.service.js", () => ({
  clearAuthData: vi.fn(),
  setAuthData: vi.fn(),
}));

describe("initializeAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAuthenticated(false);
    setAuthResolved(false);
  });

  it("restaura la sesión y marca auth como resuelto", async () => {
    const data = { accessToken: "token", userName: "Ana", googleCalendarConnected: false };
    refresh.mockResolvedValue(data);

    await initializeAuth();

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(setAuthData).toHaveBeenCalledWith(data);
    expect(getAuthenticated()).toBe(true);
    expect(clearAuthData).not.toHaveBeenCalled();
    expect(getAuthResolved()).toBe(true);
  });

  it("limpia la sesión cuando falla refresh", async () => {
    refresh.mockRejectedValue(new Error("Sesión expirada"));

    await initializeAuth();

    expect(clearAuthData).toHaveBeenCalledTimes(1);
    expect(getAuthenticated()).toBe(false);
    expect(getAuthResolved()).toBe(true);
  });
});
