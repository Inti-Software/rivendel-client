// tiptap-to-pdfmake.js
// Convierte el JSON que produce el editor Tiptap a la estructura `content`
// que espera pdfmake para generar el PDF en el navegador.
//
// Casos borde cubiertos:
//  - Párrafo vacío (line break visual)
//  - hardBreak (Shift+Enter) dentro de un párrafo
//  - Negrita parcial dentro de una frase o palabra
//  - Runs consecutivos con mismo estado de negrita (se fusionan)

const PARAGRAPH_SPACING_PT = 10;
const EMPTY_PARAGRAPH_HEIGHT_PT = 12;

/**
 * Punto de entrada principal.
 * @param {object} doc - Documento Tiptap (editor.getJSON())
 * @returns {Array} Array de nodos de contenido para pdfmake
 */
export function tiptapDocumentToPdfMake(doc) {
  return doc.content.map(paragraphToPdfMake);
}

export function paragraphToPdfMake(paragraph) {
  const inlineNodes = paragraph.content ?? [];
  if (inlineNodes.length === 0) {
    // return {
    //   text: "",
    //   margin: [0, 0, 0, EMPTY_PARAGRAPH_HEIGHT_PT],
    // };

    return "";
  }

  const runs = inlineNodesToRuns(inlineNodes);

  // return {
  //   text: mergeAdjacentRuns(runs),
  //   margin: [0, 0, 0, PARAGRAPH_SPACING_PT],
  // };

  return mergeAdjacentRuns(runs);
}

function inlineNodesToRuns(nodes) {
  const runs = [];

  for (const node of nodes) {
    if (node.type === "hardBreak") {
      // pdfmake interpreta "\n" dentro de un run como salto de línea real.
      const last = runs[runs.length - 1];
      if (last) {
        last.text += "\n";
      } else {
        runs.push({ text: "\n" });
      }
      continue;
    }

    // node.type === "text"
    const isBold = node.marks?.some((m) => m.type === "bold") ?? false;
    runs.push({
      text: node.text,
      ...(isBold ? { bold: true } : {}),
    });
  }

  return runs;
}

/**
 * Fusiona runs consecutivos que comparten el mismo estado de negrita.
 * No fusiona a través de un cambio de bold, preservando el límite exacto
 * de la negrita parcial dentro de una palabra o frase.
 */
function mergeAdjacentRuns(runs) {
  const merged = [];

  for (const run of runs) {
    const last = merged[merged.length - 1];
    const sameBoldState = !!last && !!last.bold === !!run.bold;

    if (last && sameBoldState) {
      last.text += run.text;
    } else {
      merged.push({ ...run });
    }
  }

  return merged;
}
