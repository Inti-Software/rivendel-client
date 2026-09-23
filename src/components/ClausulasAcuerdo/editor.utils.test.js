import { describe, expect, it } from "vitest";
import { cleanPastedHTML, EMPTY_DOC, fillTemplate } from "./editor.utils.js";

const fields = {
  puesto: "  Administrativo  ",
  fecha: "2026-03-15",
  fechaTelegrama: "2026-03-16",
  reclamado: "Empresa SA",
  importe: 1500,
  rubros: "Diferencias salariales",
  cuotas: { cantidad: 3, importe: 500, fechaPrimera: "2026-04-01" },
  reclamante: { dni: 12345678, nombre: "Ana López" },
  cuenta: {
    titular: "Luis Gómez",
    cuilTitular: "20123456789",
    entidad: "Banco Nación",
    alias: "alias.banco",
  },
};

describe("editor.utils", () => {
  it("exporta un documento vacío válido", () => {
    expect(EMPTY_DOC).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
  });

  it("sanitiza HTML y conserva solo tags permitidos", () => {
    expect(cleanPastedHTML("<p>Hola <strong>mundo</strong></p><script>alert(1)</script>")).toBe(
      "<p>Hola <strong>mundo</strong></p>"
    );
  });

  it("rellena la plantilla con datos, fechas y montos", () => {
    const result = fillTemplate(fields);

    expect(result).toContain("Administrativo");
    expect(result).toContain("15 de marzo de 2026");
    expect(result).toContain("16/03/2026");
    expect(result).toContain("Empresa SA");
    expect(result).toContain("1.500");
    expect(result).toContain("Diferencias salariales");
    expect(result).toContain("Ana López");
    expect(result).not.toContain("[PUESTO]");
  });

  it("mantiene placeholders cuando faltan datos y devuelve template completo con null", () => {
    expect(fillTemplate(null)).toContain("[PUESTO]");
    expect(
      fillTemplate({
        ...fields,
        puesto: "",
        reclamado: "",
        rubros: "",
        cuenta: { titular: "", cuilTitular: "", entidad: "", alias: "" },
        reclamante: { dni: 0, nombre: "" },
      })
    ).toContain("[RECLAMADO]");
  });
});
