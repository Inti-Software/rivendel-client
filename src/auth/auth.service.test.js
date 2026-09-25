import { beforeEach, describe, expect, it } from "vitest";
import { clearAuthData, setAuthData } from "./auth.service.js";
import { getToken } from "../dtos/token.js";
import { getUserName } from "../dtos/userName.js";
import { getAuthenticated } from "../stores/auth-status.js";
import { getCalendarConnected } from "../stores/calendar.js";

describe("auth.service", () => {
  beforeEach(() => {
    clearAuthData();
  });

  it("guarda todos los datos de autenticación", () => {
    setAuthData({
      accessToken: "token-123",
      userName: "Ana López",
      googleCalendarConnected: true,
    });

    expect(getToken()).toBe("token-123");
    expect(getUserName()).toBe("Ana López");
    expect(getAuthenticated()).toBe(true);
    expect(getCalendarConnected()).toBe(true);
  });

  it("limpia todos los datos de autenticación", () => {
    setAuthData({ accessToken: "token", userName: "Ana", googleCalendarConnected: true });
    clearAuthData();

    expect(getToken()).toBe(null);
    expect(getUserName()).toBe(null);
    expect(getAuthenticated()).toBe(false);
    expect(getCalendarConnected()).toBe(false);
  });
});
