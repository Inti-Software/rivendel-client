import { describe, expect, it } from "vitest";
import { paragraphToPdfMake, tiptapDocumentToPdfMake } from "./tiptap-to-pdfmake.js";

describe("tiptap-to-pdfmake", () => {
  it("convierte un documento de párrafos en contenido PDFMake", () => {
    expect(
      tiptapDocumentToPdfMake({
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Hola" }] },
          { type: "paragraph" },
        ],
      })
    ).toEqual([[{ text: "Hola" }], ""]);
  });

  it("fusiona textos consecutivos con el mismo estado de negrita", () => {
    expect(
      paragraphToPdfMake({
        content: [
          { type: "text", text: "Hola " },
          { type: "text", text: "mundo" },
          { type: "text", text: "!", marks: [{ type: "bold" }] },
          { type: "text", text: "!", marks: [{ type: "bold" }] },
        ],
      })
    ).toEqual([
      { text: "Hola mundo" },
      { text: "!!", bold: true },
    ]);
  });

  it("preserva saltos hardBreak dentro del run anterior", () => {
    expect(
      paragraphToPdfMake({
        content: [
          { type: "text", text: "Línea 1" },
          { type: "hardBreak" },
          { type: "text", text: "Línea 2" },
        ],
      })
    ).toEqual([{ text: "Línea 1\nLínea 2" }]);
  });

  it("representa un hardBreak inicial como un salto independiente", () => {
    expect(paragraphToPdfMake({ content: [{ type: "hardBreak" }] })).toEqual([
      { text: "\n" },
    ]);
  });
});
