import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import List from "./List.jsx";
import { DATA_COLUMN, BUTTON_COLUMN, EDIT_BUTTON, DELETE_BUTTON } from "../../Shared/constants.js";
import { Patrocinantes } from "../../../api/repositories/patrocinantes.js";

// Mockeamos Grid: no queremos testear acá su lógica interna (fetching, paginación,
// debounce, diálogo de borrado), sino verificar que List le pasa las props correctas
// y que columnBuilder arma bien cada fila. Ese path debe coincidir EXACTO con el
// specifier que usa List.jsx para importar Grid (asumiendo este test en la misma carpeta).
let capturedProps;
vi.mock("../../Grid/Grid.jsx", () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="grid-mock" />;
  },
}));

const renderList = () =>
  render(
    <MemoryRouter>
      <List />
    </MemoryRouter>
  );

describe("<List /> (Patrocinantes)", () => {
  beforeEach(() => {
    capturedProps = undefined;
  });

  it("renderiza el Grid con headers, endpoint y config de búsqueda correctos", () => {
    renderList();

    expect(screen.getByTestId("grid-mock")).toBeInTheDocument();
    expect(capturedProps.headers).toEqual([
      "Nombre", "Matrícula", "Domicilio", "Localidad", "Casillero", "",
    ]);
    expect(capturedProps.endpoints).toBe(Patrocinantes);
    expect(capturedProps.recordsPerPage).toBe(50);
    expect(capturedProps.showSearchBar).toBe(true);
    expect(capturedProps.searchPlaceHolder).toBe("Nombre, matrícula o casillero");
  });

  it("arma correctamente la fila para un patrocinante", () => {
    renderList();

    const patrocinante = {
      id: 7,
      nombre: "Juan Pérez",
      nroMatricula: "MP-123",
      domicilio: "Av. Siempre Viva 742",
      localidad: "Santiago del Estero",
      nroCasillero: 15,
    };

    const row = capturedProps.columnBuilder({ data: patrocinante });

    expect(row.key).toBe(7);
    expect(row.columns[0]).toEqual({ type: DATA_COLUMN, data: "Juan Pérez" });
    expect(row.columns[1]).toEqual({ type: DATA_COLUMN, data: "MP-123" });
    expect(row.columns[2]).toEqual({ type: DATA_COLUMN, data: "Av. Siempre Viva 742" });
    expect(row.columns[3]).toEqual({ type: DATA_COLUMN, data: "Santiago del Estero" });
    expect(row.columns[4]).toEqual({ type: DATA_COLUMN, data: 15 });

    const buttonCol = row.columns[5];
    expect(buttonCol.type).toBe(BUTTON_COLUMN);
    expect(buttonCol.buttons[0]).toMatchObject({
      type: EDIT_BUTTON,
      path: "/patrocinantes/edit/7",
    });
    expect(buttonCol.buttons[1]).toMatchObject({
      type: DELETE_BUTTON,
      path: "/patrocinantes/delete/7",
      id: 7,
    });
  });

  it("el mensaje de borrado muestra matrícula y nombre del patrocinante", () => {
    renderList();

    const patrocinante = {
      id: 1,
      nombre: "Ana López",
      nroMatricula: "MP-999",
      domicilio: "x",
      localidad: "x",
      nroCasillero: 1,
    };

    const row = capturedProps.columnBuilder({ data: patrocinante });
    const deleteButton = row.columns[5].buttons[1];

    render(deleteButton.message);

    expect(
      screen.getByText(/¿Está seguro que desea eliminar este patrocinante\?/)
    ).toBeInTheDocument();
    expect(screen.getByText("MP-999 - Ana López")).toBeInTheDocument();
  });
});
