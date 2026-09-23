import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Editor from "./Editor.jsx";

let capturedDialogProps;

vi.mock("@tiptap/react", () => ({
  EditorContent: () => <div data-testid="editor-content" />,
}));

vi.mock("../hooks/useEditor.js", () => ({
  default: () => ({
    editor: {},
    showClausulasFieldsDialog: true,
    isBold: false,
    setShowClausulasFieldsDialog: vi.fn(),
    toggleBold: vi.fn(),
    updateContent: vi.fn(),
  }),
}));

vi.mock("./ClausulasTemplateFormDialog", () => ({
  default: (props) => {
    capturedDialogProps = props;
    return <div data-testid="template-dialog" />;
  },
}));

describe("<Editor /> (ClausulasAcuerdo)", () => {
  it("pasa documentFields al diálogo de plantilla", () => {
    const documentFields = {
      reclamado: "Empresa SA",
      rubros: "Diferencias salariales",
      reclamante: { dni: 123, nombre: "Ana López" },
    };

    render(
      <Editor
        initialContent={null}
        documentFields={documentFields}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    expect(capturedDialogProps.defaultValues).toBe(documentFields);
  });
});