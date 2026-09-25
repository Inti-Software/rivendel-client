import { describe, expect, it } from "vitest";
import { numeroALetras } from "./numeros-a-letras.js";

describe("numeroALetras", () => {
  it.each([
    [0, "CERO"],
    [7, "SIETE"],
    [15, "QUINCE"],
    [21, "VEINTIUNO"],
    [105, "CIENTO CINCO"],
    [999, "NOVECIENTOS NOVENTA Y NUEVE"],
    [1500, "MIL QUINIENTOS"],
    [1000000, "UN MILLÓN"],
  ])("convierte %s correctamente", (value, expected) => {
    expect(numeroALetras(value)).toBe(expected);
  });

  it("admite la forma legal un mil", () => {
    expect(numeroALetras(1500, { unMilLegal: true })).toBe("UN MIL QUINIENTOS");
  });

  it("maneja negativos, decimales y valores no finitos", () => {
    expect(numeroALetras(-12)).toBe("MENOS DOCE");
    expect(numeroALetras(12.9)).toBe("DOCE");
    expect(numeroALetras(Number.NaN)).toBe("");
  });
});
