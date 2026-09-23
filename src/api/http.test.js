import { describe, expect, it, vi } from "vitest";
import { authHttp, publicHttp } from "./http.js";
import { BASE_URL } from "./constants.js";

vi.mock("axios", () => ({
  default: {
    create: vi.fn((config) => ({ config })),
  },
}));

describe("http clients", () => {
  it("crea el cliente autenticado con base URL y cookies", () => {
    expect(authHttp).toEqual({
      config: {
        baseURL: BASE_URL,
        withCredentials: true,
      },
    });
  });

  it("crea el cliente público con base URL y cookies", () => {
    expect(publicHttp).toEqual({
      config: {
        baseURL: BASE_URL,
        withCredentials: true,
      },
    });
  });

  it("crea dos clientes axios independientes", () => {
    expect(authHttp).not.toBe(publicHttp);
    expect(authHttp.config).toEqual({
      baseURL: BASE_URL,
      withCredentials: true,
    });
    expect(publicHttp.config).toEqual({
      baseURL: BASE_URL,
      withCredentials: true,
    });
  });
});
