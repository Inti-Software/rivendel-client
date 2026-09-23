import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ClausulasTemplateFormDialog from "./ClausulasTemplateFormDialog.jsx";

vi.mock("../hooks/useForm.js", () => ({
  default: () => ({
    state: {
      puesto: "Administrativo",
      fecha: "",
      fechaTelegrama: "",
      reclamado: "Empresa",
      importe: 0,
      importeLetras: "PESOS CERO",
      rubros: "Rubros",
      cuotas: { cantidad: 0, importe: 0, fechaPrimera: "" },
      reclamante: { dni: 0, nombre: "Ana" },
      cuenta: { loading: false, titular: "", cuilTitular: "", entidad: "", alias: "" },
      loading: false,
    },
    dispatch: vi.fn(),
  }),
}));

vi.mock("../../Reclamos/components/DatePicker.jsx", () => ({
  default: () => <input aria-label="fecha picker" />,
}));

describe("<ClausulasTemplateFormDialog />", () => {
  it("no renderiza cuando está oculto", () => {
    const { container } = render(
      <ClausulasTemplateFormDialog visible={false} defaultValues={{}} onAccept={vi.fn()} onCancel={vi.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza campos y permite cargar una plantilla vacía", async () => {
    const onAccept = vi.fn();
    render(
      <ClausulasTemplateFormDialog
        visible
        defaultValues={{}}
        onAccept={onAccept}
        onCancel={vi.fn()}
      />
    );

    expect(
      await screen.findByRole("heading", { name: "Datos para rellenar la plantilla" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Puesto")).toHaveValue("Administrativo");
    expect(screen.getByText("PESOS CERO")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cargar plantilla vacía" }));

    expect(onAccept).toHaveBeenCalledWith(expect.anything(), null);
  });

  it("acepta los datos actuales y cancela", () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();
    render(
      <ClausulasTemplateFormDialog
        visible
        defaultValues={{}}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Aceptar" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onAccept).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ puesto: "Administrativo" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
