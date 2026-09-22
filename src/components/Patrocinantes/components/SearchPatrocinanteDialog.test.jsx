import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchPatrocinanteDialog from "./SearchPatrocinanteDialog.jsx";
import { Patrocinantes } from "../../../api/repositories/patrocinantes.js";

let capturedProps;

vi.mock("../../../api/repositories/patrocinantes.js", () => ({
  Patrocinantes: {
    findAll: vi.fn(),
  },
}));

vi.mock("../../SearchDialog/components/ModalSearchDialog", () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="modal-search-dialog">{props.title}</div>;
  },
}));

const renderDialog = ({ handleAccept = vi.fn(), handleCancel = vi.fn() } = {}) => {
  render(
    <SearchPatrocinanteDialog
      handleAccept={handleAccept}
      handleCancel={handleCancel}
    />
  );

  return { handleAccept, handleCancel };
};

describe("<SearchPatrocinanteDialog />", () => {
  beforeEach(() => {
    capturedProps = undefined;
    vi.clearAllMocks();
  });

  it("configura el modal con el título, placeholder y columnas correctos", () => {
    const { handleAccept, handleCancel } = renderDialog();

    expect(screen.getByTestId("modal-search-dialog")).toHaveTextContent("Patrocinantes");
    expect(capturedProps).toMatchObject({
      title: "Patrocinantes",
      placeholder: "Nombre o Nro. de Matrícula",
      onAccept: handleAccept,
      onCancel: handleCancel,
    });
    expect(capturedProps.columns).toEqual([
      { key: "nombre", label: "Nombre" },
      { key: "nroMatricula", label: "Matrícula" },
      { key: "nroCasillero", label: "Casillero" },
    ]);
  });

  it("delega la búsqueda al repositorio de patrocinantes", async () => {
    const response = { ok: true, data: { data: [{ id: 1, nombre: "Ana" }] } };
    Patrocinantes.findAll.mockResolvedValue(response);

    renderDialog();

    await expect(capturedProps.searchFn("  Ana  ")).resolves.toBe(response);
    expect(Patrocinantes.findAll).toHaveBeenCalledTimes(1);
    expect(Patrocinantes.findAll).toHaveBeenCalledWith({ query: "  Ana  " });
  });

  it("mantiene las referencias de los handlers para aceptar y cancelar", () => {
    const { handleAccept, handleCancel } = renderDialog();

    expect(capturedProps.onAccept).toBe(handleAccept);
    expect(capturedProps.onCancel).toBe(handleCancel);
  });
});
