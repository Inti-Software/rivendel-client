import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListReclamos from "./List.jsx";
import { CUSTOM_COLUMN, RECLAMANTE, RECLAMADO } from "../../Shared/constants.js";
import { Reclamos } from "../../../api/repositories/reclamos.js";
import { PENDIENTE, ACUERDO } from "../tiposResoluciones.js";
import createActa from "../acta-builder.js";

// Mockeamos Grid: List solo arma columnBuilder/props, la lógica de fetching/paginación
// de Grid ya se prueba (o debería probarse) aparte.
let capturedProps;
vi.mock("../../Grid/Grid.jsx", () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="grid-mock" />;
  },
}));

// acta-builder.js arma un PDF real con pdfmake y llama a Reclamos.get(id) (red).
// Para testear el click de "Imprimir" en aislamiento, mockeamos el módulo completo:
// handlePrint en ListCell.jsx lo importa dinámicamente (`await import('../acta-builder.js')`).
vi.mock("../acta-builder.js", () => ({
  default: vi.fn(),
}));

const renderList = () =>
  render(
    <MemoryRouter>
      <ListReclamos />
    </MemoryRouter>
  );

const reclamoBase = {
  id: 5,
  numero: 42,
  fechaHoraInicio: "2026-03-15T10:00:00",
  horaFin: "2026-03-15T11:30:00",
  proximaAudiencia: null,
  idResolucion: PENDIENTE,
  partes: [
    { rol: RECLAMANTE, parte: { nombre: "Juan Pérez" } },
    { rol: RECLAMADO, parte: { nombre: "Empresa SA" } },
  ],
};

const onDelete = vi.fn((e) => e.preventDefault());

describe("<ListReclamos />", () => {
  beforeEach(() => {
    capturedProps = undefined;
    vi.spyOn(window.history, "pushState").mockImplementation(() => {});
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza el Grid con el endpoint y la config de búsqueda correctos", () => {
    renderList();

    expect(screen.getByTestId("grid-mock")).toBeInTheDocument();
    expect(capturedProps.endpoints).toBe(Reclamos);
    expect(capturedProps.showSearchBar).toBe(true);
    expect(capturedProps.searchPlaceHolder).toBe(
      "Número o fecha de reclamo, nombre de una parte o fecha"
    );
  });

  it("arma una columna CUSTOM_COLUMN con el contenido de ListCell", () => {
    renderList();

    const row = capturedProps.columnBuilder({ data: reclamoBase, onDelete: onDelete });

    expect(row.key).toBe(5);
    expect(row.columns).toHaveLength(1);
    expect(row.columns[0].type).toBe(CUSTOM_COLUMN);
    expect(row.columns[0].content).toBeTruthy();
  });

  it("muestra número, horario, reclamantes/reclamados y estado del reclamo", () => {
    renderList();

    const row = capturedProps.columnBuilder({ data: reclamoBase, onDelete: onDelete });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByText(/Nº\s*42/)).toBeInTheDocument();
    // Horario: el formato de mes depende del locale de dayjs, así que verificamos
    // solo las horas (formato de 24hs, no depende de locale) y el "hasta".
    expect(screen.getByText(/15 de marzo de 2026 - 10:00 hs/)).toBeInTheDocument();
    expect(screen.getByText(/hasta/)).toBeInTheDocument();
    expect(screen.getByText(/11:30 hs/)).toBeInTheDocument();

    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("Empresa SA")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("junta varios nombres del mismo rol separados por coma", () => {
    renderList();

    const reclamoConVarios = {
      ...reclamoBase,
      partes: [
        { rol: RECLAMANTE, parte: { nombre: "Juan Pérez" } },
        { rol: RECLAMANTE, parte: { nombre: "Ana López" } },
        { rol: RECLAMADO, parte: { nombre: "Empresa SA" } },
      ],
    };
    const row = capturedProps.columnBuilder({ data: reclamoConVarios, onDelete: onDelete });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByText("Juan Pérez, Ana López")).toBeInTheDocument();
  });

  it("muestra la próxima audiencia solo cuando está definida", () => {
    renderList();

    const { rerender } = render(
      <MemoryRouter>
        {capturedProps.columnBuilder({ data: reclamoBase, onDelete: onDelete }).columns[0].content}
      </MemoryRouter>
    );
    expect(screen.queryByText(/Próxima audiencia/)).not.toBeInTheDocument();

    const conAudiencia = { ...reclamoBase, proximaAudiencia: "2026-04-01T09:00:00" };
    const row = capturedProps.columnBuilder({ data: conAudiencia, onDelete: onDelete });
    rerender(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByText(/Próxima audiencia:/)).toBeInTheDocument();
  });

  it("oculta el botón de imprimir cuando el reclamo está PENDIENTE", () => {
    renderList();

    const row = capturedProps.columnBuilder({ data: reclamoBase, onDelete: onDelete });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.queryByTitle("Imprimir")).not.toBeInTheDocument();
  });

  it("muestra el botón de imprimir cuando el reclamo NO está PENDIENTE", () => {
    renderList();

    const reclamoResuelto = { ...reclamoBase, idResolucion: ACUERDO };
    const row = capturedProps.columnBuilder({ data: reclamoResuelto, onDelete: onDelete });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByTitle("Imprimir")).toHaveAttribute(
      "href",
      "/reclamos/acta/5"
    );
    expect(screen.getByText("Acuerdo")).toBeInTheDocument();
  });

  it("al hacer click en imprimir, llama a createActa con el id del reclamo", async () => {
    renderList();

    const reclamoResuelto = { ...reclamoBase, idResolucion: ACUERDO };
    const row = capturedProps.columnBuilder({ data: reclamoResuelto, onDelete: onDelete });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    fireEvent.click(screen.getByTitle("Imprimir"));

    // handlePrint hace await import(...) + await createActa(id), es asíncrono
    await waitFor(() => expect(createActa).toHaveBeenCalledWith(5));
  });

  it("al hacer click en eliminar, llama a onDelete con el id y un mensaje con el número de reclamo", () => {
    renderList();

    const onDelete = vi.fn();
    const row = capturedProps.columnBuilder({ data: reclamoBase, onDelete });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    fireEvent.click(screen.getByTitle("Eliminar"));

    expect(onDelete).toHaveBeenCalledTimes(1);
    const [, id, message] = onDelete.mock.calls[0];
    expect(id).toBe(5);

    render(message);
    expect(
      screen.getByText(/¿Está seguro que desea eliminar el reclamo Nº 42\?/)
    ).toBeInTheDocument();
  });
});
