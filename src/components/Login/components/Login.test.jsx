import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login.jsx";

const dispatch = vi.fn();
const hookState = {
  email: "",
  password: "",
  showPassword: false,
  error: "",
  redirect: false,
  loading: false,
};

vi.mock("../hooks/useForm.js", () => ({
  default: () => ({
    state: hookState,
    dispatch,
    setField: vi.fn(),
  }),
}));

const renderLogin = () => render(<MemoryRouter><Login /></MemoryRouter>);

describe("<Login />", () => {
  beforeEach(() => {
    Object.assign(hookState, {
      email: "",
      password: "",
      showPassword: false,
      error: "",
      redirect: false,
      loading: false,
    });
    dispatch.mockClear();
  });

  it("renderiza el formulario de acceso", () => {
    renderLogin();

    expect(screen.getByRole("heading", { name: /conciliaciones/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeEnabled();
  });

  it("muestra el error recibido por el estado", () => {
    hookState.error = "Credenciales inválidas";
    renderLogin();

    expect(screen.getByText("Credenciales inválidas")).toHaveClass("alert-danger");
  });

  it("despacha el cambio de visibilidad al pulsar el botón de contraseña", () => {
    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));

    expect(dispatch).toHaveBeenCalledWith({ type: "TOGGLE_SHOW_PASSWORD" });
  });
});
