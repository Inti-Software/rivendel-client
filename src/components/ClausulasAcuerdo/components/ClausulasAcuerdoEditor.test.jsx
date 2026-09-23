import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ClausulasAcuerdoEditor from "./ClausulasAcuerdoEditor.jsx";

vi.mock("./Editor", () => ({
  default: ({ initialContent, documentFields }) => (
    <div data-testid="editor">
      {initialContent?.type} {documentFields?.reclamado}
    </div>
  ),
}));

vi.mock("../../Shared/Spinner", () => ({
  default: () => <div data-testid="spinner">Cargando...</div>,
}));

describe("<ClausulasAcuerdoEditor />", () => {
  it("no renderiza cuando visible es false", () => {
    const { container } = render(
      <ClausulasAcuerdoEditor visible={false} content={null} reclamo={{}} onContentChange={vi.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza el título y el editor cuando está visible", async () => {
    render(
      <ClausulasAcuerdoEditor
        visible
        content={{ type: "doc" }}
        reclamo={{ reclamado: "Empresa" }}
        onContentChange={vi.fn()}
      />
    );

    expect(screen.getByText("Cláusulas")).toBeInTheDocument();
    expect(await screen.findByTestId("editor")).toHaveTextContent("doc Empresa");
  });
});
