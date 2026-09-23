import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleLogin } from "./eventHandlers.js";
import { login } from "../../api/auth.repository.js";

vi.mock("../../api/auth.repository.js", () => ({
  login: vi.fn(),
}));

const validState = {
  email: "usuario@example.com",
  password: "secreto",
};

const runHandler = (state = validState) => {
  const event = { preventDefault: vi.fn() };
  const dispatch = vi.fn();

  handleLogin(event, state, dispatch);

  return { event, dispatch };
};

describe("handleLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rechaza un correo vacío", () => {
    const { event, dispatch } = runHandler({ ...validState, email: "   " });

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SUBMIT_FAIL",
      error: "Ingrese un correo electrónico",
    });
    expect(login).not.toHaveBeenCalled();
  });

  it("rechaza un correo inválido", () => {
    const { dispatch } = runHandler({ ...validState, email: "usuario" });

    expect(dispatch).toHaveBeenCalledWith({
      type: "SUBMIT_FAIL",
      error: "Ingrese un correo electrónico válido",
    });
    expect(login).not.toHaveBeenCalled();
  });

  it("rechaza una contraseña vacía o demasiado corta", () => {
    const empty = runHandler({ ...validState, password: "" });
    const short = runHandler({ ...validState, password: "12345" });

    expect(empty.dispatch).toHaveBeenCalledWith({
      type: "SUBMIT_FAIL",
      error: "Ingrese una contraseña",
    });
    expect(short.dispatch).toHaveBeenCalledWith({
      type: "SUBMIT_FAIL",
      error: "La contraseña debe tener al menos 6 caracteres",
    });
    expect(login).not.toHaveBeenCalled();
  });

  it("inicia el submit y completa el login exitoso", async () => {
    const authData = { accessToken: "token", userName: "Ana", googleCalendarConnected: false };
    login.mockResolvedValue({ data: authData });
    const { dispatch } = runHandler();

    await vi.waitFor(() => expect(login).toHaveBeenCalledWith(validState.email, validState.password));

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: "SUBMIT_START" });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "SUBMIT_SUCCESS",
      authData,
    });
  });

  it("muestra el error devuelto por la API", async () => {
    login.mockResolvedValue({ error: true, message: "Credenciales inválidas" });
    const { dispatch } = runHandler();

    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: "SUBMIT_FAIL",
        error: "Credenciales inválidas",
      });
    });
  });

  it("usa un mensaje genérico cuando la API no informa detalle", async () => {
    login.mockResolvedValue({ error: true });
    const { dispatch } = runHandler();

    await vi.waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: "SUBMIT_FAIL",
        error: "Error al iniciar sesión.",
      });
    });
  });
});
