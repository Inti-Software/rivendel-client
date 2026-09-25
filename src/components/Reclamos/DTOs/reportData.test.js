import { describe, expect, it } from "vitest";
import ReportData from "./reportData.js";
import { ACUERDO, FRACASO } from "../tiposResoluciones.js";

const baseData = {
  numero: 42,
  rubros: "Diferencias salariales",
  idResolucion: ACUERDO,
  conciliador: { nombre: "María García", nroHabilitacion: 123 },
  fechaHoraInicio: "2026-03-15T10:30:00",
  horaFin: "2026-03-15T11:30:00",
  proximaAudiencia: null,
  cantidad: 2,
  clausulas: { type: "doc" },
  reclamantes: [],
  reclamados: [],
};

const parte = (overrides = {}) => ({
  nombre: "Ana López",
  tipoDocumento: { sintetico: "DNI" },
  nroDocumento: "0",
  cuil: "20123456789",
  domicilio: "Calle 1",
  localidad: "Rosario",
  patrocinante: null,
  ...overrides,
});

describe("ReportData", () => {
  it("transforma un acuerdo y conserva sus datos principales", () => {
    const result = new ReportData({
      ...baseData,
      reclamantes: [parte()],
      reclamados: [parte({ nombre: "Empresa SA" })],
    });

    expect(result).toMatchObject({
      titulo: "ACUERDO CONCILIATORIO",
      numero: 42,
      rubros: "Diferencias salariales",
      conciliador: "María García",
      nroHabilitacion: 123,
      nombresReclamantes: "Ana López",
      nombresReclamados: "Empresa SA",
      cantidad: "dos",
    });
    expect(result.reclamantes[0]).toMatchObject({
      nombre: "Ana López",
      nroDocumento: "[No especificado]",
      cuil: "20123456789",
    });
  });

  it("genera título de fracaso y evita duplicar el patrocinante consecutivo", () => {
    const patrocinante = { nombre: "Luis Gómez", nroMatricula: 55 };
    const result = new ReportData({
      ...baseData,
      idResolucion: FRACASO,
      reclamantes: [parte({ patrocinante }), parte({ nombre: "Juan Pérez", patrocinante })],
      reclamados: [],
    });

    expect(result.titulo).toBe("CERTIFICACIÓN DE FRACASO RECLAMO 42");
    expect(result.reclamantes[0].patrocinante).toBe(null);
    expect(result.reclamantes[1].patrocinante).toMatchObject(patrocinante);
  });
});
