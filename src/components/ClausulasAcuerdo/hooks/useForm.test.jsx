import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useFormDialog from "./useForm.js";

const defaultFormValues = { reclamado: "", rubros: "" };
const populatedFormValues = { reclamado: "Empresa", rubros: "Rubros" };

const HookHarness = ({ defaultValues = {} }) => {
  const { state, dispatch } = useFormDialog(true, vi.fn(), defaultValues);

  return (
    <div>
      <span data-testid="reclamado">{state.reclamado}</span>
      <span data-testid="importe-letras">{state.importeLetras}</span>
      <span data-testid="cuenta-loading">{String(state.cuenta.loading)}</span>
      <button onClick={() => dispatch({ type: "SET_FIELD", field: "cuotas.cantidad", value: "3" })}>
        cuota
      </button>
      <button onClick={() => dispatch({ type: "LOAD_CUENTA_START" })}>cargar</button>
      <button onClick={() => dispatch({ type: "UPDATE_CUENTA", payload: { alias: "alias" } })}>
        cuenta
      </button>
    </div>
  );
};

describe("useFormDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga valores iniciales y calcula importe en letras", async () => {
    render(<HookHarness defaultValues={populatedFormValues} />);

    expect(screen.getByTestId("reclamado")).toHaveTextContent("Empresa");
    await waitFor(() => expect(screen.getByTestId("importe-letras")).toHaveTextContent("PESOS CERO"));
  });

  it("convierte valores numéricos anidados y actualiza cuenta/loading", async () => {
    render(<HookHarness defaultValues={defaultFormValues} />);

    fireEvent.click(screen.getByRole("button", { name: "cuota" }));
    fireEvent.click(screen.getByRole("button", { name: "cargar" }));
    expect(screen.getByTestId("cuenta-loading")).toHaveTextContent("true");

    fireEvent.click(screen.getByRole("button", { name: "cuenta" }));
    expect(screen.getByTestId("cuenta-loading")).toHaveTextContent("undefined");
  });

  it("ejecuta onCancel al presionar Escape mientras está visible", () => {
    const onCancel = vi.fn();
    const Harness = () => {
      useFormDialog(true, onCancel, defaultFormValues);
      return null;
    };

    render(<Harness />);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
