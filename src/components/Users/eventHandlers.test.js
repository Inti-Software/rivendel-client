import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleSubmit } from "./eventHandlers.js";
import { Users } from "../../api/repositories/users.js";

vi.mock("../../api/repositories/users.js", () => ({
  Users: {
    update: vi.fn(),
  },
}));

const validState = {
  nombre: "Ana López",
  nroHabilitacion: 123,
  password: "actual",
  newPassword: "nueva",
  newPasswordRepeated: "nueva",
};

const createArgs = (state = validState) => ({
  event: { preventDefault: vi.fn() },
  dispatch: vi.fn(),
  navigate: vi.fn(),
  state,
});

describe("handleSubmit (Users)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("actualiza el usuario y navega cuando la respuesta es exitosa", async () => {
    Users.update.mockResolvedValue({ ok: true });
    const { event, dispatch, navigate, state } = createArgs();

    await handleSubmit(event, state, dispatch, navigate);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: "SUBMIT_START" });
    expect(Users.update).toHaveBeenCalledWith({
      nombre: "Ana López",
      nroHabilitacion: 123,
      currentPassword: "actual",
      newPassword: "nueva",
      passwordConfirmation: "nueva",
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "SUBMIT_SUCCESS" });
    expect(navigate).toHaveBeenCalledWith("/reclamos", {
      state: { successMsg: "Sus datos se actualizaron correctamente." },
    });
  });

  it("rechaza un nombre vacío sin llamar al backend", async () => {
    const { event, dispatch, navigate } = createArgs({
      ...validState,
      nombre: "   ",
    });

    await handleSubmit(event, { ...validState, nombre: "   " }, dispatch, navigate);

    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_ERRORS",
      errors: ["Ingrese un nombre."],
    });
    expect(Users.update).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("muestra el error del backend cuando la actualización falla", async () => {
    Users.update.mockResolvedValue({ ok: false, error: "No se pudo actualizar el usuario" });
    const { event, dispatch, navigate, state } = createArgs();

    await handleSubmit(event, state, dispatch, navigate);

    expect(dispatch).toHaveBeenCalledWith({
      type: "SUBMIT_FAIL",
      errors: "No se pudo actualizar el usuario",
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("captura errores inesperados del repositorio", async () => {
    Users.update.mockRejectedValue(new Error("Servicio no disponible"));
    const { event, dispatch, navigate, state } = createArgs();

    await handleSubmit(event, state, dispatch, navigate);

    expect(dispatch).toHaveBeenCalledWith({
      type: "SUBMIT_FAIL",
      errors: ["Servicio no disponible"],
    });
    expect(navigate).not.toHaveBeenCalled();
  });
});
