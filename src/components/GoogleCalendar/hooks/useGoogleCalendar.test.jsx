import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GoogleCalendar } from "../../../api/repositories/google-calendar.js";
import { getCalendarConnected, setCalendarConnected } from "../../../stores/calendar.js";
import { useGoogleCalendar } from "./useGoogleCalendar.js";

vi.mock("../../../api/repositories/google-calendar.js", () => ({
  GoogleCalendar: {
    authUrl: vi.fn(),
    disconnect: vi.fn(),
  },
}));

const HookHarness = () => {
  const { connect, disconnect, loading } = useGoogleCalendar();

  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <button onClick={connect}>conectar</button>
      <button onClick={disconnect}>desconectar</button>
    </div>
  );
};

describe("useGoogleCalendar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCalendarConnected(false);
  });

  it("solicita autorización y redirige a la URL recibida", async () => {
    GoogleCalendar.authUrl.mockResolvedValue({ ok: true, data: { url: "/google-auth" } });
    render(<HookHarness />);

    fireEvent.click(screen.getByRole("button", { name: "conectar" }));
    await waitFor(() => expect(GoogleCalendar.authUrl).toHaveBeenCalledTimes(1));

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("finaliza loading si autorización falla", async () => {
    GoogleCalendar.authUrl.mockRejectedValue(new Error("Network error"));
    render(<HookHarness />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "conectar" }));
    });

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
  });

  it("desconecta y actualiza el store cuando la respuesta es exitosa", async () => {
    setCalendarConnected(true);
    GoogleCalendar.disconnect.mockResolvedValue({ ok: true });
    render(<HookHarness />);

    fireEvent.click(screen.getByRole("button", { name: "desconectar" }));
    await waitFor(() => expect(GoogleCalendar.disconnect).toHaveBeenCalledTimes(1));

    expect(getCalendarConnected()).toBe(false);
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("finaliza loading sin cambiar el store cuando desconectar falla", async () => {
    setCalendarConnected(true);
    GoogleCalendar.disconnect.mockRejectedValue(new Error("Network error"));
    render(<HookHarness />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "desconectar" }));
    });

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    expect(getCalendarConnected()).toBe(true);
  });
});
