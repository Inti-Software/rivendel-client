import { beforeEach, describe, expect, it, vi } from "vitest";
import { authHttp } from "./http.js";
import { refresh } from "./auth.repository.js";
import { getToken } from "../dtos/token.js";
import { setAuthData } from "../auth/auth.service.js";
import {
  BACKEND_STATUS_DOWN,
  BACKEND_STATUS_ERROR,
  BACKEND_STATUS_UP,
  getBackendDown,
  setBackendDown,
} from "../stores/backend-status.js";
import { setupInterceptors } from "./interceptors.js";

vi.mock("./http.js", () => ({
  authHttp: Object.assign(vi.fn(), {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }),
}));

vi.mock("./auth.repository.js", () => ({
  refresh: vi.fn(),
}));

vi.mock("../auth/auth.service.js", () => ({
  clearAuthData: vi.fn(),
  setAuthData: vi.fn(),
}));

let requestFulfilled;
let responseFulfilled;
let responseRejected;

const loadInterceptors = () => {
  setupInterceptors();
  [[requestFulfilled]] = authHttp.interceptors.request.use.mock.calls;
  [[responseFulfilled, responseRejected]] = authHttp.interceptors.response.use.mock.calls;
};

describe("interceptors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setBackendDown(BACKEND_STATUS_UP);
    loadInterceptors();
  });

  it("registra interceptores de request y response", () => {
    expect(authHttp.interceptors.request.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
    expect(authHttp.interceptors.response.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("agrega el token Bearer a la request cuando existe", async () => {
    const { setToken } = await import("../dtos/token.js");
    setToken("token-123");
    const config = { headers: {} };

    await expect(requestFulfilled(config)).resolves.toEqual({
      headers: { Authorization: "Bearer token-123" },
    });
    expect(getToken()).toBe("token-123");
  });

  it("deja la request sin Authorization cuando no existe token", async () => {
    const { setToken } = await import("../dtos/token.js");
    setToken(null);
    const config = { headers: {} };

    await expect(requestFulfilled(config)).resolves.toBe(config);
    expect(config.headers.Authorization).toBeUndefined();
  });

  it("marca el backend como disponible cuando una respuesta tiene éxito", async () => {
    setBackendDown(BACKEND_STATUS_DOWN);

    const response = { status: 200, data: {} };
    await expect(responseFulfilled(response)).resolves.toBe(response);

    expect(getBackendDown()).toBe(BACKEND_STATUS_UP);
  });

  it("rechaza errores sin response y conserva el estado de backend", async () => {
    const error = new Error("fallo inesperado");

    await expect(responseRejected(error)).rejects.toBe(error);
    expect(getBackendDown()).toBe(BACKEND_STATUS_UP);
  });

  it("refresca el token y reintenta una request con 401", async () => {
    const newData = { accessToken: "nuevo-token", userName: "Ana" };
    const originalRequest = { url: "/users", headers: {} };
    refresh.mockResolvedValue(newData);
    authHttp.mockResolvedValue({ ok: true });

    await expect(
      responseRejected({
        config: originalRequest,
        response: { status: 401 },
      })
    ).resolves.toEqual({ ok: true });

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(setAuthData).toHaveBeenCalledWith(newData);
    expect(originalRequest._retry).toBe(true);
    expect(originalRequest.headers.Authorization).toBe("Bearer nuevo-token");
    expect(authHttp).toHaveBeenCalledWith(originalRequest);
  });

  it("no intenta refresh para la propia request de refresh", async () => {
    const error = { config: { url: "/auth/refresh", headers: {} }, response: { status: 401 } };

    await expect(responseRejected(error)).rejects.toBe(error);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("rechaza una request que ya fue reintentada", async () => {
    const error = { config: { url: "/users", _retry: true }, response: { status: 401 } };

    await expect(responseRejected(error)).rejects.toBe(error);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("marca el backend como caído al superar los reintentos de red", async () => {
    const error = {
      config: { url: "/users", _retryCount: 10, _delay: 16000 },
      code: "ECONNABORTED",
      message: "timeout",
    };

    await expect(responseRejected(error)).rejects.toBe(error);
    expect(getBackendDown()).toBe(BACKEND_STATUS_DOWN);
  });

  it("marca error de backend antes de reintentar una falla de red", async () => {
    vi.useFakeTimers();
    const error = {
      config: { url: "/users", _retryCount: 0, _delay: 1000 },
      code: "ECONNABORTED",
      message: "timeout",
    };
    authHttp.mockResolvedValue({ ok: true });

    const promise = responseRejected(error);
    await vi.advanceTimersByTimeAsync(2000);
    await expect(promise).resolves.toEqual({ ok: true });

    expect(getBackendDown()).toBe(BACKEND_STATUS_ERROR);
    expect(authHttp).toHaveBeenCalledWith(error.config);
    vi.useRealTimers();
  });
});
