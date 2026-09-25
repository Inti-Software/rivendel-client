import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useEditor from "./useEditor.js";

const editor = {
  isActive: vi.fn().mockReturnValue(false),
  chain: vi.fn(() => ({
    focus: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    clearContent: vi.fn().mockReturnThis(),
    insertContent: vi.fn().mockReturnThis(),
    run: vi.fn(),
  })),
  commands: { focus: vi.fn() },
  getJSON: vi.fn(() => ({ type: "doc" })),
};

vi.mock("@tiptap/react", () => ({
  useEditor: vi.fn(() => editor),
  useEditorState: vi.fn(() => ({ isBold: false })),
}));

const HookHarness = ({ onChange = vi.fn() }) => {
  const state = useEditor(null, onChange);

  return (
    <div>
      <span data-testid="visible">{String(state.showClausulasFieldsDialog)}</span>
      <button onClick={() => state.setShowClausulasFieldsDialog(true)}>mostrar</button>
      <button onClick={() => state.toggleBold()}>negrita</button>
      <button onClick={() => state.updateContent("<p>Plantilla</p>")}>plantilla</button>
      <button onClick={() => state.updateContent(null)}>cancelar</button>
    </div>
  );
};

describe("useEditor", () => {
  it("abre el diálogo y alterna negrita", () => {
    render(<HookHarness />);

    fireEvent.click(screen.getByRole("button", { name: "mostrar" }));
    expect(screen.getByTestId("visible")).toHaveTextContent("true");

    fireEvent.click(screen.getByRole("button", { name: "negrita" }));
    expect(editor.chain).toHaveBeenCalled();
  });

  it("inserta una plantilla y cierra el diálogo", () => {
    render(<HookHarness />);

    fireEvent.click(screen.getByRole("button", { name: "mostrar" }));
    fireEvent.click(screen.getByRole("button", { name: "plantilla" }));

    expect(editor.commands.focus).toHaveBeenCalledWith("start");
    expect(screen.getByTestId("visible")).toHaveTextContent("false");
  });

  it("cierra el diálogo al cancelar sin insertar contenido", () => {
    render(<HookHarness />);

    fireEvent.click(screen.getByRole("button", { name: "mostrar" }));
    fireEvent.click(screen.getByRole("button", { name: "cancelar" }));

    expect(screen.getByTestId("visible")).toHaveTextContent("false");
  });
});
