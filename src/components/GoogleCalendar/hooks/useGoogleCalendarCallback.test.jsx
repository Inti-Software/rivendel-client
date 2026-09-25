import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { useGoogleCalendarCallback } from "./useGoogleCalendarCallback.js";

const CallbackHarness = ({ onSuccess, onError }) => {
  useGoogleCalendarCallback({ onSuccess, onError });
  return null;
};

describe("useGoogleCalendarCallback", () => {
  it("ejecuta onSuccess y limpia el parámetro connected", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    render(
      <MemoryRouter initialEntries={["/callback?google_calendar=connected"]}>
        <CallbackHarness onSuccess={onSuccess} onError={onError} />
      </MemoryRouter>
    );

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(onError).not.toHaveBeenCalled();
  });

  it("ejecuta onError y no ejecuta onSuccess para error", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    render(
      <MemoryRouter initialEntries={["/callback?google_calendar=error"]}>
        <CallbackHarness onSuccess={onSuccess} onError={onError} />
      </MemoryRouter>
    );

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("ignora estados desconocidos", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    render(
      <MemoryRouter initialEntries={["/callback?google_calendar=unknown"]}>
        <CallbackHarness onSuccess={onSuccess} onError={onError} />
      </MemoryRouter>
    );

    await waitFor(() => expect(onSuccess).not.toHaveBeenCalled());
    expect(onError).not.toHaveBeenCalled();
  });
});
