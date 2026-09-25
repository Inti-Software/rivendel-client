import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppGate } from "./AppGate.jsx";
import { BackendStatusProvider } from "../../contexts/BackendStatusProvider.jsx";
import { BACKEND_STATUS_CHECKING, BACKEND_STATUS_DOWN, BACKEND_STATUS_UP, setBackendDown } from "../../stores/backend-status.js";
import { Health } from "../../api/repositories/health.js";

vi.mock("../../api/repositories/health.js", () => ({
  Health: {
    get: vi.fn(),
  },
}));

const renderAppGate = (children = <div>Contenido</div>) =>
  render(
    <BackendStatusProvider>
      <AppGate>{children}</AppGate>
    </BackendStatusProvider>
  );

describe("AppGate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setBackendDown(BACKEND_STATUS_CHECKING);
  });

  it("muestra el spinner mientras el backend aún está iniciándose", () => {
    renderAppGate();

    expect(screen.getByText("El servidor se está iniciando, puede tardar unos segundos.")).toBeInTheDocument();
  });

  it("muestra la pantalla de error cuando el backend está caído y permite reintentar", async () => {
    setBackendDown(BACKEND_STATUS_DOWN);
    Health.get.mockResolvedValue({ ok: true });

    renderAppGate();

    expect(screen.getByText(/No pudimos conectar con el servidor/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    await waitFor(() => expect(Health.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("renderiza el contenido cuando el backend está operativo", () => {
    setBackendDown(BACKEND_STATUS_UP);

    renderAppGate();

    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });
});
