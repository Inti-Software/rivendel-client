import { beforeEach, describe, expect, it, vi } from "vitest";
import { GoogleCalendar } from "./google-calendar.js";
import { authHttp } from "../http.js";

vi.mock("../http.js", () => ({
  authHttp: vi.fn(),
}));

describe("GoogleCalendar repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, "", "/reclamos/new");
  });

  it("solicita la URL de autorización con la ruta actual", async () => {
    authHttp.mockResolvedValue({ data: { url: "https://accounts.google.com" }, status: 200 });

    await expect(GoogleCalendar.authUrl()).resolves.toEqual({
      ok: true,
      data: { url: "https://accounts.google.com" },
      status: 200,
    });
    expect(authHttp).toHaveBeenCalledWith({
      method: "get",
      url: "/google-calendar/auth-url",
      params: { returnUrl: "/reclamos/new" },
    });
  });

  it("solicita la desconexión del calendario", async () => {
    authHttp.mockResolvedValue({ data: {}, status: 200 });

    await GoogleCalendar.disconnect();

    expect(authHttp).toHaveBeenCalledWith({
      method: "post",
      url: "/google-calendar/disconnect",
    });
  });

  it("propaga errores normalizados por BaseRepository", async () => {
    authHttp.mockRejectedValue({ response: { status: 500 } });

    await expect(GoogleCalendar.disconnect()).resolves.toEqual({
      ok: false,
      error: ["Error 500 al procesar la solicitud."],
      status: 500,
    });
  });
});
