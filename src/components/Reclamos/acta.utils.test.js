import { describe, expect, it } from "vitest";
import {
  INCOMPARENDOS,
  PRESENCIALES,
  getComparecientes,
  joinPartes,
} from "./acta.utils.js";

const parte = (overrides = {}) => ({
  nombre: "Ana López",
  sintetico: "DNI",
  nroDocumento: "123",
  cuil: "20-123",
  domicilio: "Calle 1",
  localidad: "Rosario",
  incomparendoParte: false,
  ...overrides,
});

describe("acta.utils", () => {
  it("detecta comparecientes y letrados presenciales", () => {
    const data = {
      reclamantes: [parte({ patrocinante: { nombre: "Dr. Pérez" } })],
      reclamados: [parte({ incomparendoParte: true })],
    };

    expect(getComparecientes(data)).toEqual({
      existenReclamantes: true,
      existenReclamados: false,
      existenLetradosReclamantes: true,
      existenLetradosReclamados: false,
    });
  });

  it("concatena partes presenciales con datos de patrocinio y WhatsApp", () => {
    const data = {
      reclamantes: [
        parte({
          nroWhatsappParte: "385555111",
          patrocinante: {
            nombre: "Luis Gómez",
            nroMatricula: 55,
            domicilio: "San Martín 10",
            localidad: "Rosario",
            nroCasillero: 4,
          },
          nroWhatsappPatrocinante: "385555222",
        }),
      ],
      reclamados: [],
    };

    const result = joinPartes(data, PRESENCIALES);

    expect(result).toContain("Ana López");
    expect(result).toContain("DNI 123");
    expect(result).toContain("CUIL 20-123");
    expect(result).toContain("videollamada de Whatsapp");
    expect(result).toContain("Dr. Luis Gómez MP Nº 55");
  });

  it("filtra incomparecientes y agrega la notificación", () => {
    const data = {
      cantidad: 3,
      reclamantes: [parte({ incomparendoParte: true })],
      reclamados: [parte({ incomparendoParte: false })],
    };

    const result = joinPartes(data, INCOMPARENDOS);

    expect(result).toContain("3 fechas de audiencia");
    expect(result).not.toContain("reclamada/empleadora");
  });

  it("devuelve una cadena vacía si no hay partes del tipo solicitado", () => {
    expect(joinPartes({ reclamantes: [], reclamados: [] }, PRESENCIALES)).toBe("");
  });
});
