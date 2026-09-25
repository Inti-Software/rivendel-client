import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button.jsx";
import { setCalendarConnected } from "../../../stores/calendar.js";

const connect = vi.fn();
const disconnect = vi.fn();
let loading = false;

vi.mock("../hooks/useGoogleCalendar", () => ({
  useGoogleCalendar: () => ({ connect, disconnect, loading }),
}));

describe("<Button /> (Google Calendar)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loading = false;
    setCalendarConnected(false);
  });

  it("muestra conectar cuando el calendario está desconectado", () => {
    render(<Button />);

    expect(screen.getByRole("button", { name: /conectar a google calendar/i })).toBeInTheDocument();
  });

  it("ejecuta connect al pulsar conectar", () => {
    render(<Button />);

    fireEvent.click(screen.getByRole("button", { name: /conectar a google calendar/i }));

    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("muestra desconectar cuando el calendario está conectado", async () => {
    const { rerender } = render(<Button />);
    setCalendarConnected(true);
    await waitFor(() => rerender(<Button />));

    expect(screen.getByRole("button", { name: /desconectar de google calendar/i })).toBeInTheDocument();
  });

  it("ejecuta disconnect al pulsar desconectar", async () => {
    setCalendarConnected(true);
    render(<Button />);
    await waitFor(() => expect(screen.getByRole("button", { name: /desconectar/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /desconectar/i }));

    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("deshabilita el botón mientras carga", () => {
    loading = true;
    render(<Button />);

    expect(screen.getByRole("button", { name: /redirigiendo/i })).toBeDisabled();
  });
});
