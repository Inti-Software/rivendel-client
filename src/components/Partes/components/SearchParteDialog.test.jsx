import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchParteDialog from "./SearchParteDialog.jsx";
import { Partes } from "../../../api/repositories/partes.js";

let capturedProps;

vi.mock("../../../api/repositories/partes.js", () => ({
  Partes: {
    findAll: vi.fn(),
  },
}));

vi.mock("../../SearchDialog/components/ModalSearchDialog", () => ({
  default: (props) => {
    capturedProps = props;
    return props.visible ? <div data-testid="modal-search-dialog">{props.title}</div> : null;
  },
}));

const renderDialog = ({
  title = "Buscar",
  visible = true,
  handleAccept = vi.fn(),
  handleCancel = vi.fn(),
} = {}) => {
  render(
    <SearchParteDialog
      title={title}
      visible={visible}
      handleAccept={handleAccept}
      handleCancel={handleCancel}
    />
  );

  return { handleAccept, handleCancel };
};

const parteBase = {
  id: 7,
  tipoDocumento: "DNI",
  nroDocumento: "12345678",
  nombre: "Ana López",
};

const renderRow = (row) =>
  render(
    <table>
      <tbody>{row}</tbody>
    </table>
  );

describe("<SearchParteDialog />", () => {
  beforeEach(() => {
    capturedProps = undefined;
    vi.clearAllMocks();
  });

  it("configura el modal con el título, placeholder y handlers recibidos", () => {
    const { handleAccept, handleCancel } = renderDialog({ title: "Agregar reclamante" });

    expect(screen.getByTestId("modal-search-dialog")).toHaveTextContent("Agregar reclamante");
    expect(capturedProps).toMatchObject({
      title: "Agregar reclamante",
      placeholder: "Nombre o CUIL",
      visible: true,
      onAccept: handleAccept,
      onCancel: handleCancel,
    });
    expect(capturedProps.template).toEqual(expect.any(Function));
  });

  it("oculta el modal cuando visible es falso", () => {
    renderDialog({ title: "Agregar reclamado", visible: false });

    expect(screen.queryByTestId("modal-search-dialog")).not.toBeInTheDocument();
    expect(capturedProps.visible).toBe(false);
  });

  it("busca partes usando el término recibido", async () => {
    Partes.findAll.mockResolvedValue({ ok: true, data: { data: [] } });

    renderDialog();

    await capturedProps.searchFn("  Ana  ");

    expect(Partes.findAll).toHaveBeenCalledWith({ query: "  Ana  " });
  });

  it("renderiza una parte sin patrocinante", () => {
    renderDialog();

    renderRow(capturedProps.template(parteBase, false, vi.fn()));

    expect(screen.getByText("No hay datos para mostrar.")).toBeInTheDocument();
  });

  it("renderiza los datos del patrocinante y su domicilio", () => {
    renderDialog();

    const selectRow = vi.fn();
    const row = capturedProps.template(
      {
        ...parteBase,
        patrocinante: {
          nroMatricula: 55,
          nombre: "Luis Gómez",
          domicilio: "San Martín 10",
          localidad: "Rosario",
        },
      },
      false,
      selectRow
    );

    renderRow(row);

    expect(screen.getByText(/Nº Matr\.:/)).toBeInTheDocument();
    expect(screen.getByText("55")).toBeInTheDocument();
    expect(screen.getByText("Luis Gómez")).toBeInTheDocument();
    expect(screen.getByText("San Martín 10, Rosario")).toBeInTheDocument();
  });

  it("marca la fila seleccionada y notifica el id al hacer click", () => {
    renderDialog();

    const selectRow = vi.fn();
    const row = capturedProps.template(parteBase, true, selectRow);
    const { container } = renderRow(row);

    fireEvent.click(container.querySelector("tr"));

    expect(selectRow).toHaveBeenCalledWith(7);
    expect(container.querySelector("div.border")).toHaveClass("bg-warning-subtle");
  });
});
