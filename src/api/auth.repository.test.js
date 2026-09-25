import { beforeEach, describe, expect, it, vi } from "vitest";
import { authHttp, publicHttp } from "./http.js";
import { login, logout, refresh } from "./auth.repository.js";

vi.mock("./http.js", () => ({
  authHttp: Object.assign(vi.fn(), { post: vi.fn() }),
  publicHttp: { post: vi.fn() },
}));

describe("auth.repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envía las credenciales y devuelve los datos al iniciar sesión", async () => {
    const data = { accessToken: "token" };
    publicHttp.post.mockResolvedValue({ data });

    await expect(login("ana@example.com", "secret")).resolves.toEqual({ data });
    expect(publicHttp.post).toHaveBeenCalledWith("/auth/login", {
      email: "ana@example.com",
      password: "secret",
    });
  });

  it.each([
    [401, "El usuario o la contraseña son incorrectos."],
    [500, "Error del servidor. Por favor, inténtelo de nuevo más tarde."],
    [400, "Error al iniciar sesión. Por favor, inténtelo de nuevo."],
  ])("mapea el error HTTP %s de login", async (status, message) => {
    publicHttp.post.mockRejectedValue({ response: { status } });

    await expect(login("ana@example.com", "secret")).resolves.toEqual({
      error: true,
      message,
    });
  });

  it("mapea un error de red de login", async () => {
    publicHttp.post.mockRejectedValue(new Error("Network error"));

    await expect(login("ana@example.com", "secret")).resolves.toEqual({
      error: "Error al iniciar sesión. Por favor, inténtelo de nuevo.",
    });
  });

  it("solicita refresh y devuelve la respuesta", async () => {
    const data = { accessToken: "refreshed" };
    authHttp.mockResolvedValue({ data });

    await expect(refresh()).resolves.toEqual(data);
    expect(authHttp).toHaveBeenCalledWith({ method: "post", url: "/auth/refresh" });
  });

  it("rechaza refresh cuando falla la sesión", async () => {
    authHttp.mockRejectedValue(new Error("expired"));

    await expect(refresh()).rejects.toBe(
      "No se pudo refrescar el token. Por favor, inicie sesión nuevamente."
    );
  });

  it("cierra la sesión mediante authHttp", async () => {
    authHttp.post.mockResolvedValue({});

    await logout();

    expect(authHttp.post).toHaveBeenCalledWith("/auth/logout");
  });
});
