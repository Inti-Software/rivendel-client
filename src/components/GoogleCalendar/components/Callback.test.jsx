import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCalendarConnected, setCalendarConnected } from "../../../stores/calendar.js";
import { Callback } from "./Callback.jsx";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../Shared/components/Spinner", () => ({
  default: ({ text }) => <span>{text}</span>,
}));

const renderCallback = (entry) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="*" element={<div>Destino</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("<Callback /> (Google Calendar)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCalendarConnected(false);
  });

  it("marca conectado, notifica y navega a returnUrl", async () => {
    renderCallback("/callback?google_calendar=connected&returnUrl=/reclamos");

    await waitFor(() => expect(screen.getByText("Destino")).toBeInTheDocument());
    expect(getCalendarConnected()).toBe(true);
    expect(toast.success).toHaveBeenCalledWith("Google Calendar conectado correctamente");
  });

  it("muestra error y navega cuando Google rechaza la conexión", async () => {
    renderCallback("/callback?google_calendar=error&returnUrl=/users");

    await waitFor(() => expect(screen.getByText("Destino")).toBeInTheDocument());
    expect(getCalendarConnected()).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("No se pudo conectar Google Calendar");
  });

  it("usa / como destino por defecto", async () => {
    renderCallback("/callback?google_calendar=connected");

    await waitFor(() => expect(screen.getByText("Destino")).toBeInTheDocument());
    expect(toast.success).toHaveBeenCalledTimes(1);
  });
});
