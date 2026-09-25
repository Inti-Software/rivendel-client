import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildDocument } from "./acta-builder.js";
import { Reclamos } from "../../api/repositories/reclamos.js";
import { ACUERDO, FRACASO } from "./tiposResoluciones.js";

vi.mock("../../api/repositories/reclamos.js", () => ({
  Reclamos: {
    get: vi.fn(),
  },
}));

vi.mock("./DTOs/reportData.js", () => ({
  default: class MockReportData {
    constructor(data) {
      Object.assign(this, data, {
        titulo: data.idResolucion === ACUERDO ? "ACUERDO CONCILIATORIO" : "FRACASO",
        fechaInicio: { dia: "15", mes: "marzo", anio: 2026, hora: "10:00" },
        horaFin: "11:00",
        nombresReclamantes: "Ana",
        nombresReclamados: "Empresa",
        reclamantes: [],
        reclamados: [],
      });
    }
  },
}));

describe("buildDocument", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("construye un documento de acuerdo con título y contenido", async () => {
    Reclamos.get.mockResolvedValue({
      ok: true,
      data: {
        id: 5,
        numero: 42,
        idResolucion: ACUERDO,
        clausulas: { content: [{ type: "paragraph", content: [{ type: "text", text: "Cláusula" }] }] },
        rubros: "Rubros",
        reclamantes: [],
        reclamados: [],
      },
    });

    const document = await buildDocument(5);

    expect(Reclamos.get).toHaveBeenCalledWith(5);
    expect(document).toMatchObject({
      pageSize: { width: 609.5, height: 935.5 },
      defaultStyle: { font: "Times", fontSize: 12 },
    });
    expect(document.content[0][0]).toMatchObject({ text: "RECLAMO Nº 42" });
    expect(document.content[0][1]).toMatchObject({
      text: "ACUERDO CONCILIATORIO",
      style: "header",
    });
  });

  it("construye el documento de fracaso sin cláusulas de acuerdo", async () => {
    Reclamos.get.mockResolvedValue({
      ok: true,
      data: {
        numero: 8,
        idResolucion: FRACASO,
        rubros: "Despido",
        reclamantes: [],
        reclamados: [],
      },
    });

    const document = await buildDocument(8);

    expect(document.content[0][0]).toMatchObject({ text: "FRACASO", style: "header" });
    expect(document.content[0]).toHaveLength(4);
  });

  it("genera un documento de error si falla la carga", async () => {
    Reclamos.get.mockResolvedValue({ ok: false, error: "Error de backend" });

    const document = await buildDocument(99);

    expect(document.content[0]).toMatchObject({
      text: "Error: Se produjo un error al obtener los datos del reclamo.",
      color: "red",
    });
  });

  it("genera un documento de error si no hay datos", async () => {
    Reclamos.get.mockResolvedValue({ ok: true, data: {} });

    const document = await buildDocument(100);

    expect(document.content[0].text).toBe(
      "Error: No se encontraron datos para el reclamo solicitado."
    );
  });
});
