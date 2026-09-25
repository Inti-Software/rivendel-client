import { beforeEach, describe, expect, it, vi } from "vitest";
import { Banking } from "../../api/repositories/banking.js";
import { onBlurAliasCuenta } from "./eventHandlers.js";

vi.mock("../../api/repositories/banking.js", () => ({
  Banking: {
    getData: vi.fn(),
  },
}));

describe("onBlurAliasCuenta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ignora un alias vacío", async () => {
    const dispatch = vi.fn();

    await onBlurAliasCuenta({ target: { value: "   " } }, dispatch);

    expect(Banking.getData).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("carga los datos bancarios para un alias válido", async () => {
    Banking.getData.mockResolvedValue({
      ok: true,
      data: {
        titular: "Ana López",
        cuilTitular: "20123456789",
        bancoDestino: "Banco Nación",
      },
    });
    const dispatch = vi.fn();

    await onBlurAliasCuenta({ target: { value: "ana.alias" } }, dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: "LOAD_CUENTA_START" });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "UPDATE_CUENTA",
      payload: {
        titular: "Ana López",
        cuilTitular: "20123456789",
        entidad: "Banco Nación",
        alias: "ana.alias",
      },
    });
    expect(dispatch).toHaveBeenNthCalledWith(3, { type: "LOAD_CUENTA_END" });
  });

  it("finaliza la carga cuando el alias no devuelve datos", async () => {
    Banking.getData.mockResolvedValue({ ok: false });
    const dispatch = vi.fn();

    await onBlurAliasCuenta({ target: { value: "invalido" } }, dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: "LOAD_CUENTA_START" });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: "LOAD_CUENTA_END" });
  });
});
