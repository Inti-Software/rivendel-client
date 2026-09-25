import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { setAuthenticated } from "../../stores/auth-status.js";
import { setAuthResolved } from "../../stores/auth-resolution.js";

const renderRoute = () =>
  render(
    <MemoryRouter initialEntries={["/privado"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/privado" element={<div>Contenido privado</div>} />
        </Route>
        <Route path="/" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("<ProtectedRoute />", () => {
  beforeEach(() => {
    setAuthenticated(false);
    setAuthResolved(false);
  });

  it("muestra el spinner mientras no se resolvió la sesión", () => {
    renderRoute();

    expect(screen.getByText("Cargando la sesión del usuario...")).toBeInTheDocument();
  });

  it("redirige al login si la sesión está resuelta y no está autenticado", () => {
    setAuthResolved(true);
    setAuthenticated(false);

    renderRoute();

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renderiza el contenido protegido cuando está autenticado", () => {
    setAuthResolved(true);
    setAuthenticated(true);

    renderRoute();

    expect(screen.getByText("Contenido privado")).toBeInTheDocument();
  });
});
